import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduction } from '../context/ProductionContext';
import { useAuth } from '../../auth/context/AuthContext';
import AppLayout from "../../../shared/layout/AppLayout";
import { MdArrowBack as ArrowLeft } from 'react-icons/md';
import toast from 'react-hot-toast';

export const NewProductionPage = () => {
  const navigate = useNavigate();
  const { createProductionOrder } = useProduction();
  const { token } = useAuth();
  
  // Estados del Formulario
  const [pedidoId, setPedidoId] = useState('');
  const [operarioAsignado, setOperarioAsignado] = useState('');
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulación u obtención de pedidos que vienen de Ventas listos para fabricar
  useEffect(() => {
    const cargarPedidosDisponibles = async () => {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch('http://localhost:8000/api/produccion/pedidos_pendientes/', { headers });
        if (response.ok) {
          const data = await response.json();
          setPedidosPendientes(data);
        } else {
          console.error("Error fetching pending orders");
        }
      } catch (error) {
        console.error("Error loading pending orders:", error);
      }
    };
    cargarPedidosDisponibles();
  }, [token]);

  const handleCrearOrden = async (e) => {
    e.preventDefault();
    if (!pedidoId) {
      toast.error("Por favor selecciona un pedido pendiente.");
      return;
    }

    setIsSubmitting(true);
    
    // Construimos la carga útil básica para inicializar la OP en Django
    const payload = {
      id: Number(pedidoId),
      pedido: Number(pedidoId),
      pedido_id: Number(pedidoId),
      operario: operarioAsignado,
      fecha_inicio: new Date().toISOString().split('T')[0]
    };

    // Usamos la función del contexto para impactar el backend
    const success = await createProductionOrder(payload);
    setIsSubmitting(false);

    if (success) {
      toast.success(`¡Orden para el Pedido #${pedidoId} generada exitosamente!`);
      navigate('/produccion'); 
    } else {
      toast.error("Error al intentar generar la orden de producción.");
    }
  };

  return (
    <AppLayout title="Generar Orden">
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Generar Orden de Producción</h1>
              <p style={{ color: "#6f5d56", margin: 0 }}>
                Vincula un pedido de venta aprobado para iniciar su manufactura en la planta.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/produccion')}
              style={{ ...cancelButtonStyle, display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px" }}
            >
              <ArrowLeft size={16} /> Volver
            </button>
          </div>

          <form onSubmit={handleCrearOrden}>
          
            <label style={labelStyle}>Seleccionar Pedido Pendiente</label>
            <select 
              value={pedidoId} 
              onChange={(e) => setPedidoId(e.target.value)} 
              style={inputStyle}
              required
            >
              <option value="" disabled>Seleccione un pedido en fila</option>
              {pedidosPendientes.map((p) => (
                <option key={p.id} value={p.id}>{p.descripcion}</option>
              ))}
            </select>

            <label style={labelStyle}>Asignar Maestro Zapatero / Operario</label>
            <input 
              type="text" 
              placeholder="Ej: Carlos Mendoza - Área de Cortado" 
              value={operarioAsignado}
              onChange={(e) => setOperarioAsignado(e.target.value)}
              style={inputStyle}
            />

            <div style={actionsStyle}>
              <button type="submit" style={saveButtonStyle} disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Confirmar y Lanzar Orden'}
            </button>
              <button type="button" style={cancelButtonStyle} onClick={() => navigate('/produccion')}>
              Cancelar
            </button>
            </div>

          </form>
        </div>
      </div>
    </AppLayout>
  );
};

const pageStyle = {
  padding: "30px",
};

const cardStyle = {
  maxWidth: "900px",
  background: "white",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  marginTop: "14px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #d8ccc4",
  boxSizing: "border-box",
};

const actionsStyle = {
  display: "flex",
  gap: "12px",
  marginTop: "24px",
};

const saveButtonStyle = {
  border: "none",
  background: "#b1223a",
  color: "white",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  border: "none",
  background: "#e8ded8",
  color: "#4b3a35",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
};