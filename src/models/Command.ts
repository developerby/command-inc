import { z } from 'zod';

const validActions = ['start', 'stop', 'rotate', 'move', 'reset'] as const;

export const CommandSchema = z.object({
  action: z.enum(validActions),
  character: z.string().optional(),
  payload: z.any().optional(),
});

export type Command = z.infer<typeof CommandSchema>;
