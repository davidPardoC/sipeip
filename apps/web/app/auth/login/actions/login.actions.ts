"use server";

import { publishLogEvent } from "@/infraestructure/kafka/kafka.publisher";

export const login = async () => {
  publishLogEvent({
    event: "login-user",
    timestamp: new Date().toISOString(),
    message: "User logged in",
  });
};
