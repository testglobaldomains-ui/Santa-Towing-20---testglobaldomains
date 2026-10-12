import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { ContentProvider } from './context/ContentContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </HelmetProvider>
  </StrictMode>,
);

