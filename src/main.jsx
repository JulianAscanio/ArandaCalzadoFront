import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { InventoryProvider } from "./modules/inventory/context/InventoryContext";
import { OrdersProvider } from "./modules/orders/context/OrdersContext";
import { ProductionProvider } from "./modules/production/context/ProductionContext";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InventoryProvider>
          <OrdersProvider>
            <ProductionProvider>
              <App />
            </ProductionProvider>
          </OrdersProvider>
        </InventoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);