import React, { useState, useEffect } from 'react';
import { useProduction } from '../context/ProductionContext';
import { ProductionTable } from '../components/ProductionTable';
import { ProductionStatusBar } from '../components/ProductionStatusBar';
import { ProductionFilters } from '../components/ProductionFilters';
import { ProductionModal } from '../components/ProductionModal';
import AppLayout from "../../../shared/layout/AppLayout";
import { useNavigate } from 'react-router-dom';
import { MdAdd as Plus, MdArrowBack as ArrowLeft } from 'react-icons/md';
import toast from 'react-hot-toast';

export const ProductionPage = () => {
  const { ordersInProduction, loading, fetchProductionOrders, finishProductionOrder } = useProduction();
  const [filter, setFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Forzar recarga al montar el componente para asegurar datos frescos del backend
  useEffect(() => {
    fetchProductionOrders();
  }, []);

  // Manejo de acciones dinámicas desde la tabla
  const handleActionClick = async (order, actionType) => {
    if (actionType === 'start') {
      setSelectedOrder(order);
      setIsModalOpen(true); // Abre el modal para asociar materia prima (RF14)
    } else if (actionType === 'finish') {
      const confirmFinish = window.confirm(`¿Confirmas que la orden #${order.id} ha terminado su proceso de fabricación?`);
      if (confirmFinish) {
        const success = await finishProductionOrder(order.id); // Cambia estado a 'Terminado' (RF16)
        if (success) {
          toast.success(`Orden #${order.id} finalizada y pasada a inventario.`);
        }
      }
    }
  };

  // Filtrado de las órdenes según el botón seleccionado
  const filteredOrders = ordersInProduction.filter(order => {
    if (filter === 'Todos') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <AppLayout title="Control de Producción">
        <div style={{ padding: '40px', textAlign: 'center', fontSize: '16px', color: '#6f5d56' }}>
          Cargando panel del taller de Aranda Calzado...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Control de Producción">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate('/')}
            title="Volver al inicio"
            style={{
              background: "#e8ded8",
              border: "none",
              borderRadius: "10px",
              padding: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#4b3a35"
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ marginBottom: "10px", marginTop: 0 }}>Control de Producción</h1>
            <p style={{ color: "#6f5d56", margin: 0 }}>Gestión operativa del taller y trazabilidad de calzado</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/produccion/new')}
          style={{
            textDecoration: "none",
            background: "#b1223a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Plus size={18} /> Nueva Orden
        </button>
      </div>

      <ProductionStatusBar orders={ordersInProduction} />

      <div style={{ marginBottom: "20px" }}>
        <ProductionFilters activeFilter={filter} onFilterChange={setFilter} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <ProductionTable orders={filteredOrders} onActionClick={handleActionClick} />
      </div>

      {isModalOpen && (
        <ProductionModal 
          order={selectedOrder} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </AppLayout>
  );
};