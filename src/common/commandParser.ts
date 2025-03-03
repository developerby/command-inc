import { Command, CommandSchema } from '../models/Command';

export function parseCommandFromWebSocketData(data: string | ArrayBuffer): Command {
  let parsedData: unknown;

  if (typeof data === 'string') {
    parsedData = JSON.parse(data);
  } else if (data instanceof ArrayBuffer) {
    const text = new TextDecoder().decode(data);
    parsedData = JSON.parse(text);
  } else {
    throw new Error('Unsupported WebSocket data type');
  }

  return CommandSchema.parse(parsedData);
}
