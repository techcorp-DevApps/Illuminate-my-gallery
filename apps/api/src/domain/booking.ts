export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export function canPromoteBooking(from: BookingStatus, to: BookingStatus): boolean {
  if (from === 'cancelled') return false;
  if (from === 'pending' && to === 'confirmed') return true;
  if (from === to) return true;
  return to === 'cancelled';
}
