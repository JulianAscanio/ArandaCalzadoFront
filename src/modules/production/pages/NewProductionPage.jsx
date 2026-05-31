import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduction } from '../context/ProductionContext';
import AppLayout from "../../../shared/layout/AppLayout";
import { MdArrowBack as ArrowLeft } from 'react-icons/md';
import toast from 'react-hot-toast';

export const NewProductionPage = () => {
  const navigate = useNavigate();
  const { startProductionOrder } = useProduction();
  
  // Estados del Formulario
  const [pedidoId, setPedidoId] = useState('');
  const [operarioAsignado, setOperarioAsignado] = useState('');
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulación u obtención de pedidos que vienen de Ventas listos para fabricar
  useEffect(() => {
    // En producción real, puedes hacer un fetch a tus pedidos con status 'Pendiente'
    const cargarPedidosDisponibles = async () => {
      // Ejemplo de estructura según tu modelo lógico 'pedido_order'
      const datosSimulados = [
        { id: '102', descripcion: 'Pedido #102 - 12 pares de Botines Elegantes' },
        { id: '105', descripcion: 'Pedido #105 - 5 pares de Tacón Alto Vino' },
      ];
      setPedidosPendientes(datosSimulados);
    };
    cargarPedidosDisponibles();
  }, []);

  const handleCrearOrden = async (e) => {
    e.preventDefault();
    if (!pedidoId) {
      toast.error("Por favor selecciona un pedido pendiente.");
      return;
    }

    setIsSubmitting(true);
    
    // Construimos la carga útil básica para inicializar la OP en Django
    const payload = {
      pedido_id: pedidoId,
      operario: operarioAsignado,
      fecha_inicio: new Date().toISOString().split('T')[0]
    };

    // Usamos la función del contexto para impactar el backend
    const success = await startProductionOrder(pedidoId, payload);
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ marginBottom: "8px", marginTop: 0 }}>Generar Orden de Producción</h1>
            <p style={{ color: "#6f5d56" }}>
              Vincula un pedido de venta aprobado para iniciar su manufactura en la planta.
            </p>
          </div>
          <button
            onClick={() => navigate('/produccion')}
            style={cancelButtonStyle}
          >
            <ArrowLeft size={16} /> Volver al Panel
          </button>
        </div>

        <div style={cardStyle}>
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