const Job = require("../models/job.model");

const createJob = async (userId, type, payload) => {
  const job = await Job.create({
    userId,
    type,
    payload,
  });

  return job;
};

const getJobsByUser = async (userId) => {
  return Job.find({ userId }).sort({ createdAt: -1 });
};

const getJobById = async (jobId, userId) => {
  const job = await Job.findOne({ _id: jobId, userId });
  if (!job) {
    throw new Error("Job not found or access denied");
  }
  return job;
};

const deleteJobById = async (jobId, userId) => {
  const job = await Job.findOneAndDelete({ _id: jobId, userId });
  if (!job) {
    throw new Error("Job not found or access denied");
  }
  return job;
};

module.exports = {
  createJob,
  getJobsByUser,
  getJobById,
  deleteJobById,
};
