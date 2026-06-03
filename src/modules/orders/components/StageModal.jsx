import { useState } from "react";
import toast from "react-hot-toast";
import { useOrders } from "../context/OrdersContext";

export default function StageModal({ order, onClose }) {
    const { updateOrder } = useOrders();
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statuses = [
        { id: "pending", label: "Pendiente", color: "#f39c12", bg: "#fdf5e6" },
        { id: "in_production", label: "En Producción", color: "#3498db", bg: "#eaf2f8" },
        { id: "finished", label: "Terminado", color: "#2ecc71", bg: "#e9f7ef" },
        { id: "sent", label: "Enviado", color: "#9b59b6", bg: "#f4ecf7" }
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await updateOrder(order.id, { status: selectedStatus });
            toast.success("Estado actualizado con éxito");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al cambiar el estado");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: "4px", fontSize: "24px", fontWeight: "700" }}>
                            Cambiar Estado
                        </h2>
                        <p style={{ color: "#8b7b78", marginBottom: 0, fontSize: "14px", fontWeight: "500" }}>Actualizando pedido #{order.id}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        style={closeButtonStyle}
                        title="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                    {statuses.map((st) => (
                        <button
                            key={st.id}
                            onClick={() => setSelectedStatus(st.id)}
                            style={{
                                padding: "16px",
                                borderRadius: "12px",
                                border: `2px solid ${selectedStatus === st.id ? st.color : "#e8ded8"}`,
                                background: selectedStatus === st.id ? st.bg : "white",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.2s"
                            }}
                        >
                            <span style={{ fontWeight: "600", color: selectedStatus === st.id ? st.color : "#6f5d56" }}>
                                {st.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        style={{ flex: 1, padding: "14px", background: "#b1223a", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: isSubmitting ? "not-allowed" : "pointer" }}
                    >
                        {isSubmitting ? "Guardando..." : "Confirmar Estado"}
                    </button>
                    <button 
                        onClick={onClose} 
                        style={{ flex: 1, padding: "14px", background: "#e8ded8", color: "#4b3a35", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    animation: "fadeInOverlay 0.3s ease-out",
    backdropFilter: "blur(2px)",
};

const modalStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
    animation: "slideUpModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    border: "1px solid rgba(255,255,255,0.8)",
};

const labelStyle = {
    display: "block",
    marginBottom: "10px",
    marginTop: "0",
    fontWeight: "600",
    color: "#2d1f20",
    fontSize: "14px",
    textTransform: "capitalize",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f0ede8",
};

const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#b9a39a",
    cursor: "pointer",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    transition: "all 0.2s ease",
};

const typeButtonStyle = {
    flex: 1,
    padding: "13px 14px",
    border: "2px solid",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const confirmButtonStyle = {
    flex: 1,
    padding: "13px 16px",
    background: "linear-gradient(135deg, #0f9d58 0%, #0b7d46 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 6px 16px rgba(15, 157, 88, 0.25)",
};

const cancelButtonStyle = {
    flex: 1,
    padding: "13px 16px",
    background: "#f5f0ed",
    color: "#2d1f20",
    border: "1.5px solid #e8dcd2",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};