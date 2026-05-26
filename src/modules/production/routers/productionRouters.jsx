import React from 'react';
import { Route, Outlet } from 'react-router-dom';
import { ProductionProvider } from '../context/ProductionContext';
import { ProductionPage } from '../pages/ProductionPage';
import { NewProductionPage } from '../pages/NewProductionPage';

export const productionRouters = (
  <Route 
    element={
      <ProductionProvider>
        {/* El Outlet de React Router renderizará las páginas hijas aquí adentro */}
        <Outlet />
      </ProductionProvider>
    }
  >
    {/* Ruta principal del panel de producción */}
    <Route path="/produccion" element={<ProductionPage />} />
    
    {/* Ruta secundaria si necesitan un formulario dedicado para crear OP manuales */}
    <Route path="/produccion/new" element={<NewProductionPage />} />
  </Route>
);