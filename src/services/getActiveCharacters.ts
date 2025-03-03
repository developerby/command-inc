import { Session } from '../models/Session';

const activeActions = ['start', 'rotate', 'move'] as const;

type ActiveAction = (typeof activeActions)[number];

export function getActiveCharacters(session: Session): string[] {
  const lastCommandByCharacter: Record<string, ActiveAction> = {};

  for (const event of session.events) {
    const characterName = event.character.name;
    const action = event.command.action as ActiveAction;

    lastCommandByCharacter[characterName] = action;
  }

  const activeCharacters = Object.entries(lastCommandByCharacter)
    .filter(([_, lastCommand]) => activeActions.includes(lastCommand))
    .map(([characterName]) => characterName);

  return activeCharacters;
}
