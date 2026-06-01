import React from 'react';
import { Play, CheckCircle2, Building2 } from 'lucide-react';

export const ProductionTable = ({ orders, onActionClick }) => {
  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
      }}>
        <thead>
          <tr style={{ background: "white" }}>
            <th style={thStyle}>Orden</th>
            <th style={thStyle}>Cliente</th>
            <th style={thStyle}>Detalle Productos</th>
            <th style={thStyle}>Estado Actual</th>
            <th style={thStyle}>Acción Operativa</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ ...tdStyle, textAlign: "center", padding: "30px", color: "#6f5d56" }}>
                No se encontraron órdenes de producción en este estado.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const badge = getBadgeStyles(order.status);
              const dateCreated = order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES') : 'N/A';
              
              return (
                <tr key={order.id}>
                  <td style={tdStyle}>
                    <div style={orderBoxStyle}>
                      <span style={{ fontWeight: "700", color: "#b1223a", fontSize: "16px" }}>#{order.id}</span>
                      <span style={{ fontSize: "11px", color: "#8b7b78", marginTop: "4px" }}>Creada: {dateCreated}</span>
                    </div>
                  </td>
                  
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={clientIconBoxStyle}>
                        <Building2 size={18} color="#4b3a35" />
                      </div>
                      <span style={{ fontWeight: '500', color: '#2c2620', fontSize: '14px' }}>
                        {order.customer_name || order.customer_id || 'Cliente General'}
                      </span>
                    </div>
                  </td>
                  
                  <td style={tdStyle}>
                    {order.items && order.items.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#4b3a35', lineHeight: '1.6' }}>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.quantity} par(es) - {item.product_name || `Producto #${item.product_id}`} Talla {item.size || 'N/A'}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ color: '#8b7b78', fontSize: '13px', fontStyle: 'italic' }}>Sin productos registrados</span>
                    )}
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
                      {order.status}
                    </span>
                  </td>
                  
                  <td style={tdStyle}>
                    {order.status === 'Pendiente' ? (
                      <button 
                        style={btnStartStyle}
                        onClick={() => onActionClick(order, 'start')}
                      >
                        <Play size={16} />
                        Iniciar
                      </button>
                    ) : order.status === 'En producción' ? (
                      <button 
                        style={btnFinishStyle}
                        onClick={() => onActionClick(order, 'finish')}
                      >
                        <CheckCircle2 size={16} />
                        Finalizar
                      </button>
                    ) : (
                      <span style={{ color: '#0f9d58', fontWeight: 'bold', fontSize: '13px' }}>✓ Listado</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

const getBadgeStyles = (status) => {
  switch (status) {
    case 'Pendiente':
      return { bg: "#e2f1fd", color: "#1976d2" };
    case 'En producción':
      return { bg: "#fff4e5", color: "#e65100" };
    case 'Finalizado':
      return { bg: "#dff7ea", color: "#0f9d58" };
    default:
      return { bg: "#f5f5f5", color: "#616161" };
  }
};

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

const btnStartStyle = {
  backgroundColor: '#f7f2ee',
  color: '#4b3a35',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'background 0.2s ease',
};

const btnFinishStyle = {
  backgroundColor: '#b1223a',
  color: '#FFFFFF',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'background 0.2s ease',
};