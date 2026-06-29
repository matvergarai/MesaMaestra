/** Pruebas unitarias del formulario reactivo de registro. */
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';import { vi } from 'vitest';
import { Registro } from './registro';
import { Auth } from '../../servicios/auth';

describe('RegistroComponent', () => {
  const authMock = {
    registrarUsuario: vi.fn().mockReturnValue({ exito: true }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [provideRouter([]), { provide: Auth, useValue: authMock }],
    }).compileComponents();
  });

  it('debería crear el componente de registro', () => {
    const fixture = TestBed.createComponent(Registro);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debería rechazar una contraseña que no cumple las 5 reglas de validación', () => {
    const fixture = TestBed.createComponent(Registro);
    const component = fixture.componentInstance;

    component.formulario.patchValue({
      nombreCompleto: 'Usuario Prueba',
      usuario: 'usuarioprueba',
      email: 'prueba@mesamaestra.cl',
      fechaNacimiento: '2000-01-01',
      password: 'abc',
      confirmarPassword: 'abc',
      direccion: '',
    });

    component.formulario.markAllAsTouched();
    component.onSubmit();

    expect(component.formulario.get('password')?.invalid).toBe(true);
    expect(authMock.registrarUsuario).not.toHaveBeenCalled();
  });

  it('no debería marcar confirmar contraseña como válido si la contraseña principal es débil', () => {
    const fixture = TestBed.createComponent(Registro);
    const component = fixture.componentInstance;

    component.formulario.patchValue({
      password: 'abc',
      confirmarPassword: 'abc',
    });
    component.formulario.get('password')?.markAsTouched();
    component.formulario.get('confirmarPassword')?.markAsTouched();

    expect(component.campoValido('confirmarPassword')).toBe(false);
    expect(component.campoInvalido('confirmarPassword')).toBe(false);
  });

  it('debería registrar un usuario con datos válidos', () => {    const fixture = TestBed.createComponent(Registro);
    const component = fixture.componentInstance;

    component.formulario.patchValue({
      nombreCompleto: 'Nuevo Usuario',
      usuario: 'nuevouser',
      email: 'nuevo@mesamaestra.cl',
      fechaNacimiento: '2000-06-15',
      password: 'Clave123!',
      confirmarPassword: 'Clave123!',
      direccion: 'Santiago',
    });

    component.onSubmit();

    expect(authMock.registrarUsuario).toHaveBeenCalledWith(
      expect.objectContaining({
        nombreCompleto: 'Nuevo Usuario',
        usuario: 'nuevouser',
        email: 'nuevo@mesamaestra.cl',
      }),
    );
  });
});
