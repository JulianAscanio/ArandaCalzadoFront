import React, { useState } from 'react';
import { useProduction } from '../context/ProductionContext';
import toast from 'react-hot-toast';

export const ProductionModal = ({ order, onClose }) => {
  const { startProductionOrder } = useProduction();
  
  // Estados para capturar el consumo manual de insumos (RF14)
  const [materialType, setMaterialType] = useState('Cuero');
  const [quantityUsed, setQuantityUsed] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantityUsed || quantityUsed <= 0) {
      toast.error("Por favor introduce una cantidad de material válida.");
      return;
    }

    const payload = {
      material: materialType,
      cantidad: parseFloat(quantityUsed),
      observaciones: notes
    };

    // Llama al contexto que conecta con Django para descontar inventario y cambiar estado (RF13, RF14)
    const success = await startProductionOrder(order.id, payload);
    if (success) {
      toast.success(`Orden ${order.id} puesta en producción con éxito`);
      onClose();
    } else {
      toast.error("Hubo un error al procesar los insumos de la orden.");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalContainerStyle}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>Asociar Insumos: Orden {order.id}</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6f5d56' }}>Producto a fabricar: {order.product_name || "Calzado Aranda"}</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={labelStyle}>Materia Prima Requerida</label>
            <select 
              value={materialType} 
              onChange={(e) => setMaterialType(e.target.value)}
              style={inputStyle}
            >
              <option value="Cuero">Cuero natural / sintético</option>
              <option value="Suelas">Suelas (Pares)</option>
              <option value="Adhesivos">Pegante especial / Pegamento</option>
              <option value="Costura">Hilos y herrajes</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Cantidad a utilizar (Stock)</label>
            <input 
              type="number" 
              placeholder="Ej: 5" 
              value={quantityUsed}
              onChange={(e) => setQuantityUsed(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Notas u observaciones de fabricación (Opcional)</label>
            <input 
              type="text" 
              placeholder="Ej: Forro extra para la talla solicitada" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={actionsStyle}>
            <button type="submit" style={saveButtonStyle}>
              Iniciar Producción
            </button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContainerStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '18px',
  padding: '28px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #d8ccc4",
  boxSizing: "border-box",
  outline: "none",
};

const actionsStyle = {
  display: "flex",
  gap: "12px",
  marginTop: "8px",
};

const saveButtonStyle = {
  flex: 1,
  border: "none",
  background: "#b1223a",
  color: "white",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};

const cancelButtonStyle = {
  border: "none",
  background: "#e8ded8",
  color: "#4b3a35",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};