import { advanceContractState } from '../state/contract-state';

describe('contract state transitions', () => {
  it('moves from inbox to signed', () => {
    expect(advanceContractState('inbox')).toBe('signed');
  });
});
