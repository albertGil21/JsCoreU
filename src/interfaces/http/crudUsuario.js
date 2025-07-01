import express from 'express';
import prisma from '../../config/prisma.js';

const router = express.Router();

// READ usuario por ID (incluye cliente y reparador)
router.get('/:id', async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: Number(req.params.id) },
      include: {
        estado_usuario: true,
        cliente: {
          include: { solicitud: true }
        },
        reparador: {
          include: {
            reparador_especialidad: { include: { especialidad: true } },
            solicitud: true
          }
        }
      }
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE usuario
router.put('/:id', async (req, res) => {
  try {
    const usuario = await prisma.usuario.update({
      where: { id_usuario: Number(req.params.id) },
      data: req.body
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE usuario
router.delete('/:id', async (req, res) => {
  try {
    await prisma.usuario.delete({
      where: { id_usuario: Number(req.params.id) }
    });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
// Este archivo define las rutas CRUD para el modelo Usuario, incluyendo operaciones de lectura, actualización y