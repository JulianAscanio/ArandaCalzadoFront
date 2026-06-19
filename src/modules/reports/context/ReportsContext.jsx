import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import toast from "react-hot-toast";

export const ReportsContext = createContext();

export function ReportsProvider({ children }) {
    const [materials, setMaterials] = useState([]);
    const [movements, setMovements] = useState([]);
    const [orders, setOrders] = useState([]);
    const [productionOrders, setProductionOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, logout } = useAuth();

    const fetchReportsData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const headers = { "Authorization": `Bearer ${token}` };
            const [matRes, movRes, ordRes, prodRes] = await Promise.all([
                fetch("http://localhost:8000/api/inventario/materiales/", { headers }),
                fetch("http://localhost:8000/api/inventario/movimientos/", { headers }),
                fetch("http://localhost:8000/api/pedidos/ordenes/", { headers }),
                fetch("http://localhost:8000/api/produccion/", { headers }),
            ]);

            if (ordRes.status === 401) {
                logout();
                return;
            }

            if (matRes.ok) setMaterials(await matRes.json());
            if (movRes.ok) setMovements(await movRes.json());
            if (ordRes.ok) setOrders(await ordRes.json());
            if (prodRes.ok) setProductionOrders(await prodRes.json());
        } catch (error) {
            console.error("Error fetching reports data:", error);
            toast.error("Error al cargar datos para reportes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchReportsData();
        }
    }, [token]);

    return (
        <ReportsContext.Provider value={{
            materials,
            movements,
            orders,
            productionOrders,
            loading,
            fetchReportsData,
        }}>
            {children}
        </ReportsContext.Provider>
    );
}

export function useReports() {
    return useContext(ReportsContext);
}
