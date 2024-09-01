export interface Astronaut {
  id: number;
  firstname: string;
  lastname: string;
  originPlanet: {
    id: number;
    name: string;
    description: string;
    isHabitable: boolean;
    image: {
      id: number;
      path: string;
      name: string;
    }
  };
}


