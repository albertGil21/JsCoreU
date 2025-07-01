import express from 'express';
import prisma from '../../config/prisma.js';

const router = express.Router();

router.post('/cliente', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      email,
      contrasena,
      telefono,
      dni,
      foto_perfil,
      ubicacion // { lat, lng }
    } = req.body;

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

    const cliente = await prisma.cliente.findUnique({ where: { id_usuario: usuario.id_usuario } });

    res.status(201).json({ usuario, cliente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;