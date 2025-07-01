import { kafka } from "./kafka.client";

const producer = kafka.producer();

const publishMessage = async (topic: string, message: any) => {
  await producer.connect();
  await producer.send({
    messages: [{ value: JSON.stringify(message) }],
    topic,
  });
  await producer.disconnect();
};

export const publishLogEvent = async (message: any) => {
  try {
    await publishMessage("event-log-core", message);
  } catch (error) {
    console.error("Error publishing message:", error);
  }
};
