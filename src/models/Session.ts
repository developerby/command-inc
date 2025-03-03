import { z } from 'zod';

import { CommandSchema } from './Command';
import { CharacterSchema } from './Character';

export const SessionEventSchema = z.object({
  timestamp: z.number(),
  command: CommandSchema,
  character: CharacterSchema,
});

export type SessionEvent = z.infer<typeof SessionEventSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  events: z.array(SessionEventSchema),
});

export type Session = z.infer<typeof SessionSchema>;
