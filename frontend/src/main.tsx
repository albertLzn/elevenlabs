// React
import ReactDOM from 'react-dom/client';

// Components
import { App } from './App.tsx';

// Styles
import './index.css';

if (import.meta.env.VITE_VIRTUAL_MODE === 'enabled') {
  const { worker } = await import('./api/virtual-api/browser');

  worker.start();
}

// @ts-expect-error: the element root exists for sure, the getElementById will never return null
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
