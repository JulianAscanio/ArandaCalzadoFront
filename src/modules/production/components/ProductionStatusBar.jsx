import React from 'react';

export const ProductionStatusBar = ({ orders }) => {
  // Contamos dinámicamente según el estado de las órdenes del taller (RF17)
  const pendientes = orders.filter(o => o.status === 'Pendiente').length;
  const enProceso = orders.filter(o => o.status === 'En producción').length;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <span style={labelStyle}>Órdenes Pendientes</span>
        <span style={{ ...valueStyle, color: '#1976d2' }}>{pendientes}</span>
      </div>
      <div style={cardStyle}>
        <span style={labelStyle}>En Fabricación</span>
        <span style={{ ...valueStyle, color: '#e65100' }}>{enProceso}</span>
      </div>
    </div>
  );
};

const containerStyle = { 
  display: 'flex', 
  gap: '16px', 
  marginBottom: '24px' 
};

const cardStyle = { 
  flex: 1, 
  backgroundColor: 'white', 
  padding: '20px', 
  borderRadius: '14px', 
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', 
  display: 'flex', 
  flexDirection: 'column' 
};

const labelStyle = { 
  fontSize: '14px', 
  color: '#6f5d56', 
  fontWeight: '600' 
};

const valueStyle = { 
  fontSize: '28px', 
  fontWeight: 'bold', 
  marginTop: '8px' 
};