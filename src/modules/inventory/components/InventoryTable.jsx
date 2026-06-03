import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, ArrowUpDown, Package, Tag } from "lucide-react";
import StatusBar from "./StatusBar";
import { useInventory } from "../context/InventoryContext";

export default function InventoryTable({ items, onOpenModal }) {
  const { deleteMaterial } = useInventory();
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro que vas a eliminar permanentemente esto?")) {
      deleteMaterial(id);
      setOpenMenuId(null);
    }
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      overflow: "visible",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
    }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "white" }}>
            <th style={thStyle}>Material</th>
            <th style={thStyle}>Categoría</th>
            <th style={thStyle}>Stock actual</th>
            <th style={thStyle}>Stock mínimo</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Última entrada</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={iconBoxStyle}>
                    <Package size={18} color="#4b3a35" />
                  </div>
                  <span style={{ fontWeight: '600', color: '#2c2620', fontSize: '14px' }}>
                    {item.name}
                  </span>
                </div>
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
                  <Tag size={12} />
                  {item.category}
                </span>
              </td>
              
              <td style={tdStyle}>
                <span style={{ fontWeight: "600", color: "#b1223a" }}>{item.stock}</span> <span style={{ fontSize: "13px", color: "#8b7b78" }}>{item.unit}</span>
              </td>
              
              <td style={tdStyle}>
                <span style={{ fontWeight: "500", color: "#4b3a35" }}>{item.minStock}</span> <span style={{ fontSize: "13px", color: "#8b7b78" }}>{item.unit}</span>
              </td>
              
              <td style={{ ...tdStyle, minWidth: "150px" }}>
                <StatusBar
                  current={item.stock}
                  minimum={item.minStock}
                  maximum={item.maxStock}
                  unit={item.unit}
                />
              </td>
              
              <td style={{ ...tdStyle, fontSize: "13px", color: "#8b7b78" }}>{item.lastEntry}</td>

              <td style={tdStyle}>
                <div style={actionsWrapperStyle}>
                  <button
                    onClick={() => onOpenModal(item)}
                    className="icon-action-button icon-action-button--move"
                    title="Movimiento de stock"
                    aria-label="Movimiento de stock"
                  >
                    <ArrowUpDown size={20} strokeWidth={2.6} />
                  </button>

                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === item.id ? null : item.id)
                      }
                      className="icon-action-button icon-action-button--menu"
                      title="Más opciones"
                      aria-label="Más opciones"
                    >
                      <MoreVertical size={20} strokeWidth={2.8} />
                    </button>

                    {openMenuId === item.id && (
                      <div style={{
                        ...dropdownStyle,
                        ...(index >= items.length - 2 && items.length > 3 
                          ? { top: "auto", bottom: "100%", marginBottom: "8px" } 
                          : {})
                      }}>
                        <Link
                          to={`/inventario/editar-material/${item.id}`}
                          style={dropdownItemStyle}
                          onClick={() => setOpenMenuId(null)}
                        >
                          <Pencil size={16} />
                          Editar
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          style={dropdownDeleteStyle}
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#8b7b78" }}>
                No hay materiales registrados en el inventario.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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
  padding: "20px",
  borderBottom: "1px solid #f7f2ee",
  verticalAlign: "middle",
};

const iconBoxStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  background: "#f7f2ee",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const actionsWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const dropdownStyle = {
  position: "absolute",
  top: "46px",
  right: 0,
  minWidth: "150px",
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