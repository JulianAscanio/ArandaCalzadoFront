import { useState } from "react";
import { useReports } from "../context/ReportsContext";
import SuppliesReportPage from "./SuppliesReportPage";
import ConsumptionReportPage from "./ConsumptionReportPage";
import OrdersReportPage from "./OrdersReportPage";
import AppLayout from "../../../shared/layout/AppLayout";

const tabs = [
    { id: "supplies", label: "Insumos disponibles" },
    { id: "consumption", label: "Consumo de materias primas" },
    { id: "orders", label: "Pedidos realizados" },
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState("supplies");
    const { loading } = useReports();

    return (
        <AppLayout title="Reportes">
            <div style={{ marginBottom: "14px" }}>
                <h1 style={{ marginBottom: "10px" }}>Centro de Reportes</h1>
                <p style={{ color: "#6f5d56" }}>
                    Consulta y genera reportes del inventario, consumo y pedidos
                </p>
            </div>

            <div style={{
                display: "flex",
                gap: "8px",
                marginBottom: "24px",
                borderBottom: "2px solid #f0e8e4",
                paddingBottom: "0",
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: "12px 20px",
                            borderRadius: "10px 10px 0 0",
                            border: "none",
                            background: activeTab === tab.id ? "#b1223a" : "transparent",
                            color: activeTab === tab.id ? "white" : "#6f5d56",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#6f5d56" }}>
                    Cargando datos...
                </div>
            ) : (
                <>
                    {activeTab === "supplies" && <SuppliesReportPage />}
                    {activeTab === "consumption" && <ConsumptionReportPage />}
                    {activeTab === "orders" && <OrdersReportPage />}
                </>
            )}
        </AppLayout>
    );
}
