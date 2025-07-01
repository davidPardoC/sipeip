export class MessageLogEvent {
  event: string;
  timestamp: string;
  prev?: Record<string, any>;
  current?: Record<string, any>;
  user?: string;
  message: string;
}
