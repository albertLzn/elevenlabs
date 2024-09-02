// React
import React, { MouseEventHandler, FormEvent, useState, useEffect } from 'react';

// Libs
import classnames from 'classnames';

// Components
import { HUDWindow } from '../../../components/HUDWindow';
import { Form } from '../../../components/Form';
import { HUDInput } from '../../../components/HUDInput';
import { HUDButton } from '../../../components/HUDButton';
import { Flexbox } from '../../../components/Flexbox';
import { HUDSelect } from '../../../components/HUDSelect/HUDSelect.tsx';


// Context
import { useCurrentPlanet } from '../../../contexts/SpaceTravelContext.tsx';

// API
import {
  CreateUpdateAstronautRequestBody,
  Astronaut,
} from '../../../api/astronaut.api';
import { Planet, getPlanetListFromAPI } from '../../../api/planet.api';

// Styles
import styles from './AstronautForm.module.css';

type AstronautFormProps = {
  astronautForUpdate?: Astronaut | null;
  className?: string;
  mode?: string;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSubmit: (astronaut: CreateUpdateAstronautRequestBody) => void;
};

type FormStateType = {
  firstname?: string;
  lastname?: string;
  planet?: string;
};

export function AstronautForm({
  astronautForUpdate,
  className,
  mode = 'create',
  onCancel,
  onSubmit,
}: AstronautFormProps) {
  const componentClassNames = classnames(styles.astronautform, className);
  const { currentPlanet } = useCurrentPlanet();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const canCreate = mode === 'create' && (
    (currentPlanet !== 'NO_WHERE' && currentPlanet?.isHabitable) ||
    (selectedPlanet && selectedPlanet.isHabitable)
  );


  const [formState, setFormState] = useState<FormStateType>({});
  const [astronautFirstname, setAstronautFirstname] = useState(astronautForUpdate?.firstname || '');
  const [astronautLastname, setAstronautLastname] = useState(astronautForUpdate?.lastname || '');
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [astronautOriginPlanet, setAstronautOriginPlanet] = useState(astronautForUpdate?.originPlanet?.id?.toString() || '');
  useEffect(() => {
    const fetchPlanets = async () => {
      const fetchedPlanets = await getPlanetListFromAPI();
      setPlanets(fetchedPlanets);

      if (astronautForUpdate && astronautForUpdate.originPlanet) {
        const planetId = astronautForUpdate.originPlanet.id.toString();
        setAstronautOriginPlanet(planetId);
        setSelectedPlanet(fetchedPlanets.find(p => p.id.toString() === planetId) || null);
      }
    };
    fetchPlanets();
  }, [astronautForUpdate]);

  const validateAndSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: FormStateType = {};
    if (
      astronautFirstname === ''
    ) {
      validationErrors.firstname = 'firstname is required';
    }
    if (
      astronautLastname === ''
    ) {
      validationErrors.lastname = 'lastname is require';
    }
    if (
      astronautOriginPlanet === ''
    ) {
      validationErrors.planet = 'planet of origin is required';
    }
    if (
      !Object.keys(validationErrors).length &&
      astronautFirstname &&
      astronautLastname &&
      selectedPlanet
    ) {
      onSubmit({
        firstname: astronautFirstname,
        lastname: astronautLastname,
        originPlanetId: selectedPlanet.id,
      });
    } else {
      setFormState(validationErrors);
    }
  };

  return (
    <Flexbox className={componentClassNames} flexDirection="column">
      <HUDWindow>
        {mode === 'create' ? (
          <h2>Create an Astronaut</h2>
        ) : (
          <h2>Edit an Astronaut</h2>
        )}
        <Form
          onSubmit={validateAndSubmit}
          className={styles.astronautformForm}
          noValidate
        >
          <HUDInput
            name="firstname"
            label="firstname"
            placeholder="John"
            required
            defaultValue={astronautForUpdate?.firstname || ''}
            error={formState.firstname}
            onChange={(e) => setAstronautFirstname(e.target.value)}
          />
          <HUDInput
            name="lastname"
            label="lastname"
            placeholder="Doe"
            required
            defaultValue={astronautForUpdate?.lastname || ''}
            error={formState.lastname}
            onChange={(e) => setAstronautLastname(e.target.value)}
          />
          <HUDSelect
            name="originPlanet"
            label="Origin Planet"
            required
            options={planets.map(planet => ({ value: planet.id.toString(), label: planet.name }))}
            value={astronautOriginPlanet}
            error={formState.planet}
            onChange={(e) => {
              setAstronautOriginPlanet(e.target.value);
              setSelectedPlanet(planets.find(p => p.id.toString() === e.target.value) || null);
            }}
          />
          <Flexbox
            className={styles.astronautformButtons}
            alignItems="center"
            justifyContent="center"
          >
            <HUDButton onClick={onCancel}>CANCEL</HUDButton>
            {mode === 'create' ? (
              <HUDButton disabled={!canCreate}>CREATE</HUDButton>
            ) : (
              <HUDButton>EDIT</HUDButton>
            )}
          </Flexbox>
        </Form>
      </HUDWindow>
      {mode !== 'edit' && !canCreate && (
        <HUDWindow className={styles.astronautformCannotCreate}>
          <h2>Warning !</h2>
          <p>
            Cannot create an astronaut because the current planet don \'t
            shelters life.
          </p>
          <p>Travel to an another planet to add an astronaut, or select a planet in the Selector</p>
        </HUDWindow>
      )}
    </Flexbox>
  );
}
