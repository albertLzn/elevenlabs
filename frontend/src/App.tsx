// React
import React from 'react';

// Libs
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Components
import { CreateOrEditAstronaut } from './pages/CreateOrEditAstronaut';
import { Cockpit } from './pages/Cockpit';
import { SpaceshipAdmin } from './pages/SpaceshipAdmin';

// Containers
import { MessageCenterContainer } from './MessageCenterContainer.tsx';

// Context
import { SpaceTravelProvider } from './contexts/SpaceTravelContext.tsx';
import { SpaceshipProvider } from './contexts/SpaceshipContext.tsx';
import { MessageCenterProvider } from './contexts/MessageCenterContext.tsx';

export function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Cockpit />,
    },
    {
      path: '/spaceship-admin-broken',
      element: <SpaceshipAdmin />,
    },
    {
      path: '/astronaut/create',
      element: <CreateOrEditAstronaut />,
    },
    {
      path: '/astronaut/edit/:astronautId',
      element: <CreateOrEditAstronaut />,
    },
  ]);

  return (
    <React.StrictMode>
      <SpaceTravelProvider>
        <SpaceshipProvider>
          <MessageCenterProvider>
            <RouterProvider router={router} />
            <MessageCenterContainer />
          </MessageCenterProvider>
        </SpaceshipProvider>
      </SpaceTravelProvider>
    </React.StrictMode>
  );
}
