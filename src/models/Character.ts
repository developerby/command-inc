import { z } from 'zod';

const validCharacters = ['Hanna', 'Joi', 'Alex', 'Mircea', 'Santa', 'Kai', 'Mike', 'Sami'] as const;

export const CharacterSchema = z.object({
  name: z.enum(validCharacters),
});

export type Character = z.infer<typeof CharacterSchema>;
