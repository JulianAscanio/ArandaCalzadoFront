import { useMemo } from "react";
import { useReports } from "../context/ReportsContext";
import ReportTable from "../components/ReportTable";
import ReportSummaryCards from "../components/ReportSummaryCards";

const statusLabels = {
    pending: "Pendiente",
    in_production: "En Producción",
    finished: "Terminado",
    sent: "Enviado",
};

const statusColors = {
    pending: "#f39c12",
    in_production: "#3498db",
    finished: "#27ae60",
    sent: "#8e44ad",
};

export default function OrdersReportPage() {
    const { orders, loading } = useReports();

    const summary = useMemo(() => {
        const total = orders.length;
        const byStatus = orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {});
        const totalAmount = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);
        return { total, byStatus, totalAmount };
    }, [orders]);

    const completedAndSent = useMemo(() => {
        return orders.filter((o) => o.status === "finished" || o.status === "sent");
    }, [orders]);

    const columns = [
        {
            key: "id",
            label: "Pedido",
            render: (val) => <span style={{ fontWeight: "600" }}>#{val}</span>,
        },
        {
            key: "customer_detail",
            label: "Cliente",
            render: (val) => val?.full_name || "Sin cliente",
        },
        {
            key: "status",
            label: "Estado",
            render: (val) => (
                <span style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: (statusColors[val] || "#999") + "18",
                    color: statusColors[val] || "#999",
                    fontSize: "12px",
                    fontWeight: "600",
                }}>
                    {statusLabels[val] || val}
                </span>
            ),
        },
        {
            key: "total_amount",
            label: "Total",
            render: (val) => (
                <span style={{ fontWeight: "600" }}>
                    ${Number(val).toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                </span>
            ),
        },
        {
            key: "items",
            label: "Productos",
            render: (val) => {
                if (!val || val.length === 0) return <span style={{ color: "#8b7b78" }}>Sin productos</span>;
                return (
                    <span style={{ fontSize: "13px" }}>
                        {val.length} producto{val.length > 1 ? "s" : ""}
                    </span>
                );
            },
        },
        {
            key: "created_at",
            label: "Fecha",
            render: (val) => <span style={{ fontSize: "13px", color: "#8b7b78" }}>{val}</span>,
        },
    ];

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#6f5d56" }}>
                Cargando reporte de pedidos...
            </div>
        );
    }

    return (
        <>
            <ReportSummaryCards cards={[
                { label: "Total pedidos", value: summary.total, color: "#4b3a35" },
                { label: "Pendientes", value: summary.byStatus.pending || 0, color: "#f39c12" },
                { label: "En producción", value: summary.byStatus.in_production || 0, color: "#3498db" },
                { label: "Terminados", value: summary.byStatus.finished || 0, color: "#27ae60" },
                { label: "Enviados", value: summary.byStatus.sent || 0, color: "#8e44ad" },
                { label: "Valor total", value: `$${summary.totalAmount.toLocaleString("es-CO")}`, color: "#2d6a4f" },
            ]} />

            <div style={{ marginBottom: "24px" }}>
                <h3 style={{ marginBottom: "12px", color: "#4b3a35" }}>
                    Pedidos realizados y completados ({completedAndSent.length})
                </h3>
                <ReportTable
                    columns={columns}
                    rows={completedAndSent}
                    emptyMessage="No hay pedidos terminados o enviados."
                />
            </div>

            <div>
                <h3 style={{ marginBottom: "12px", color: "#4b3a35" }}>
                    Todos los pedidos ({orders.length})
                </h3>
                <ReportTable
                    columns={columns}
                    rows={orders}
                    emptyMessage="No hay pedidos registrados."
                />
            </div>
        </>
    );
}
