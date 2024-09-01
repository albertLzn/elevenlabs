// Success Handlers
import { getPlanetListHandler } from './planet.virtual-api';
import {
  createAstronautHandler,
  deleteAstronautHandler,
  getAstronautListHandler,
  getOneAstronautHandler,
  updateAstronautHandler,
} from './astronaut.virtual-api';

export const handlers = [
  getPlanetListHandler,
  getAstronautListHandler,
  deleteAstronautHandler,
  createAstronautHandler,
  getOneAstronautHandler,
  updateAstronautHandler,
];
