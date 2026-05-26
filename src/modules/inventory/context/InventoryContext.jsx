import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import toast from "react-hot-toast";

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    const [materials, setMaterials] = useState([]);
    const [movements, setMovements] = useState([]);

    const { token, logout } = useAuth();

    useEffect(() => {
        if (token) {
            fetchMaterials();
            fetchMovements();
        }
    }, [token]);

    const fetchMaterials = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/inventario/materiales/", {
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
                setMaterials(data);
            }
        } catch (error) {
            console.error("Error fetching materials:", error);
            toast.error("Error al cargar el catálogo de materiales");
        }
    };

    const fetchMovements = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/inventario/movimientos/", {
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
                setMovements(data);
            }
        } catch (error) {
            console.error("Error fetching movements:", error);
            toast.error("Error al cargar los movimientos del inventario");
        }
    };

    const addMaterial = async (newMaterial) => {
        try {
            const response = await fetch("http://localhost:8000/api/inventario/materiales/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newMaterial)
            });

            if (response.ok) {
                const data = await response.json();
                setMaterials((prev) => [...prev, data]);
                fetchMovements();
                toast.success("Material registrado exitosamente");
            } else {
                console.error("Error creating material", await response.text());
                toast.error("Error al registrar el nuevo material");
            }
        } catch (error) {
            console.error("Error posting material:", error);
            toast.error("Error de conexión al crear el material");
        }
    };

    const deleteMaterial = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/inventario/materiales/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                setMaterials((prev) => prev.filter((material) => material.id !== id));
                fetchMovements();
                toast.success("Material eliminado del sistema");
            }
        } catch (error) {
            console.error("Error deleting material:", error);
            toast.error("Ocurrió un problema al intentar eliminar el material");
        }
    };

    const updateMaterial = async (id, updatedMaterial) => {
        const response = await fetch(`http://localhost:8000/api/inventario/materiales/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedMaterial)
        });
        if (!response.ok) {
            const errorData = await response.text();
            toast.error("Error al intentar actualizar el material");
            throw new Error(JSON.stringify({ errorData }));
        }

        const data = await response.json();
        setMaterials((prev) =>
            prev.map((material) => (material.id === id ? data : material))
        );
        fetchMovements();
        toast.success("Material actualizado correctamente");
        return data;
    };

    const registerMovement = async ({ materialId, materialName, movementType, quantity, reason }) => {
        const material = materials.find((m) => Number(m.id) === Number(materialId));
        if (!material) {
            console.error("Material no encontrado en el estado local:", materialId);
            toast.error("Material no encontrado en el inventario");
            throw new Error("Material no encontrado en el inventario");
        }

        let newStock = material.stock;
        if (movementType === "entrada") {
            newStock = material.stock + quantity;
        } else if (movementType === "salida") {
            newStock = material.stock - quantity;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/inventario/materiales/${materialId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ stock: newStock, reason })
            });

            if (response.ok) {
                const data = await response.json();
                setMaterials((prev) =>
                    prev.map((m) => Number(m.id) === Number(materialId) ? data : m)
                );
                await fetchMovements();
                toast.success(`Movimiento de ${movementType} registrado exitosamente`);
                return data;
            } else {
                const errorText = await response.text();
                console.error("Error de servidor al registrar movimiento:", errorText);
                toast.error("Error del servidor al procesar el movimiento");
                throw new Error(`Error del servidor (${response.status}): ${errorText}`);
            }
        } catch (error) {
            console.error("Error en registerMovement:", error);
            toast.error("Ocurrió un problema de red al registrar el movimiento");
            throw error;
        }
    };

    const resetInvetoryData = () => {
        localStorage.removeItem("inventory-materials");
        localStorage.removeItem("inventory-movements");
        setMaterials([]);
        fetchMaterials();
        fetchMovements();
        toast.success("Datos de inventario reiniciados");
    };

    return (
        <InventoryContext.Provider value={{ materials, movements, addMaterial, deleteMaterial, updateMaterial, registerMovement, resetInvetoryData }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    return useContext(InventoryContext);
}
