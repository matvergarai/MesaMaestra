/**
 * MesaMaestra - validaciones.js
 * Validación de formularios con feedback visual (clases Bootstrap custom).
 * Usado en registro, login, recuperar contraseña y perfil.
 */

/* ─── Feedback visual en campos ────────────────────────────── */

function mostrarError(input, mensaje) {
  input.classList.add('campo-invalido');
  input.classList.remove('campo-valido');
  const errorEl = document.getElementById('error-' + input.id);
  if (errorEl) {
    errorEl.textContent = mensaje;
    errorEl.classList.add('visible');
  }
}

function mostrarValido(input) {
  input.classList.remove('campo-invalido');
  input.classList.add('campo-valido');
  const errorEl = document.getElementById('error-' + input.id);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function limpiarValidaciones(formulario) {
  const inputs = formulario.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.classList.remove('campo-invalido', 'campo-valido');
    const errorEl = document.getElementById('error-' + input.id);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  });
}

/* ─── Reglas reutilizables ─────────────────────────────────── */

function validarCampoVacio(input, nombreCampo) {
  if (!input.value.trim()) {
    mostrarError(input, nombreCampo + ' es obligatorio.');
    return false;
  }
  mostrarValido(input);
  return true;
}

function validarEmail(input) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(input.value.trim())) {
    mostrarError(input, 'Ingrese un correo electrónico válido.');
    return false;
  }
  mostrarValido(input);
  return true;
}

/** Exige 6–18 caracteres, mayúscula, minúscula, número y carácter especial. */
function validarPassword(input) {
  const password = input.value;
  const errores = [];

  if (password.length < 6 || password.length > 18) {
    errores.push('entre 6 y 18 caracteres');
  }
  if (!/[0-9]/.test(password)) {
    errores.push('al menos un número');
  }
  if (!/[A-Z]/.test(password)) {
    errores.push('al menos una mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    errores.push('al menos una minúscula');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errores.push('al menos un carácter especial');
  }

  if (errores.length > 0) {
    mostrarError(input, 'La contraseña debe tener ' + errores.join(', ') + '.');
    return false;
  }
  mostrarValido(input);
  return true;
}

function validarPasswordCoincide(password, confirmar) {
  if (password.value !== confirmar.value) {
    mostrarError(confirmar, 'Las contraseñas no coinciden.');
    return false;
  }
  mostrarValido(confirmar);
  return true;
}

function validarEdadMinima(input, edadMinima) {
  const fecha = new Date(input.value);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  if (edad < edadMinima) {
    mostrarError(input, 'Debes tener al menos ' + edadMinima + ' años.');
    return false;
  }
  mostrarValido(input);
  return true;
}

/* ─── Handlers de formularios ──────────────────────────────── */

function validarRegistro(event) {
  event.preventDefault();
  const form = event.target;
  let valido = true;

  const nombre = form.nombreCompleto;
  const usuario = form.usuario;
  const email = form.email;
  const password = form.password;
  const confirmar = form.confirmarPassword;
  const fechaNac = form.fechaNacimiento;

  valido = validarCampoVacio(nombre, 'Nombre completo') && valido;
  valido = validarCampoVacio(usuario, 'Nombre de usuario') && valido;
  valido = validarEmail(email) && valido;
  valido = validarPassword(password) && valido;
  valido = validarPasswordCoincide(password, confirmar) && valido;
  valido = validarCampoVacio(fechaNac, 'Fecha de nacimiento') && valido;
  valido = validarEdadMinima(fechaNac, 13) && valido;

  if (!valido) return false;

  const usuarios = obtenerUsuarios();
  if (usuarios.some(u => u.usuario === usuario.value.trim())) {
    mostrarError(usuario, 'Este nombre de usuario ya existe.');
    return false;
  }
  if (usuarios.some(u => u.email === email.value.trim())) {
    mostrarError(email, 'Este correo ya está registrado.');
    return false;
  }

  usuarios.push({
    nombreCompleto: nombre.value.trim(),
    usuario: usuario.value.trim(),
    email: email.value.trim(),
    password: password.value,
    fechaNacimiento: fechaNac.value,
    direccion: form.direccion.value.trim(),
    rol: 'cliente'
  });
  guardarUsuarios(usuarios);

  const mensajeExito = document.getElementById('mensaje-exito');
  if (mensajeExito) {
    mensajeExito.textContent = 'Registro exitoso. Redirigiendo al inicio de sesión...';
    mensajeExito.classList.remove('d-none');
  }

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 2000);

  return false;
}

