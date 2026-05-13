export type ContractState = 'inbox' | 'signed' | 'archived';

export function advanceContractState(state: ContractState): ContractState {
  if (state === 'inbox') return 'signed';
  if (state === 'signed') return 'archived';
  return 'archived';
}
