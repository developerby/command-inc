import { createCommand, Command } from '../Command';

describe('Command Model', () => {
  it('should parse a valid command from a string', () => {
    const data = JSON.stringify({ action: 'start', character: 'Hanna' });
    const command:Command = createCommand(data);

    expect(command.action).toBe('start');
    expect(command.character).toBe('Hanna');
    expect(command.activatedCharacter).toBe(true);
    expect(typeof command.timestamp).toBe('number');
  });

  it('should parse a valid command from an ArrayBuffer', () => {
    const data = new TextEncoder().encode(JSON.stringify({ action: 'move', character: 'Joi' }));
    const command: Command = createCommand(data.buffer as ArrayBuffer);

    expect(command.action).toBe('move');
    expect(command.character).toBe('Joi');
    expect(command.activatedCharacter).toBe(true);
    expect(typeof command.timestamp).toBe('number');
  });

  it('should throw an error for unsupported data type', () => {
    expect(() => createCommand(123 as any)).toThrow('Unsupported data type');
  });

  it('should throw an error for invalid action', () => {
    const data = JSON.stringify({ action: 'invalid', character: 'Hanna' });
    expect(() => createCommand(data)).toThrow();
  });

  it('should throw an error for invalid character', () => {
    const data = JSON.stringify({ action: 'start', character: 'Invalid' });
    expect(() => createCommand(data)).toThrow();
  });

  it('should set activatedCharacter to false for non-active actions', () => {
    const data = JSON.stringify({ action: 'stop', character: 'Alex' });
    const command: Command = createCommand(data);

    expect(command.activatedCharacter).toBe(false);
  });
});