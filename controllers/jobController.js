import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { status, search, sort, jobType } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let result = Job.find(queryObject);
  result.skip(skip).limit(limit);
  if (sort === "lastest") {
    result.sort("-createdAt");
  }

  if (sort === "lastest") {
    result.sort("createdAt");
  }

  if (sort === "a-z") {
    result.sort("position");
  }

  if (sort === "z-a") {
    result.sort("-position");
  }

  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs: totalJobs, numOfPages });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { position, company } = req.body;
  const job = await Job.findOne({ _id: id });
  if (!position || !company) {
    throw new BadRequestError("Plea");
  }
  if (!job) {
    throw new NotFoundError(`No job found with jobId ${id}`);
  }
  checkPermissions(req.user.userId, job.createdBy);
  const updatedJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ job: updatedJob });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id });
  if (!job) {
    throw new NotFoundError(`No job found with jobId ${id}`);
  }
  checkPermissions(req.user.userId, job.createdBy);
  await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};

const getAJob = async (req, res) => {
  res.send("get job");
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
  const defaultStats = {
    pending: stats.pending || 0,
    declined: stats.declined || 0,
    interview: stats.interview || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ stats: defaultStats, monthlyApplications });
};

export { getAJob, getAllJobs, deleteJob, updateJob, showStats, createJob };
