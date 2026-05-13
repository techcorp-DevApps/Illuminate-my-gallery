function canAccessPrivatePortal(isAuthenticated: boolean): boolean {
  return isAuthenticated;
}

describe('private portal access guard', () => {
  it('grants access when authenticated', () => {
    expect(canAccessPrivatePortal(true)).toBe(true);
  });
});
