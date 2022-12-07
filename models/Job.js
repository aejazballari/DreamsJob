import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      defualt: "full-time",
    },
    jobLocation: {
      type: String,
      required: true,
      default: "my city",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide user"],
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
