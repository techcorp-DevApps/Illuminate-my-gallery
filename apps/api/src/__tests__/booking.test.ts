import { canPromoteBooking } from '../domain/booking';

describe('booking transitions', () => {
  it('allows pending -> confirmed', () => {
    expect(canPromoteBooking('pending', 'confirmed')).toBe(true);
  });

  it('disallows cancelled -> confirmed', () => {
    expect(canPromoteBooking('cancelled', 'confirmed')).toBe(false);
  });
});
