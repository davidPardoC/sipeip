import { auth } from "@/auth";
import { kafka } from "./kafka.client";

const producer = kafka.producer();

type KafkaEventLog = {
  event: string;
  timestamp?: string;
  userId?: string;
  resourceId?: number;
  before?: Record<string, any>;
  after?: Record<string, any>;
  message?: string;
};

const publishMessage = async (topic: string, message: KafkaEventLog) => {
  await producer.connect();
  await producer.send({
    messages: [{ value: JSON.stringify(message) }],
    topic,
  });
  await producer.disconnect();
};

export const publishLogEvent = async (message: KafkaEventLog) => {
  try {
    await publishMessage("event-log-core", message);
  } catch (error) {
    console.error("Error publishing message:", error);
  }
};
