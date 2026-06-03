import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2, ArrowUpDown, Building2 } from "lucide-react";
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

const getBadgeStyles = (status) => {
  switch (status) {
    case 'pending':
      return { bg: "#e2f1fd", color: "#1976d2" };
    case 'in_production':
      return { bg: "#fff4e5", color: "#e65100" };
    case 'finished':
      return { bg: "#dff7ea", color: "#0f9d58" };
    case 'sent':
      return { bg: "#e8ded8", color: "#4b3a35" };
    default:
      return { bg: "#f5f5f5", color: "#616161" };
  }
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
    return new Date(isoString).toLocaleDateString('es-ES');
  }

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      overflow: "visible",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
      marginBottom: "140px", // Reserva espacio al final de la página para evitar que el scroll salte
    }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "white" }}>
            <th style={thStyle}>Orden</th>
            <th style={thStyle}>Cliente</th>
            <th style={thStyle}>Información</th>
            <th style={thStyle}>Detalle de Calzado</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const customer = item.customer_detail;
            const customerName = customer?.full_name || customer?.name || customer?.user?.first_name || customer?.user?.username || "Cliente Desconocido";
            const badge = getBadgeStyles(item.status);

            return (
              <tr key={item.id}>
                <td style={tdStyle}>
                  <div style={orderBoxStyle}>
                    <span style={{ fontWeight: "700", color: "#b1223a", fontSize: "16px" }}>#{item.id}</span>
                    <span style={{ fontSize: "11px", color: "#8b7b78", marginTop: "4px" }}>Creada: {formatDate(item.created_at)}</span>
                  </div>
                </td>
                
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={clientIconBoxStyle}>
                      <Building2 size={18} color="#4b3a35" />
                    </div>
                    <span style={{ fontWeight: '500', color: '#2c2620', fontSize: '14px' }}>
                      {customerName} {customer?.user?.last_name || ""}
                    </span>
                  </div>
                </td>
                
                <td style={tdStyle}>
                  <div style={{ fontSize: "13px", color: "#4b3a35" }}>
                    <div>📞 {customer?.phone || "N/A"}</div>
                    <div style={{ marginTop: '4px' }}>📍 {customer?.address || "N/A"}</div>
                  </div>
                </td>
                
                <td style={tdStyle}>
                  <div style={{ fontSize: "13px", color: "#4b3a35", lineHeight: "1.6" }}>
                    {item.items && item.items.length > 0 ? (
                      item.items.map((orderItem, idx) => (
                        <div key={orderItem.id || idx} style={{ marginBottom: idx < item.items.length - 1 ? '6px' : '0', paddingBottom: idx < item.items.length - 1 ? '6px' : '0', borderBottom: idx < item.items.length - 1 ? '1px dashed #f0e8e4' : 'none' }}>
                          <strong>{orderItem.quantity} par(es) - {orderItem.product_detail?.name || 'Desconocido'}</strong>
                          <div style={{ color: "#8b7b78", fontSize: "12px", marginTop: "2px" }}>Talla {orderItem.size} | P.U: {formatCurrency(orderItem.unit_price)}</div>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: '#8b7b78', fontStyle: 'italic' }}>Sin productos</span>
                    )}
                  </div>
                </td>
                
                <td style={tdStyle}>
                  <strong style={{ color: "#2c2620" }}>{formatCurrency(item.total_amount)}</strong>
                </td>
                
                <td style={tdStyle}>
                  <span style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    background: badge.bg,
                    color: badge.color,
                    fontWeight: "600",
                    fontSize: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }}></span>
                    {getStatusLabel(item.status)}
                  </span>
                </td>

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
              <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#8b7b78" }}>
                No se encontraron pedidos.
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

const orderBoxStyle = {
  background: "#fdfbfa",
  borderRadius: "8px",
  padding: "10px 14px",
  display: "inline-flex",
  flexDirection: "column",
  border: "1px solid #f0e8e4"
};

const clientIconBoxStyle = {
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