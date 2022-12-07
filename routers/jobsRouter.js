import {
  getAJob,
  getAllJobs,
  deleteJob,
  updateJob,
  showStats,
  createJob,
} from "../controllers/jobController.js";
import { Router } from "express";

const router = Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/stats").get(showStats);
router.route("/:id").patch(updateJob).delete(deleteJob).get(getAJob);

export default router;
