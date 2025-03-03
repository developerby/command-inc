import Bindings from '../bindings';

describe('Bindings Interface', () => {
  it('should have the correct structure', () => {
    const mockBindings: Bindings = {
      COMMAND_INC_DO: {} as DurableObjectNamespace,
      COMMAND_INC_HISTORY: {} as KVNamespace,
      REQUEST_LOGS: {} as KVNamespace,
    };

    expect(mockBindings).toHaveProperty('COMMAND_INC_DO');
    expect(mockBindings).toHaveProperty('COMMAND_INC_HISTORY');
    expect(mockBindings).toHaveProperty('REQUEST_LOGS');
  });
});
