import app from './src/app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`Servidor Core escuchando en puerto ${PORT}`);
});
