import prisma from '../../config/prisma.js';

export async function crearUsuario(data) {
  return await prisma.usuario.create({ data });
}

// Espera que 'ubicacion' sea un objeto: { lat: number, lng: number }
export async function crearCliente(id_usuario, ubicacion = null) {
  if (!ubicacion || typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number') {
    throw new Error('ubicacion debe ser un objeto con lat y lng numéricos');
  }
  // Usamos $executeRawUnsafe porque Prisma no soporta parámetros en funciones geométricas
  await prisma.$executeRawUnsafe(
    `INSERT INTO cliente (id_usuario, ubicacion) VALUES (?, ST_GeomFromText(?))`,
    id_usuario,
    `POINT(${ubicacion.lat} ${ubicacion.lng})`
  );
  // Opcional: puedes retornar el cliente recién creado si lo necesitas
  return await prisma.cliente.findUnique({ where: { id_usuario } });
}

export async function crearReparador(id_usuario, disponibilidad = true) {
  return await prisma.reparador.create({
    data: { id_usuario, disponibilidad }
  });
}

export async function crearUsuarioYCliente({
  nombres,
  apellidos,
  email,
  contrasena,
  telefono,
  dni,
  foto_perfil,
  ubicacion // { lat, lng }
}) {
  // 1. Crear usuario con estado inicial
  const usuario = await prisma.usuario.create({
    data: {
      nombres,
      apellidos,
      email,
      contrasena,
      telefono,
      dni,
      foto_perfil,
      id_estado_usuario: 1 // Estado inicial por defecto
    }
  });

  // 2. Crear cliente usando SQL raw para ubicación tipo POINT
  if (!ubicacion || typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number') {
    throw new Error('ubicacion debe ser un objeto con lat y lng numéricos');
  }

  await prisma.$executeRawUnsafe(
    `INSERT INTO cliente (id_usuario, ubicacion) VALUES (?, ST_GeomFromText(?))`,
    usuario.id_usuario,
    `POINT(${ubicacion.lat} ${ubicacion.lng})`
  );

  // 3. Retornar usuario y cliente
  const cliente = await prisma.cliente.findUnique({ where: { id_usuario: usuario.id_usuario } });
  return { usuario, cliente };
}