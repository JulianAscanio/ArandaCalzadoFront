import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth, API_BASE_URL } from '../../auth/context/AuthContext';

// Creación del contexto de producción
const ProductionContext = createContext();

// Datos de prueba para cuando no haya backend
const fallbackOrders = [
    {
        id: 101,
        customer_name: 'Distribuidora Central',
        status: 'Pendiente',
        items: [
            { quantity: 50, product_name: 'Bota de Seguridad Talla 42' },
            { quantity: 20, product_name: 'Zapato Escolar Talla 38' }
        ]
    },
    {
        id: 102,
        customer_name: 'Boutique Elegance',
        status: 'En producción',
        items: [
            { quantity: 15, product_name: 'Tacón Clásico Negro' }
        ]
    }
];

export const ProductionProvider = ({ children }) => {
    const [ordersInProduction, setOrdersInProduction] = useState([]);
    const [loading, setLoading] = useState(false);
    const [useMockData, setUseMockData] = useState(false);
    const { token, logout } = useAuth();

    // RF17: Consultar pedidos en proceso o pendientes de producción (Iteración 3)
    const fetchProductionOrders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const response = await fetch(`${API_BASE_URL}/api/produccion/`, { headers });
            
            if (response.status === 401) {
                logout();
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setOrdersInProduction(data);
                setUseMockData(false);
            } else {
                console.warn("Backend no disponible. Usando datos de prueba para producción.");
                setOrdersInProduction(fallbackOrders);
                setUseMockData(true);
            }
        } catch (error) {
            console.warn("Error de conexión cargando órdenes de producción, usando datos de prueba:", error);
            toast.error("Error de red. Mostrando órdenes en modo local.");
            setOrdersInProduction(fallbackOrders);
            setUseMockData(true);
        } finally {
            setLoading(false);
        }
    };

    // RF: Crear una nueva orden de producción desde un pedido
    const createProductionOrder = async (payload) => {
        if (useMockData) {
            return true;
        }

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/produccion/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (response.status === 401) {
                logout();
                return false;
            }

            if (response.ok) {
                await fetchProductionOrders();
                return true;
            } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    console.error("Detalles del Bad Request (400):", errorData);
                    
                    // Extraemos los mensajes de error de DRF para que sean visibles
                    let errorMsg = errorData.error;
                    if (!errorMsg && typeof errorData === 'object') {
                        errorMsg = Object.values(errorData).flat().join(" | ");
                    }
                    toast.error(`Error: ${errorMsg || "Datos inválidos"}`);
                } else {
                    const errorText = await response.text();
                    console.error("HTML Error Response from Django:", errorText);
                    toast.error(`Error del servidor (${response.status}). Revisa la consola.`);
                }
            }
        } catch (error) {
            console.error("Error al crear la producción en el backend:", error);
            toast.error("Error de conexión al crear la producción.");
        }
        return false;
    };

    // RF13 y RF14: Generar orden de producción y asociar materias primas
    const startProductionOrder = async (orderId, materialsUsed) => {
        if (useMockData) {
            setOrdersInProduction(prev => 
                prev.map(o => o.id === orderId ? { ...o, status: 'En producción' } : o)
            );
            return true;
        }

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/produccion/${orderId}/iniciar_produccion/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(materialsUsed)
            });

            if (response.status === 401) {
                logout();
                return false;
            }

            if (response.ok) {
                await fetchProductionOrders();
                return true;
            } else {
                const errorData = await response.json();
                if (errorData && errorData.error) {
                    toast.error(errorData.error);
                } else {
                    toast.error("Error al procesar la producción.");
                }
            }
        } catch (error) {
            console.error("Error al iniciar la producción en el backend:", error);
            toast.error("Error de conexión al iniciar la producción.");
        }
        return false;
    };

    // RF15 y RF16: Registrar avance de producción y marcar pedidos como finalizados
    const finishProductionOrder = async (orderId) => {
        if (useMockData) {
            // Simular respuesta del backend
            setOrdersInProduction(prev => 
                prev.map(o => o.id === orderId ? { ...o, status: 'Finalizado' } : o)
            );
            return true;
        }

        try {
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/produccion/${orderId}/finalizar_produccion/`, {
                method: 'POST',
                headers: headers
            });

            if (response.status === 401) {
                logout();
                return false;
            }

            if (response.ok) {
                await fetchProductionOrders();
                return true;
            } else {
                const errorData = await response.json();
                if (errorData && errorData.error) {
                    toast.error(errorData.error);
                } else {
                    toast.error("Error al finalizar la producción.");
                }
            }
        } catch (error) {
            console.error("Error al finalizar la orden en el backend:", error);
            toast.error("Error de conexión al finalizar la producción.");
        }
        return false;
    };

    // Carga inicial al montar el módulo de producción en el aplicativo
    useEffect(() => {
        if (token) {
            fetchProductionOrders();
        }
    }, [token]);

    return (
        <ProductionContext.Provider value={{
            ordersInProduction,
            loading,
            fetchProductionOrders,
            createProductionOrder,
            startProductionOrder,
            finishProductionOrder
        }}>
            {children}
        </ProductionContext.Provider>
    );
};

// CRÍTICO: Export nombrado del Hook personalizado para solucionar el SyntaxError
export const useProduction = () => {
    const context = useContext(ProductionContext);
    if (!context) {
        throw new Error('useProduction debe ser utilizado dentro de un ProductionProvider');
    }
    return context;
};