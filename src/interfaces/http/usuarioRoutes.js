import express from 'express';
import { crearUsuarioYRol } from '../../usecases/crearUsuario.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      nombres, apellidos, email, contrasena, telefono, dni, foto_perfil,
      rol, ubicacion, disponibilidad
    } = req.body;

    const resultado = await crearUsuarioYRol({
      nombres, apellidos, email, contrasena, telefono, dni, foto_perfil,
      rol, ubicacion, disponibilidad
    });

    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;