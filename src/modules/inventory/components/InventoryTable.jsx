import { useState } from "react";
import { Link } from "react-router-dom";
import { MdMoreVert as MoreVertical } from "react-icons/md";
import { MdEdit as Pencil, MdDelete as Trash2, MdSwapVert as ArrowUpDown } from "react-icons/md";
import StatusBar from "./StatusBar";
import { useInventory } from "../context/InventoryContext";

export default function InventoryTable({ items, onOpenModal }) {
  const { deleteMaterial } = useInventory();
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas borrar este material?")) {
      deleteMaterial(id);
      setOpenMenuId(null);
    }
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        borderRadius: "12px",
        overflow: "visible",
      }}
    >
      <thead>
        <tr style={{ background: "#f7f2ee" }}>
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
        {items.map((item) => (
          <tr key={item.id}>
            <td style={tdStyle}>{item.name}</td>
            <td style={tdStyle}>{item.category}</td>
            <td style={tdStyle}>
              {item.stock} {item.unit}
            </td>
            <td style={tdStyle}>
              {item.minStock} {item.unit}
            </td>
            <td style={{ ...tdStyle, minWidth: "150px" }}>
              <StatusBar
                current={item.stock}
                minimum={item.minStock}
                maximum={item.maxStock}
                unit={item.unit}
              />
            </td>
            <td style={tdStyle}>{item.lastEntry}</td>

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
                    <div style={dropdownStyle}>
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
      </tbody>
    </table>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #eee",
};

const actionsWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const iconActionButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  border: "none",
  background: "#b99196",
  color: "#4b3a35",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const menuButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  border: "none",
  background: "#c9c9c9",
  color: "#4b3a35",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
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
  zIndex: 20,
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