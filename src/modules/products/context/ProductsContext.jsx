import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import toast from "react-hot-toast";

export const ProductsContext = createContext();

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const { token, logout } = useAuth();

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token]);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/inventario/productos/", {
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
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Error al cargar el catálogo de productos");
        }
    };

    const addProduct = async (newProduct) => {
        try {
            const isFormData = newProduct instanceof FormData;
            const headers = {
                "Authorization": `Bearer ${token}`
            };
            
            if (!isFormData) {
                headers["Content-Type"] = "application/json";
            }

            const response = await fetch("http://localhost:8000/api/inventario/productos/", {
                method: "POST",
                headers,
                body: isFormData ? newProduct : JSON.stringify(newProduct)
            });

            if (response.ok) {
                const data = await response.json();
                setProducts((prev) => [...prev, data]);
                toast.success("Producto registrado exitosamente");
                return data;
            } else {
                console.error("Error creating product", await response.text());
                toast.error("Error al registrar el nuevo producto");
            }
        } catch (error) {
            console.error("Error posting product:", error);
            toast.error("Error de conexión al crear el producto");
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/inventario/productos/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                setProducts((prev) => prev.filter((product) => product.id !== id));
                toast.success("Producto eliminado del catálogo");
            } else {
                toast.error("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Ocurrió un problema al intentar eliminar el producto");
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            const isFormData = updatedProduct instanceof FormData;
            const headers = {
                "Authorization": `Bearer ${token}`
            };

            if (!isFormData) {
                headers["Content-Type"] = "application/json";
            }

            const response = await fetch(`http://localhost:8000/api/inventario/productos/${id}/`, {
                method: "PUT",
                headers,
                body: isFormData ? updatedProduct : JSON.stringify(updatedProduct)
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                toast.error("Error al intentar actualizar el producto");
                throw new Error(JSON.stringify({ errorData }));
            }

            const data = await response.json();
            setProducts((prev) =>
                prev.map((product) => (product.id === id ? data : product))
            );
            toast.success("Producto actualizado correctamente");
            return data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    };

    return (
        <ProductsContext.Provider value={{ products, fetchProducts, addProduct, deleteProduct, updateProduct }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductsContext);
}
