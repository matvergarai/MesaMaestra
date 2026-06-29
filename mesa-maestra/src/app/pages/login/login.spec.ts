/** Pruebas unitarias del formulario reactivo de login. */
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Login } from './login';
import { Auth } from '../../servicios/auth';
import { Carrito } from '../../servicios/carrito';

describe('ComponenteLogin', () => {  const authMock = {
    iniciarSesion: vi.fn().mockReturnValue({ exito: false, mensaje: 'Usuario o contraseña incorrectos.' }),
  };

  const carritoMock = {
    sincronizarAlIniciarSesion: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: authMock },
        { provide: Carrito, useValue: carritoMock },
      ],
    }).compileComponents();
  });

  it('debería crear el componente de login', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debería invalidar el formulario reactivo si los campos están vacíos', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.onSubmit();

    expect(component.formulario.invalid).toBe(true);
    expect(component.usuarioInvalido).toBe(true);
    expect(component.passwordInvalido).toBe(true);
    expect(authMock.iniciarSesion).not.toHaveBeenCalled();
  });

  it('debería llamar al servicio Auth con credenciales válidas', () => {
    authMock.iniciarSesion.mockReturnValue({
      exito: true,
      sesion: { usuario: 'cliente', nombreCompleto: 'Cliente Demo', email: 'c@x.cl', rol: 'cliente' },
    });

    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.formulario.setValue({ usuario: 'cliente', password: 'Cliente123' });
    component.onSubmit();

    expect(authMock.iniciarSesion).toHaveBeenCalledWith('cliente', 'Cliente123');
    expect(carritoMock.sincronizarAlIniciarSesion).toHaveBeenCalledWith('cliente');
  });
});
