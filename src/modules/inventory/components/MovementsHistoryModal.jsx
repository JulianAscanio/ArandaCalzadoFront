import { useInventory } from "../context/InventoryContext";

export default function MovementsHistoryModal({ onClose }) {
    const { movements } = useInventory();

    const getBadgeStyles = (type) => {
        switch (type) {
            case "entrada":
                return { bg: "#dff7ea", color: "#0f9d58", label: "Entrada" };
            case "salida":
                return { bg: "#fde2e7", color: "#b1223a", label: "Salida" };
            case "creación":
                return { bg: "#e2f1fd", color: "#1976d2", label: "Creación" };
            case "eliminación":
                return { bg: "#efeebf", color: "#8d6e63", label: "Eliminación" };
            default:
                return { bg: "#f5f5f5", color: "#616161", label: type || "Ajuste" };
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: "4px", fontSize: "24px", fontWeight: "700", color: "#2d1f20" }}>
                            Historial de movimientos
                        </h2>
                        <p style={{ color: "#8b7b78", marginBottom: 0, fontSize: "14px", fontWeight: "500" }}>
                            Registro de entradas y salidas del inventario
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        style={closeButtonStyle}
                        title="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <div style={tableContainerStyle} className="custom-scrollbar">
                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ background: "#f7f2ee", position: "sticky", top: 0, zIndex: 1 }}>
                                <th style={thStyle}>Material</th>
                                <th style={thStyle}>Tipo</th>
                                <th style={thStyle}>Cantidad</th>
                                <th style={thStyle}>Motivo</th>
                                <th style={thStyle}>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#6f5d56" }}>
                                        No hay movimientos registrados todavía.
                                    </td>
                                </tr>
                            ) : (
                                movements.map((movement) => {
                                    const badge = getBadgeStyles(movement.movementType);
                                    return (
                                        <tr key={movement.id} className="history-table-row">
                                            <td style={{ ...tdStyle, fontWeight: "500" }}>{movement.materialName}</td>
                                            <td style={tdStyle}>
                                                <span
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "999px",
                                                        background: badge.bg,
                                                        color: badge.color,
                                                        fontWeight: "600",
                                                        fontSize: "12px",
                                                        display: "inline-block",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>{movement.quantity}</td>
                                            <td style={tdStyle}>{movement.reason || "-"}</td>
                                            <td style={{ ...tdStyle, color: "#777", fontSize: "13px" }}>{movement.date}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={footerStyle}>
                    <button onClick={onClose} style={closeBtnStyle} className="btn-secondary">
                        Cerrar historial
                    </button>
                </div>
            </div>
        </div>
    );
}

// Styling definitions
const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
    animation: "fadeInOverlay 0.3s ease-out",
};

const modalStyle = {
    width: "100%",
    maxWidth: "850px",
    background: "white",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
    animation: "slideUpModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    border: "1px solid rgba(255,255,255,0.8)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "85vh",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
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

const tableContainerStyle = {
    flex: 1,
    overflowY: "auto",
    borderRadius: "12px",
    border: "1px solid #f0ede8",
    marginBottom: "20px",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
};

const thStyle = {
    textAlign: "left",
    padding: "14px",
    borderBottom: "1px solid #e8ded8",
    color: "#4b3a35",
    fontWeight: "600",
    background: "#f7f2ee",
};

const tdStyle = {
    padding: "14px",
    borderBottom: "1px solid #f7f2ee",
    color: "#333",
};

const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "12px",
    borderTop: "1px solid #f0ede8",
};

const closeBtnStyle = {
    padding: "10px 20px",
    border: "1.5px solid #e8dcd2",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
};
