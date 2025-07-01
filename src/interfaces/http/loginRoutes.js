import express from 'express';
import prisma from '../../config/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Si usas contraseñas hasheadas, descomenta la siguiente línea:
    // const valid = await bcrypt.compare(contrasena, usuario.contrasena);
    // if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Si guardas la contraseña en texto plano (no recomendado), usa:
    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET || 'secreto', // Usa una variable de entorno segura
      { expiresIn: '1d' }
    );

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /logout (opcional, solo si manejas sesiones en backend)
router.post('/logout', (req, res) => {
  // Si usas JWT, el logout se maneja en frontend (borrar token)
  res.json({ message: 'Logout exitoso (solo borra el token en el frontend)' });
});

export default router;