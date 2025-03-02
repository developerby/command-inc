import { fetchUserByJWT, User, UserSchema } from '../User';

describe('User Model', () => {
  it('should validate a correct user object', () => {
    const validUser = {
      id: 1,
      email: 'user@example.com',
    };

    expect(() => UserSchema.parse(validUser)).not.toThrow();
  });

  it('should throw an error for an invalid user object', () => {
    const invalidUser = {
      id: 'not-a-number',
      email: '',
    };

    expect(() => UserSchema.parse(invalidUser)).toThrow();
  });

  it('should fetch a user by JWT', () => {
    const jwt = 'some-jwt-token';
    const user: User = fetchUserByJWT(jwt);

    expect(user).toEqual({
      id: 1,
      email: 'user@example.com',
    });
  });
});