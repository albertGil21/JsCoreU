import axios from 'axios';

const REDIS_MICROSERVICE_URL = process.env.REDIS_MICROSERVICE_URL;

async function obtenerReparadoresCercanos() {
  const { data } = await axios.get(`${REDIS_MICROSERVICE_URL}/reparadores-cercanos`);
  return data;
}

export default obtenerReparadoresCercanos;