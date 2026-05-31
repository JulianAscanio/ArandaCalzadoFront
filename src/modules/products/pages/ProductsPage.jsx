import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import AppLayout from "../../../shared/layout/AppLayout";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { products, deleteProduct } = useProducts();
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.reference || "").toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [products, search]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro que vas a eliminar permanentemente esto?")) {
      deleteProduct(id);
      setOpenMenuId(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <AppLayout title="Productos">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "10px" }}>Catálogo de Zapatos</h1>
          <p style={{ color: "#6f5d56" }}>
            Gestión del catálogo de calzado y sus características técnicas
          </p>
        </div>

        <Link
          to="/nuevo-producto"
          style={{
            textDecoration: "none",
            background: "#b1223a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            fontWeight: "600",
          }}
        >
          + Nuevo Producto
        </Link>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar zapato por nombre o referencia..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #d8ccc4",
            boxSizing: "border-box",
            background: "white",
            fontSize: "14px",
          }}
        />
      </div>

      <div style={{ background: "white", borderRadius: "14px", overflow: "visible", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f7f2ee" }}>
              <th style={thStyle}>Referencia</th>
              <th style={thStyle}>Nombre del Calzado</th>
              <th style={thStyle}>Altura Tacón</th>
              <th style={thStyle}>Material Base</th>
              <th style={thStyle}>Precio Venta</th>
              <th style={thStyle}>Stock Disponible</th>
              <th style={thStyle}>Descripción</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: "center", padding: "30px", color: "#6f5d56" }}>
                  No se encontraron productos en el catálogo.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ ...tdStyle, fontWeight: "600", color: "#b1223a" }}>
                    {product.reference || "N/A"}
                  </td>
                  <td style={tdStyle}>{product.name}</td>
                  <td style={tdStyle}>{product.heel_height || "N/A"}</td>
                  <td style={tdStyle}>
                    {product.material_detail?.name || (product.material ? `Material #${product.material}` : "No asignado")}
                  </td>
                  <td style={tdStyle}>
                    <strong>{formatCurrency(product.price)}</strong>
                  </td>
                  <td style={tdStyle}>
                    {product.available_stock} pares
                  </td>
                  <td style={{ ...tdStyle, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {product.description || "Sin descripción"}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === product.id ? null : product.id)
                        }
                        className="icon-action-button icon-action-button--menu"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#8b7b78",
                          padding: "6px",
                          borderRadius: "8px",
                        }}
                        title="Más opciones"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openMenuId === product.id && (
                        <div style={dropdownStyle}>
                          <Link
                            to={`/productos/editar/${product.id}`}
                            style={dropdownItemStyle}
                            onClick={() => setOpenMenuId(null)}
                          >
                            <Pencil size={16} />
                            Editar
                          </Link>

                          <button
                            onClick={() => handleDelete(product.id)}
                            style={dropdownDeleteStyle}
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #e8ded8",
  color: "#4b3a35",
  fontWeight: "600",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #f7f2ee",
  color: "#333",
  fontSize: "14px",
};

const dropdownStyle = {
  position: "absolute",
  top: "30px",
  right: 0,
  minWidth: "140px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  border: "1px solid #eee",
  overflow: "hidden",
  zIndex: 100,
};

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 14px",
  textDecoration: "none",
  color: "#2d1f20",
  fontSize: "14px",
  background: "white",
};

const dropdownDeleteStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 14px",
  border: "none",
  background: "white",
  color: "#b1223a",
  fontSize: "14px",
  cursor: "pointer",
  textAlign: "left",
};
