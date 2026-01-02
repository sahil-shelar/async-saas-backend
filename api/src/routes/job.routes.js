const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createJobHandler,
  listJobsHandler,
  getJobHandler,
  deleteJobHandler,
} = require("../controllers/job.controller");

router.use(authMiddleware);

router.post("/", createJobHandler);
router.get("/", listJobsHandler);
router.get("/:id", getJobHandler);
router.delete("/:id", deleteJobHandler);

module.exports = router;
