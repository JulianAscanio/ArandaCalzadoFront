import { Link } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";

export default function MovementsPage() {
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
        <div style={{ padding: "30px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}>
                <div>
                    <h1 style={{ marginBottom: "8px" }}>Historial de movimientos</h1>
                    <p style={{ color: "#6f5d56" }}>Registro de entradas y salidas del inventario</p>
                </div>
                <Link
                    to="/inventario"
                    style={{
                        textDecoration: "none",
                        background: "#e8ded8",
                        color: "#4b3a35",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        transition: "background 0.2s",
                    }}
                >
                    Volver a inventario
                </Link>
            </div>
            <div
                style={{
                    background: "white",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#f7f2ee" }}>
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
                                <td style={tdStyle} colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#6f5d56" }}>
                                    No hay movimientos registrados todavía.
                                </td>
                            </tr>
                        ) : (
                            movements.map((movement) => {
                                const badge = getBadgeStyles(movement.movementType);
                                return (
                                    <tr key={movement.id}>
                                        <td style={tdStyle} style={{ ...tdStyle, fontWeight: "500" }}>{movement.materialName}</td>
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
                                        <td style={tdStyle} style={{ ...tdStyle, color: "#777", fontSize: "13px" }}>{movement.date}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #e8ded8",
  color: "#4b3a35",
  fontWeight: "600",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #f7f2ee",
  color: "#333",
};