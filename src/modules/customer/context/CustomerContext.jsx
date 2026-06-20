import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, API_BASE_URL } from "../../auth/context/AuthContext";
import toast from "react-hot-toast";

export const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState([]);
    const { token, logout } = useAuth();

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/customers/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                logout();
                return;
            }
            if (response.ok) {
                const data = await response.json();

                // Mapear los datos del backend para que la UI los pueda leer correctamente
                const formattedData = data.map(c => ({
                    id: c.id,
                    name: c.full_name || "Desconocido",    
                    email: c.email || "",                  
                    phone: c.phone,
                    city: c.city,
                    address: c.address,
                    orders: c.orders_count || 0,           
                    totalPurchased: c.total_purchased || 0 
                }));
                setCustomers(formattedData);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Error al cargar el catálogo de clientes");
        }
    };

    const addCustomer = async (customerPayload) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/customers/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(customerPayload)
            });

            if (response.status === 401) {
                logout();
                throw new Error("No autorizado");
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            await fetchCustomers(); // Refrescar el directorio de clientes
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (token) {
            fetchCustomers();
        }
    }, [token]);

    return (
        <CustomerContext.Provider value={{ customers, fetchCustomers, addCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomer() {
    return useContext(CustomerContext);
}