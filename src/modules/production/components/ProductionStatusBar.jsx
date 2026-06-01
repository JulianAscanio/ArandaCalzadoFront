import React from 'react';
import { ClipboardList, Settings } from 'lucide-react';

export const ProductionStatusBar = ({ orders }) => {
  // Contamos dinámicamente según el estado de las órdenes del taller (RF17)
  const pendientes = orders.filter(o => o.status === 'Pendiente').length;
  const enProceso = orders.filter(o => o.status === 'En producción').length;

  return (
    <div style={cardStyle}>
      <div style={sectionStyle}>
        <div style={iconBoxStyle}>
          <ClipboardList size={28} color="#4b3a35" />
        </div>
        <div style={textContainerStyle}>
          <span style={labelStyle}>Órdenes Pendientes</span>
          <span style={{ ...valueStyle, color: '#1976d2' }}>{pendientes}</span>
          <span style={subtextStyle}>Órdenes esperando producción</span>
        </div>
      </div>
      
      <div style={dividerStyle}></div>

      <div style={sectionStyle}>
        <div style={iconBoxStyle}>
          <Settings size={28} color="#4b3a35" />
        </div>
        <div style={textContainerStyle}>
          <span style={labelStyle}>En Fabricación</span>
          <span style={{ ...valueStyle, color: '#e65100' }}>{enProceso}</span>
          <span style={subtextStyle}>Órdenes en proceso actualmente</span>
        </div>
      </div>
    </div>
  );
};

const cardStyle = { 
  display: 'flex', 
  backgroundColor: 'white', 
  padding: '24px', 
  borderRadius: '16px', 
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', 
  marginBottom: '24px',
  alignItems: 'center'
};

const sectionStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  padding: '0 20px'
};

const iconBoxStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#f7f2ee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const textContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

const labelStyle = { 
  fontSize: '15px', 
  color: '#2c2620', 
  fontWeight: '600' 
};

const valueStyle = { 
  fontSize: '32px', 
  fontWeight: 'bold', 
  lineHeight: '1.2'
};

const subtextStyle = {
  fontSize: '13px',
  color: '#8b7b78'
};

const dividerStyle = {
  width: '1px',
  height: '70px',
  backgroundColor: '#e8ded8'
};