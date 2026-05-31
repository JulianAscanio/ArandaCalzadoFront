import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

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

    // RF17: Consultar pedidos en proceso o pendientes de producción (Iteración 3)
    const fetchProductionOrders = async () => {
        setLoading(true);
        try {
            // Endpoint sugerido para conectar con tu Backend de Django REST Framework
            const response = await fetch('http://localhost:8000/api/produccion/');
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

    // RF13 y RF14: Generar orden de producción y asociar materias primas
    const startProductionOrder = async (orderId, materialsUsed) => {
        if (useMockData) {
            setOrdersInProduction(prev => 
                prev.map(o => o.id === orderId ? { ...o, status: 'En producción' } : o)
            );
            return true;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/produccion/${orderId}/iniciar_produccion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(materialsUsed)
            });

            if (response.ok) {
                await fetchProductionOrders();
                return true;
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
            const response = await fetch(`http://localhost:8000/api/produccion/${orderId}/finalizar_produccion/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                await fetchProductionOrders();
                return true;
            }
        } catch (error) {
            console.error("Error al finalizar la orden en el backend:", error);
            toast.error("Error de conexión al finalizar la producción.");
        }
        return false;
    };

    // Carga inicial al montar el módulo de producción en el aplicativo
    useEffect(() => {
        fetchProductionOrders();
    }, []);

    return (
        <ProductionContext.Provider value={{
            ordersInProduction,
            loading,
            fetchProductionOrders,
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