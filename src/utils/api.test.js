import { describe, it, expect, vi, afterEach } from 'vitest';
import fetchJson from './api';

afterEach(() => vi.restoreAllMocks());

describe('fetchJson', () => {
    // si la api responde correctamente
  it('retorna JSON cuando la respuesta es 200', async () => {
    // se simula una respuesta exitosa
    const mockData = [{ id: 1, name: 'AK-47' }];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, status: 200, json: () => Promise.resolve(mockData)
    }));
    const data = await fetchJson('/api/products');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/api/products', expect.any(Object));
  });

  // si la api responde con error
  it('lanza error cuando la respuesta no es ok', async () => {
    // se simula un error del servidor en este caso (HTTP 500)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 500, statusText: 'Server Error',
      text: () => Promise.resolve('boom')
    }));
    await expect(fetchJson('/api/fail')).rejects.toThrow('HTTP 500: boom');
  });
});
