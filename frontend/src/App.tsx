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

// Constants
import { RoutePaths } from './constants/paths';

export function App() {
  const router = createBrowserRouter([
    {
      path: RoutePaths.HOME,
      element: <Cockpit />,
    },
    {
      path: RoutePaths.SPACESHIP_ADMIN,
      element: <SpaceshipAdmin />,
    },
    {
      path: RoutePaths.ASTRONAUT_CREATE,
      element: <CreateOrEditAstronaut />,
    },
    {
      path: RoutePaths.ASTRONAUT_EDIT,
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
