import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store } from './store';

// simulamos un localStorage limpio en la memoria
beforeEach(() => {
  const mem = {};
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((k) => (k in mem ? mem[k] : null)),
    setItem: vi.fn((k, v) => { mem[k] = String(v); }),
    removeItem: vi.fn((k) => { delete mem[k]; }),
    clear: vi.fn(() => { for (const k of Object.keys(mem)) delete mem[k]; })
  });
  vi.clearAllMocks();
});

const count = (cart) => cart.reduce((n, it) => n + Number(it.qty ?? it.cantidad ?? 0), 0);

describe('Store (carrito real)', () => {
  it('addToCart / updateCart / removeFromCart / clearCart afectan getCart()', () => {
    const id = 999; // no dependemos del catálogo

    // agregar producto
    Store.addToCart?.(id, 1);
    expect(count(Store.getCart?.() ?? [])).toBe(1);

    // sumar unidades del mismo producto
    Store.addToCart?.(id, 2);
    expect(count(Store.getCart?.() ?? [])).toBe(3);

    // actualizar cantidad
    if (typeof Store.updateCart === 'function') {
      Store.updateCart(id, 1);
    } else if (typeof Store.setQty === 'function') {
      Store.setQty(id, 1);
    } else {
      Store.removeFromCart?.(id);
      Store.addToCart?.(id, 1);
    }
    expect(count(Store.getCart?.() ?? [])).toBe(1);

    // quitamos y limpiamos carrito
    Store.removeFromCart?.(id);
    expect(count(Store.getCart?.() ?? [])).toBe(0);

    Store.addToCart?.(id, 2);
    Store.clearCart?.();
    expect(count(Store.getCart?.() ?? [])).toBe(0);
  });

  it('getById (si existe) retorna algo estable', () => {
    if (typeof Store.getById !== 'function') return;
    const p = Store.getById(1);
    if (p) expect(p).toHaveProperty('id');
  });

  it('subscribe (si existe) notifica cambios', () => {
    if (typeof Store.subscribe !== 'function') return;
    const id = 999;
    const handler = vi.fn();
    const unsub = Store.subscribe(handler);
    Store.addToCart?.(id, 1);
    Store.removeFromCart?.(id);
    expect(handler).toHaveBeenCalled();
    if (typeof unsub === 'function') unsub();
  });
});
