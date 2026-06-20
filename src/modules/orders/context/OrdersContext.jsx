import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, API_BASE_URL } from "../../auth/context/AuthContext";
import toast from "react-hot-toast";

export const OrdersContext = createContext();

export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stages, setStages] = useState(() => {
        const savedStages = localStorage.getItem("orders-stages");
        return savedStages ? JSON.parse(savedStages) : [];
    });

    const { token, logout } = useAuth();

    const fetchOrders = async () => {
        try {
            const headers = { "Authorization": `Bearer ${token}` };
            const [ordersRes, customersRes, productsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/pedidos/ordenes/`, { headers }),
                fetch(`${API_BASE_URL}/api/usuarios/customers/`, { headers }),
                fetch(`${API_BASE_URL}/api/inventario/productos/`, { headers })
            ]);

            if (ordersRes.status === 401) {
                logout();
                return;
            }

            if (ordersRes.ok) {
                const data = await ordersRes.json();
                setOrders(data);
            }
            if (customersRes.ok) {
                const data = await customersRes.json();
                setCustomers(data);
            }
            if (productsRes.ok) {
                const data = await productsRes.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching orders data:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem("orders-stages", JSON.stringify(stages));
    }, [stages]);

    const addOrder = async (newOrder) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/ordenes/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newOrder)
            });

            if (response.ok) {
                const data = await response.json();
                setOrders((prev) => [...prev, data]);
                return data;
            } else {
                const errorText = await response.text();
                console.error("Error creating order", errorText);
                throw new Error("Failed to create order");
            }
        } catch (error) {
            console.error("Error posting order:", error);
            throw error;
        }
    };

    const deleteOrder = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/ordenes/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                setOrders((prev) => prev.filter((order) => order.id !== id));
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const updateOrder = async (id, updatedOrder) => {
        const response = await fetch(`${API_BASE_URL}/api/pedidos/ordenes/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedOrder)
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(JSON.stringify({ errorData }));
        }

        const data = await response.json();
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? data : order))
        );

        return data;
    };

    const registerStage = async ({ orderId, stageName}) => {

        const order = orders.find((o) => o.id === orderId);
        if (!order) return;

        let newStatus = order.status;
        if (stageName != newStatus) {
            newStatus = stageName;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/ordenes/${orderId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setOrders((prev) =>
                    prev.map((o) => o.id === orderId ? { ...o, status: newStatus, date: "Hoy" } : o)
                );

                const newStage = {
                    id: Date.now(),
                    orderId,
                    status: newStatus,
                    date: new Date().toISOString(),
                };

                setStages((prev) => [newStage, ...prev]);
                }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    }

    const resetOrdersData = () => {
        localStorage.removeItem("orders-orders");
        localStorage.removeItem("orders-stages");
        setOrders([]);
        fetchOrders();
        setStages([]);
    }

    const markAsSent = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/ordenes/${id}/marcar_enviado/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success("Pedido marcado como enviado exitosamente.");
                fetchOrders(); // Recarga la tabla de pedidos
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "No se pudo marcar el pedido como enviado.");
            }
        } catch (error) {
            console.error("Error al enviar el pedido:", error);
            toast.error("Error de conexión al marcar como enviado.");
        }
    };

    return (
        <OrdersContext.Provider value={{ orders, customers, products, stages, fetchOrders, addOrder, deleteOrder, updateOrder, registerStage, resetOrdersData, markAsSent }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    return useContext(OrdersContext);
}