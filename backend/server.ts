// DO NOT TOUCH 
// (J'ai du modifier legerement le code pour initialiser les nouveaux fichiers services... 
// ...et adapter l'initialisation des routes et des controllers à la nouvelle structure)

import express from 'express';
import cors from 'cors';
import { setupImageRoutes } from './src/routes/ImageRouter';
import { setupPlanetRoutes } from './src/routes/PlanetRouter';
import { setupAstronautRoutes } from './src/routes/AstronautRouter';
import { ImageController } from './src/controllers/ImageController';
import { PlanetController } from './src/controllers/PlanetController';
import { AstronautController } from './src/controllers/AstronautController';
import { ImageServiceImpl } from './src/services/ImageService';
import { PlanetServiceImpl } from './src/services/PlanetService';
import { AstronautServiceImpl } from './src/services/AstronautService';
import knex from './src/db';

const app = express();

app.use(express.json());
app.use(cors());

// Setup services
const imageService = new ImageServiceImpl(knex);
const planetService = new PlanetServiceImpl(knex);
const astronautService = new AstronautServiceImpl(knex);

// Setup controllers
const imageController = new ImageController(imageService);
const planetController = new PlanetController(planetService);
const astronautController = new AstronautController(astronautService);

// Setup routes
app.use('/images', setupImageRoutes(imageController));
app.use('/planets', setupPlanetRoutes(planetController));
app.use('/astronauts', setupAstronautRoutes(astronautController));

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});