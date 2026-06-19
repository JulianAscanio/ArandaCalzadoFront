import { Routes, Route, Navigate } from "react-router-dom";
import { inventoryRoutes } from "../../modules/inventory/routers/inventoryRouters";
import { ordersRoutes } from "../../modules/orders/routers/ordersRouters";
import { productionRouters } from "../../modules/production/routers/productionRouters";
import { productsRoutes } from "../../modules/products/routers/productsRouters";
import { customerRoutes } from "../../modules/customer/routes/CustomerRoutes";
import { reportsRoutes } from "../../modules/reports/routers/reportsRouters";
import Login from "../../modules/auth/pages/Login";
import ForgotPassword from "../../modules/auth/pages/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/olvide-contrasena" element={<ForgotPassword />} />
      <Route path="/" element={<Navigate to="/inventario" />} />
      <Route element={<ProtectedRoute />}>
        {inventoryRoutes}
        {ordersRoutes}
        {productionRouters}
        {productsRoutes}
        {customerRoutes}
        {reportsRoutes}
      </Route>
    </Routes>
  );
}
