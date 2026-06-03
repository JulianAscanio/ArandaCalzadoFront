import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import AppLayout from "../../../shared/layout/AppLayout";
import { MoreVertical, Pencil, Trash2, Info } from "lucide-react";

const HeelIcon = ({ color, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.4 12.3c.7-.6 1.6-1.3 2.1-2.3.2-.4.4-.9.5-1.4 0-.1 0-.1 0-.2-.1-.8-.8-1.4-1.6-1.4h-3.1c-.8 0-1.5.5-1.7 1.3L12.5 14H6c-1.1 0-2 .9-2 2v2h14v-2c0-.6.2-1.2.6-1.7l1.8-2z"/>
    <path d="M20 18v4h-2v-4"/>
  </svg>
);

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (typeof imagePath === 'object' && imagePath.url) imagePath = imagePath.url;
  if (typeof imagePath !== 'string') return null;

  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl.replace(/\/+$/, '')}/${cleanPath}`;
};

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

      <div style={{ background: "white", borderRadius: "16px", overflow: "visible", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "white" }}>
              <th style={thStyle}>Calzado</th>
              <th style={thStyle}>Referencia</th>
              <th style={thStyle}>Material Base</th>
              <th style={thStyle}>Precio Venta</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ ...tdStyle, textAlign: "center", padding: "30px", color: "#6f5d56" }}>
                  No se encontraron productos en el catálogo.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={iconBoxStyle}>
                        {product.image ? (
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name} 
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} 
                          />
                        ) : (
                          <HeelIcon size={24} color="#4b3a35" />
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: '600', color: '#2c2620', fontSize: '15px' }}>
                          {product.name}
                        </span>
                        <span style={{ fontSize: "13px", color: "#8b7b78", marginTop: "4px" }}>Tacón: {product.heel_height || "N/A"}</span>
                      </div>
                    </div>
                  </td>

                  <td style={tdStyle}>
                    <span style={{ fontWeight: "600", color: "#b1223a", fontSize: "14px" }}>
                      {product.reference || "N/A"}
                    </span>
                  </td>
                  
                  <td style={tdStyle}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background: "#f7f2ee",
                      color: "#4b3a35",
                      fontSize: "12px",
                      fontWeight: "500",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <Info size={12} />
                      {product.material_detail?.name || (product.material ? `Mat #${product.material}` : "N/A")}
                    </span>
                  </td>
                  
                  <td style={tdStyle}>
                    <strong style={{ color: "#2c2620", fontSize: "15px" }}>{formatCurrency(product.price)}</strong>
                  </td>
                  
                  <td style={tdStyle}>
                    <span style={{ fontWeight: "500", color: "#4b3a35" }}>{product.available_stock}</span> <span style={{ fontSize: "13px", color: "#8b7b78" }}>pares</span>
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
                        <div style={{
                          ...dropdownStyle,
                          ...(index >= filteredProducts.length - 2 && filteredProducts.length > 3 
                            ? { top: "auto", bottom: "100%", marginBottom: "8px" } 
                            : {})
                        }}>
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
  padding: "16px 20px",
  borderBottom: "1px solid #f0e8e4",
  color: "#4b3a35",
  fontWeight: "600",
  fontSize: "14px"
};

const tdStyle = {
  padding: "16px 20px",
  borderBottom: "1px solid #f7f2ee",
  verticalAlign: "middle",
};

const iconBoxStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "10px",
  background: "#f7f2ee",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
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
