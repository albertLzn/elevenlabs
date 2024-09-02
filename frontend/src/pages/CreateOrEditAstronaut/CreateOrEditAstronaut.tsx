// Libs
import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Components
import { Flexbox } from '../../components/Flexbox';
import { AstronautForm } from './AstronautForm';
import { HUDPlanetDescription } from '../../components/HUDPlanetDescription';
import { HUDWindowWarning } from '../../components/HUDWindowWarning';
import { HUDWindowLoader } from '../../components/HUDWindowLoader';

// API
import {
  Astronaut,
  createAstronautAPICall,
  CreateUpdateAstronautRequestBody,
  getOneAstronautFromAPI,
  updateAstronautAPICall,
} from '../../api/astronaut.api';

// Hooks
import { useFetch } from '../../hooks/useFetch';

// Context
import { useCurrentPlanet } from '../../contexts/SpaceTravelContext.tsx';

// Styles
import styles from './CreateOrEditAstronaut.module.css';

export function CreateOrEditAstronaut() {
  const navigate = useNavigate();
  const { astronautId } = useParams();
  const handleCreateOrEditCancel = () => navigate('/spaceship-admin');
  
  const handleAstronautFormCreate = async (astronaut: CreateUpdateAstronautRequestBody) => {
    await createAstronautAPICall(astronaut);
    navigate('/spaceship-admin');
  };
  
  const handleAstronautFormEdit = async (astronaut: CreateUpdateAstronautRequestBody) => {
    if (!astronautId) {
      throw new Error('Missing astronautId, WRONG URL!');
    }
    await updateAstronautAPICall(astronautId, astronaut);
    navigate('/spaceship-admin');
  };

  const mode = astronautId ? 'edit' : 'create';
  const handleAstronautFormSubmit = mode === 'create' ? handleAstronautFormCreate : handleAstronautFormEdit;

  const { currentPlanet } = useCurrentPlanet();

  const fetchFunction = useCallback((options?: RequestInit): Promise<Astronaut | undefined> => {
    return getOneAstronautFromAPI(astronautId, options);
  }, [astronautId]);
  

  const { isLoading, data } = mode === 'edit' ? useFetch<Astronaut>(fetchFunction) : { isLoading: false, data: null };

  return (
    <Flexbox flexDirection="column" className={styles.createoreditastronaut}>
      {currentPlanet === 'NO_WHERE' ? (
        <HUDWindowWarning
          warning="current planet: UnKnow"
          className={styles.createoreditastronautCurrentPlanetWarning}
        />
      ) : (
        <HUDPlanetDescription
          name={`current planet: ${currentPlanet.name}`}
          isHabitable={currentPlanet.isHabitable}
          className={styles.createoreditastronautCurrentPlanet}
        />
      )}
      <Flexbox justifyContent="center" alignItems="center">
        {mode === 'edit' && isLoading ? (
          <HUDWindowLoader />
        ) : (
          <AstronautForm
            astronautForUpdate={data}
            mode={mode}
            onCancel={handleCreateOrEditCancel}
            onSubmit={handleAstronautFormSubmit}
            className={styles.createoreditastronautForm}
          />
        )}
      </Flexbox>
    </Flexbox>
  );
}