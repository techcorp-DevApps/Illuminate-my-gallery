function isTrackerVisibleToClient(lastAdminUpdateAt: string, clientSnapshotAt: string): boolean {
  return new Date(lastAdminUpdateAt).getTime() <= new Date(clientSnapshotAt).getTime();
}

describe('tracker update visibility', () => {
  it('reflects admin updates on or before client refresh time', () => {
    expect(isTrackerVisibleToClient('2026-05-13T10:00:00Z', '2026-05-13T10:00:00Z')).toBe(true);
  });
});
