import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  await knex('astronauts').del();
  await knex('planets').del();
  await knex('images').del();

  const imagesData = [
    { id: 1, name: 'Donut Factory Image', path: '/assets/donut_factory.jpg' },
    { id: 2, name: 'Duck Invaders Image', path: '/assets/duck_invaders.jpg' },
    { id: 3, name: 'Raccoon from Asgard Image', path: '/assets/raccoon_asgards.jpg' },
    { id: 4, name: 'Schizo Cats Image', path: '/assets/schizo_cats.jpg' },
  ];

  await knex('images').insert(imagesData);

  const planetsData = [
    { id: 1, name: 'Donut Factory', description: 'Forte en calories', isHabitable: true, imageId: 1 },
    { id: 2, name: 'Duck Invaders', description: 'La danse ici est une religion', isHabitable: true, imageId: 2 },
    { id: 3, name: 'Raccoon from Asgard', description: 'Espiegle mais pas trop', isHabitable: true, imageId: 3 },
    { id: 4, name: 'Schizo Cats', description: 'Non leur planete n\'est pas une pelote', isHabitable: true, imageId: 4 },
  ];

  await knex('planets').insert(planetsData);

  const planetCount = await knex('planets').count('* as count').first();
  if (planetCount && planetCount.count === 0) {
    throw new Error('No planets found. Cannot insert astronauts.');
  }

  const astronautsData = [
    { firstname: 'John', lastname: 'Smith', originPlanetId: 1 },
    { firstname: 'Jane', lastname: 'Doe', originPlanetId: 2 },
    { firstname: 'Bob', lastname: 'Johnson', originPlanetId: 3 },
    { firstname: 'Alice', lastname: 'Williams', originPlanetId: 4 },
  ];

  await knex('astronauts').insert(astronautsData);
};

export default seed;
