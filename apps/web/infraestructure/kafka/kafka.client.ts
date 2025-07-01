import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
    brokers: ['localhost:9094'],
    clientId: 'sipeip-logger-web',
})