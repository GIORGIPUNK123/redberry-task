import { createRoot } from 'react-dom/client';
import './index.css';
// import { App } from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Home } from './pages/Home';
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
    </Routes>
    {/* <App /> */}
  </BrowserRouter>,
);
