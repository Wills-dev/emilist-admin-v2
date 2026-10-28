import { beforeEach, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

it('fails closed before dispatch when no backend is configured', async () => {
  vi.doMock('@/config/env', () => ({
    publicEnv: { apiBaseUrl: undefined, apiTimeoutMs: 15000 },
  }));
  const { apiClient } = await import('./apiClient');
  const adapter = vi.fn();
  await expect(
    apiClient.get('/unconfirmed', { adapter }),
  ).rejects.toMatchObject({ code: 'configuration' });
  expect(adapter).not.toHaveBeenCalled();
});

it('rejects absolute endpoint URLs before dispatch', async () => {
  vi.doMock('@/config/env', () => ({
    publicEnv: { apiBaseUrl: 'https://api.example.com', apiTimeoutMs: 15000 },
  }));
  const { apiClient } = await import('./apiClient');
  const adapter = vi.fn();
  await expect(
    apiClient.get('https://other.example.com/private', { adapter }),
  ).rejects.toMatchObject({ code: 'configuration' });
  expect(adapter).not.toHaveBeenCalled();
});

it('blocks administrative reads and writes in every deployment before the adapter runs', async () => {
  vi.doMock('@/config/env', () => ({
    publicEnv: {
      apiBaseUrl: 'https://admin.example.invalid',
      apiTimeoutMs: 15000,
    },
  }));
  try {
    const { apiClient } = await import('./apiClient');
    const adapter = vi.fn();
    for (const method of ['get', 'post', 'patch', 'delete'] as const) {
      await expect(
        apiClient.request({ method, url: '/private', adapter }),
      ).rejects.toMatchObject({ code: 'configuration' });
    }
    expect(adapter).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllEnvs();
  }
});
