import { Command } from '../models/Command';
import { Character, CharacterSchema } from '../models/Character';
import { SessionEvent, SessionEventSchema } from '../models/Session';

export function createSessionEvent(command: Command): SessionEvent {
  const character = CharacterSchema.parse({ name: command.character ?? 'Joi' });

  const rawEvent = {
    timestamp: Date.now(),
    command,
    character,
  };

  return SessionEventSchema.parse(rawEvent);
}
