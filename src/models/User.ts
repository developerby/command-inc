import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().min(1, 'Email is required'),
});

export type User = z.infer<typeof UserSchema>;

export function fetchUserByJWT(jwt: string): User {
  const user = UserSchema.parse({
    id: 1,
    email: 'user@example.com',
  });

  return user;
}
