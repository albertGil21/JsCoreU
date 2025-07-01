import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function obtenerMetadatos(mensaje) {
  const res = await axios.post(process.env.GEMINI_API_URL, { mensaje });
  return res.data;
}