function validarLogin(event) {
  event.preventDefault();
  const form = event.target;
  let valido = true;

  const usuario = form.usuario;
  const password = form.password;

  valido = validarCampoVacio(usuario, 'Usuario o correo') && valido;
  valido = validarCampoVacio(password, 'Contraseña') && valido;

  if (!valido) return false;

  const resultado = iniciarSesion(usuario.value.trim(), password.value);
  const mensajeError = document.getElementById('mensaje-error-login');

  if (resultado.exito) {
    if (resultado.sesion.rol === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = '../index.html';
    }
  } else {
    if (mensajeError) {
      mensajeError.textContent = resultado.mensaje;
      mensajeError.classList.remove('d-none');
    }
  }

  return false;
}

/** Simula envío de enlace de recuperación si el correo existe en el sistema. */
function validarRecuperar(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email;

  if (!validarEmail(email)) return false;

  const usuarios = obtenerUsuarios();
  const existe = usuarios.some(u => u.email === email.value.trim());

  const mensaje = document.getElementById('mensaje-recuperar');
  if (mensaje) {
    if (existe) {
      mensaje.textContent = 'Se ha enviado un enlace de recuperación a ' + email.value + ' (simulado).';
      mensaje.className = 'mensaje-exito mt-3';
    } else {
      mensaje.textContent = 'No existe una cuenta con ese correo electrónico.';
      mensaje.className = 'mensaje-error visible mt-3';
    }
  }

  return false;
}

function validarPerfil(event) {
  event.preventDefault();
  const sesion = obtenerSesion();
  if (!sesion) return false;

  const form = event.target;
  let valido = true;

  const nombre = form.nombreCompleto;
  const email = form.email;
  const fechaNac = form.fechaNacimiento;

  valido = validarCampoVacio(nombre, 'Nombre completo') && valido;
  valido = validarEmail(email) && valido;
  valido = validarCampoVacio(fechaNac, 'Fecha de nacimiento') && valido;
  valido = validarEdadMinima(fechaNac, 13) && valido;

  if (form.password.value) {
    valido = validarPassword(form.password) && valido;
    valido = validarPasswordCoincide(form.password, form.confirmarPassword) && valido;
  }

  if (!valido) return false;

  const usuarios = obtenerUsuarios();
  const index = usuarios.findIndex(u => u.usuario === sesion.usuario);

  if (index !== -1) {
    usuarios[index].nombreCompleto = nombre.value.trim();
    usuarios[index].email = email.value.trim();
    usuarios[index].fechaNacimiento = fechaNac.value;
    usuarios[index].direccion = form.direccion.value.trim();
    if (form.password.value) {
      usuarios[index].password = form.password.value;
    }
    guardarUsuarios(usuarios);

    sesion.nombreCompleto = nombre.value.trim();
    sesion.email = email.value.trim();
    localStorage.setItem('mesamaestra_sesion', JSON.stringify(sesion));
  }

  const mensajeExito = document.getElementById('mensaje-exito-perfil');
  if (mensajeExito) {
    mensajeExito.textContent = 'Perfil actualizado correctamente.';
    mensajeExito.classList.remove('d-none');
  }

  return false;
}

function limpiarFormulario(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
    limpiarValidaciones(form);
    const mensajes = form.parentElement.querySelectorAll('.mensaje-exito, .mensaje-error');
    mensajes.forEach(m => {
      m.textContent = '';
      m.classList.add('d-none');
    });
  }
}
