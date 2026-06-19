import { useMemo } from "react";
import { useReports } from "../context/ReportsContext";
import ReportTable from "../components/ReportTable";
import ReportSummaryCards from "../components/ReportSummaryCards";
import AppLayout from "../../../shared/layout/AppLayout";

const statusColor = {
    critical: "#e74c3c",
    low: "#f39c12",
    available: "#27ae60",
};

function getStockStatus(material) {
    const stock = Number(material.stock) || 0;
    const min = Number(material.minStock) || 0;
    if (min > 0 && stock <= min * 0.5) return "critical";
    if (min > 0 && stock <= min) return "low";
    return "available";
}

function getStockStatusLabel(status) {
    if (status === "critical") return "Crítico";
    if (status === "low") return "Bajo";
    return "Disponible";
}

export default function SuppliesReportPage() {
    const { materials, loading } = useReports();

    const summary = useMemo(() => {
        const total = materials.length;
        const totalStock = materials.reduce((acc, m) => acc + (Number(m.stock) || 0), 0);
        const lowCount = materials.filter((m) => getStockStatus(m) === "low").length;
        const criticalCount = materials.filter((m) => getStockStatus(m) === "critical").length;
        return { total, totalStock, lowCount, criticalCount };
    }, [materials]);

    const columns = [
        {
            key: "name",
            label: "Material",
            render: (val) => (
                <span style={{ fontWeight: "600" }}>{val}</span>
            ),
        },
        { key: "category", label: "Categoría" },
        {
            key: "stock",
            label: "Stock actual",
            render: (val, row) => (
                <span>
                    <span style={{ fontWeight: "600" }}>{val}</span>
                    <span style={{ fontSize: "12px", color: "#8b7b78", marginLeft: "4px" }}>{row.unit}</span>
                </span>
            ),
        },
        {
            key: "minStock",
            label: "Stock mínimo",
            render: (val, row) => (
                <span>
                    {val} <span style={{ fontSize: "12px", color: "#8b7b78" }}>{row.unit}</span>
                </span>
            ),
        },
        {
            key: "maxStock",
            label: "Stock máximo",
            render: (val, row) => (
                <span>
                    {val} <span style={{ fontSize: "12px", color: "#8b7b78" }}>{row.unit}</span>
                </span>
            ),
        },
        {
            key: "status",
            label: "Estado",
            render: (_, row) => {
                const status = getStockStatus(row);
                return (
                    <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        background: statusColor[status] + "18",
                        color: statusColor[status],
                        fontSize: "12px",
                        fontWeight: "600",
                    }}>
                        {getStockStatusLabel(status)}
                    </span>
                );
            },
        },
        {
            key: "lastEntry",
            label: "Última entrada",
        },
    ];

    if (loading) {
        return (
            <AppLayout title="Reportes">
                <div style={{ padding: "40px", textAlign: "center", color: "#6f5d56" }}>
                    Cargando reporte de insumos...
                </div>
            </AppLayout>
        );
    }

    return (
        <>
            <ReportSummaryCards cards={[
                { label: "Total materiales", value: summary.total, color: "#4b3a35" },
                { label: "Stock total", value: summary.totalStock, color: "#2d6a4f" },
                { label: "Stock bajo", value: summary.lowCount, color: "#f39c12" },
                { label: "Stock crítico", value: summary.criticalCount, color: "#e74c3c" },
            ]} />

            <ReportTable columns={columns} rows={materials} emptyMessage="No hay materiales registrados." />
        </>
    );
}
