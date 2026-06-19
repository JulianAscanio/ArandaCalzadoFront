import { Route } from "react-router-dom";
import ReportsPage from "../pages/ReportsPage";

export const reportsRoutes = (
    <>
        <Route path="/reportes" element={<ReportsPage />} />
    </>
);
