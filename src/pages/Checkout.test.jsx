import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from './Checkout';

// mock de useNavigate() | capturamos navegacion sin cambiar de ruta real
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// mock del store usado en Checkout
import { Store } from '../data/store';
vi.mock('../data/store', async () => {
  const orig = await vi.importActual('../data/store');
  return {
    Store: {
      ...orig.Store,
      getCart: vi.fn().mockReturnValue([{ productId: 1, qty: 2 }]),
      getById: vi.fn().mockReturnValue({
        id: 1, name: 'AK-47 | Bloodsport', price: 15990, img: '/img/skins/AK-BLOODSPORT.png'
      }),
      clearCart: vi.fn()
    }
  };
});

// mock de validadores 
import * as validators from '../utils/validators';

// selectores comunes
const get = {
  nombre: () => screen.getByPlaceholderText(/juan pérez/i),
  email: () => screen.getByPlaceholderText(/usuario@duocuc\.cl/i),
  direccion: () => screen.getByPlaceholderText(/calle 123, comuna, ciudad/i),
  card: () => screen.getByPlaceholderText(/1234 5678 9012 3456/i),
  exp: () => screen.getByPlaceholderText(/mm\/yy/i),
  cvv: () => screen.getByPlaceholderText(/^123$/i),
  pagar: () => screen.getByRole('button', { name: /pagar ahora/i }),
};
const type = async (el, val) => { await userEvent.clear(el); await userEvent.type(el, val); };

describe('Checkout (real)', () => {
  // limpiamos mocks antes de cada test
  beforeEach(() => {
    mockNavigate.mockClear();
    Store.clearCart.mockClear();
  });

  // validacion de datos invalidos
  it('muestra errores con datos inválidos', async () => {
    render(<Checkout />);
    await type(get.email(), 'correo@invalido');
    await type(get.card(), '1234');
    await type(get.exp(), '00/00');
    await type(get.cvv(), '1');
    await userEvent.click(get.pagar());

    // errores esperados
    expect(screen.getByText(/nombre requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/email inválido o dominio no permitido/i)).toBeInTheDocument();
    expect(screen.getByText(/dirección requerida/i)).toBeInTheDocument();
    expect(screen.getByText(/tarjeta inválida \(revisa los 16 dígitos\)/i)).toBeInTheDocument();
    expect(screen.getByText(/expiración inválida \(usa mm\/yy y que no esté vencida\)/i)).toBeInTheDocument();
    expect(screen.getByText(/cvv inválido \(3 dígitos\)/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  }, 15000);

  // formulario valido = exito
  it('con datos válidos navega a /compra-exitosa y limpia el carrito', async () => {
    render(<Checkout />);
    await type(get.nombre(), 'Juan Pérez');
    await type(get.email(), 'test@duocuc.cl');
    await type(get.direccion(), 'Calle 123, Comuna, Ciudad');
    await type(get.card(), '4111111111111111'); // válida
    await type(get.exp(), '12/30');
    await type(get.cvv(), '123');
    await userEvent.click(get.pagar());

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/compra-exitosa');
      expect(Store.clearCart).toHaveBeenCalled();
    }, { timeout: 2000 });
  }, 15000);

  // forzamos validaciones a pasar
  it('si la tarjeta termina en 0 navega a /compra-fallida', async () => {
    // forzamos los validadores a retornar true
    const spyLuhn   = vi.spyOn(validators, 'luhnCheck').mockReturnValue(true);
    const spyCVV    = vi.spyOn(validators, 'validateCVV').mockReturnValue(true);
    const spyExpiry = vi.spyOn(validators, 'validateExpiry').mockReturnValue(true);
    const spyEmail  = vi.spyOn(validators, 'validateEmail').mockReturnValue(true);

    render(<Checkout />);

    await type(get.nombre(), 'Juan Pérez');
    await type(get.email(), 'test@duocuc.cl');
    await type(get.direccion(), 'Calle 123, Comuna, Ciudad');
    await type(get.card(), '4111111111111110'); // si termina en cero es ruta fallida
    await type(get.exp(), '12/30');
    await type(get.cvv(), '123');
    await userEvent.click(get.pagar());

    // navegamos a compra fallida (en caso de ser rechazado)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/compra-fallida');
      expect(Store.clearCart).not.toHaveBeenCalled();
    }, { timeout: 2000 });

    // restauramos los mocks
    spyLuhn.mockRestore();
    spyCVV.mockRestore();
    spyExpiry.mockRestore();
    spyEmail.mockRestore();
  }, 15000);
});
