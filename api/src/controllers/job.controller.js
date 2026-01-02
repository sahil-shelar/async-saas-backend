const { publishJob } = require("../services/queue.service");
const {
  createJob,
  getJobsByUser,
  getJobById,
  deleteJobById,
} = require("../services/job.service");


const createJobHandler = async (req, res) => {
  try {
    const { type, payload } = req.body;

    if (!type || !payload) {
      return res.status(400).json({ message: "type and payload are required" });
    }

    const job = await createJob(req.user.id, type, payload);

    // Publish to RabbitMQ (async, non-blocking)
    await publishJob(job);

    res.status(201).json({
      jobId: job._id,
      status: job.status,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listJobsHandler = async (req, res) => {
  try {
    const jobs = await getJobsByUser(req.user.id);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobHandler = async (req, res) => {
  try {
    const job = await getJobById(req.params.id, req.user.id);
    res.json(job);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteJobHandler = async (req, res) => {
  try {
    await deleteJobById(req.params.id, req.user.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


module.exports = {
  createJobHandler,
  listJobsHandler,
  getJobHandler,
  deleteJobHandler,
};
