import { Route } from "react-router-dom";
import CustomerPage from "../pages/CustomerPage";

export const customerRoutes = (
    <Route path="/clientes" element={<CustomerPage />} />
);

export default customerRoutes;
