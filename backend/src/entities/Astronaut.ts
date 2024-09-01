import Planet from './Planet';

export interface Astronaut {
  id: number;
  firstname: string;
  lastname: string;
  originPlanetId: number;
  originPlanet?: Planet;
}