const { getChannel } = require("../config/rabbitmq");

const QUEUE_NAME = "job_queue";

const publishJob = async (job) => {
  const channel = getChannel();

  const message = {
    jobId: job._id.toString(),
    type: job.type,
    payload: job.payload,
  };

  channel.sendToQueue(
    QUEUE_NAME,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );
};

module.exports = {
  publishJob,
};
