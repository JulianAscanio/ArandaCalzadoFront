import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack as ArrowLeft } from "react-icons/md";
import SearchBar from "../components/SearchBar";
import StatusFilters from "../components/StatusFilters";
import OrdersTable from "../components/OrdersTable";
import StageModal from "../components/StageModal";
import { useOrders } from "../context/OrdersContext";
import AppLayout from "../../../shared/layout/AppLayout";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const { orders, fetchOrders } = useOrders();

  // Forzar recarga de datos al montar el componente para ver estados actualizados
  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusLabel = (status) => {
    const map = {
      pending: "Pendiente",
      in_production: "En Producción",
      finished: "Terminado",
      sent: "Enviado"
    };
    return map[status] || status;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const customerName = (item.customer_detail?.full_name || item.customer_detail?.name || item.customer_detail?.user?.first_name || item.customer_detail?.user?.username || "").toLowerCase();
      const productName = (item.items?.[0]?.product_detail?.name || "").toLowerCase();

      const matchesSearch =
        customerName.includes(search.toLowerCase()) ||
        productName.includes(search.toLowerCase());

      const statusLabel = getStatusLabel(item.status);
      const matchesStatus =
        activeStatus === "Todos" || statusLabel === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, activeStatus]);

  return (
    <AppLayout title="Pedidos">
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
            <h1 style={{ marginBottom: "10px", marginTop: 0 }}>Gestión de Pedidos</h1>
            <p style={{ color: "#6f5d56", margin: 0 }}>
              Control de pedidos de clientes y estados de producción
            </p>
          </div>
        </div>

        <Link
          to="/nuevo-pedido"
          style={{
            textDecoration: "none",
            background: "#b1223a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
          }}
        >
          + Nuevo Pedido
        </Link>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <StatusFilters
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />
      </div>

      <OrdersTable items={filteredOrders} onOpenModal={setSelectedOrder} />
      {
        selectedOrder && (
          <StageModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )
      }
    </AppLayout>
  );
}