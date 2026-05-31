import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useOrders } from "../context/OrdersContext";

const getStatusLabel = (status) => {
  const map = {
    pending: "Pendiente",
    in_production: "En Producción",
    finished: "Terminado",
    sent: "Enviado"
  };
  return map[status] || status;
};

export default function OrdersTable({ items, onOpenModal }) {
  const { deleteOrder } = useOrders();
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro que vas a eliminar permanentemente esto?")) {
      deleteOrder(id);
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

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString();
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <thead>
        <tr style={{ background: "#f7f2ee" }}>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Cliente</th>
          <th style={thStyle}>Información</th>
          <th style={thStyle}>Detalle de Calzado</th>
          <th style={thStyle}>Fecha</th>
          <th style={thStyle}>Total</th>
          <th style={thStyle}>Estado</th>
          <th style={thStyle}>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => {
          const customer = item.customer_detail;
          const user = customer?.user || {};

          return (
            <tr key={item.id}>
              <td style={tdStyle}>#{item.id}</td>
              <td style={tdStyle}>
                <strong>{user.first_name || user.username || "Desconocido"} {user.last_name || ""}</strong>
              </td>
              <td style={tdStyle}>
                <div style={{ fontSize: "13px", color: "#555" }}>
                  <div>📞 {customer?.phone || "N/A"}</div>
                  <div>📍 {customer?.address || "N/A"}</div>
                </div>
              </td>
              <td style={tdStyle}>
                <div style={{ fontSize: "13px" }}>
                  {item.items && item.items.length > 0 ? (
                    item.items.map((orderItem, idx) => (
                      <div key={orderItem.id || idx} style={{ marginBottom: idx < item.items.length - 1 ? '6px' : '0', paddingBottom: idx < item.items.length - 1 ? '6px' : '0', borderBottom: idx < item.items.length - 1 ? '1px dashed #f2ebe6' : 'none' }}>
                        <strong>{orderItem.product_detail?.name || 'Desconocido'}</strong> (x{orderItem.quantity})
                        <div>Talla: {orderItem.size} | P.U: {formatCurrency(orderItem.unit_price)}</div>
                      </div>
                    ))
                  ) : (
                    "Sin productos"
                  )}
                </div>
              </td>
              <td style={tdStyle}>{formatDate(item.created_at)}</td>
              <td style={tdStyle}>
                <strong>{formatCurrency(item.total_amount)}</strong>
              </td>
              <td style={tdStyle}>{getStatusLabel(item.status)}</td>

              <td style={tdStyle}>
                <div style={actionsWrapperStyle}>
                  <button
                    onClick={() => onOpenModal(item)}
                    className="icon-action-button icon-action-button--move"
                    title="Cambio de Estado"
                    aria-label="Cambio de Estado"
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
                          to={`/pedidos/editar-orden/${item.id}`}
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
          );
        })}
        {items.length === 0 && (
          <tr>
            <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
              No se encontraron pedidos.
            </td>
          </tr>
        )}
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