import express from 'express';
import prisma from '../../config/prisma.js';

const router = express.Router();

router.post('/reparador ', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      email,
      contrasena,
      telefono,
      dni,
      foto_perfil,
      disponibilidad,
      especialidades // array de IDs de especialidad
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

    // 2. Crear reparador
    const reparador = await prisma.reparador.create({
      data: {
        id_usuario: usuario.id_usuario,
        disponibilidad
      }
    });

    // 3. Registrar especialidades
    if (Array.isArray(especialidades) && especialidades.length > 0) {
      const data = especialidades.map(id_especialidad => ({
        id_reparador: reparador.id_reparador,
        id_especialidad
      }));
      await prisma.reparador_especialidad.createMany({ data });
    }

    res.status(201).json({ usuario, reparador });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;