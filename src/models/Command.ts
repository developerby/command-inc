import { z } from 'zod';

const validActions = ['start', 'stop', 'rotate', 'move', 'reset'] as const;
const validCharacters = ['Hanna', 'Joi', 'Alex', 'Mircea', 'Santa', 'Kai', 'Mike', 'Sami'] as const;
const activeActions = new Set(['start', 'rotate', 'move']);

const CommandSchema = z.object({
  action: z.enum(validActions),
  character: z.enum(validCharacters),
  timestamp: z.number().optional(),
});

export type Command = z.infer<typeof CommandSchema> & {
  activatedCharacter: boolean;
};

function isActivatedAction(action: Command['action']): boolean {
  return activeActions.has(action);
}

export function createCommand(data: string | ArrayBuffer): Command {
  let jsonString: string;

  if (typeof data === 'string') {
    jsonString = data;
  } else if (data instanceof ArrayBuffer) {
    jsonString = new TextDecoder().decode(data);
  } else {
    throw new Error('Unsupported data type');
  }

  const command = CommandSchema.parse(JSON.parse(jsonString));

  return {
    ...command,
    timestamp: command.timestamp ?? Date.now(),
    activatedCharacter: isActivatedAction(command.action),
  };
}
