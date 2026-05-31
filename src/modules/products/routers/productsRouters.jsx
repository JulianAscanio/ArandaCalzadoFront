import { Route } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import NewProductPage from "../pages/NewProductPage";

export const productsRoutes = (
    <>
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/nuevo-producto" element={<NewProductPage />} />
        <Route path="/productos/editar/:id" element={<NewProductPage />} />
    </>
);
