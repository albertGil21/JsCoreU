import express from 'express';
import prisma from '../../config/prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const especialidades = await prisma.especialidad.findMany({
      select: {
        id_especialidad: true,
        nombre: true,
        descripcion: true
      }
    });
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /especialidades
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const especialidad = await prisma.especialidad.create({
      data: { nombre, descripcion }
    });
    res.status(201).json(especialidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /especialidades/:id
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const especialidad = await prisma.especialidad.update({
      where: { id_especialidad: Number(req.params.id) },
      data: { nombre, descripcion }
    });
    res.json(especialidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /especialidades/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.especialidad.delete({
      where: { id_especialidad: Number(req.params.id) }
    });
    res.json({ message: 'Especialidad eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;