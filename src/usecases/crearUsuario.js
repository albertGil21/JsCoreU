import {
  crearUsuario as crearUsuarioRepo,
  crearCliente,
  crearReparador
} from '../infrastructure/mysql/usuarioRepo.js';

export async function crearUsuarioYRol({ nombres, apellidos, email, contrasena, telefono, dni, foto_perfil, rol, ubicacion, disponibilidad }) {
  // Agrega id_estado_usuario: 1
  const usuario = await crearUsuarioRepo({
    nombres,
    apellidos,
    email,
    contrasena,
    telefono,
    dni,
    foto_perfil,
    id_estado_usuario: 1 // <--- ¡Esto es obligatorio!
  });

  let extra = null;
  if (rol === 'cliente') {
    extra = await crearCliente(usuario.id_usuario, ubicacion);
  } else if (rol === 'reparador') {
    extra = await crearReparador(usuario.id_usuario, disponibilidad);
  }

  return { usuario, extra };
}