const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue("job_queue", { durable: true });

    console.log("RabbitMQ connected");
  } catch (error) {
    console.error("RabbitMQ connection failed:", error.message);
    process.exit(1);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel,
};
