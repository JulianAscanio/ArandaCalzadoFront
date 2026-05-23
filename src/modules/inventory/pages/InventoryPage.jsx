import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryFilters from "../components/CategoryFilters";
import InventoryTable from "../components/InventoryTable";
import MovementModal from "../components/MovementModal";
import MovementsHistoryModal from "../components/MovementsHistoryModal";
import { useInventory } from "../context/InventoryContext";
import AppLayout from "../../../shared/layout/AppLayout";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { materials } = useInventory();

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "Todos" || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [materials, search, activeCategory]);

  return (
    <AppLayout title="Inventario">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "10px" }}>Gestión de Inventario</h1>
          <p style={{ color: "#6f5d56" }}>
            Control de materias primas y materiales
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setIsHistoryOpen(true)}
            style={{
              textDecoration: "none",
              background: "#e8ded8",
              color: "#4b3a35",
              padding: "12px 16px",
              borderRadius: "12px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
            }}
          >
            Ver historial
          </button>
          <Link
            to="/nuevo-material"
            style={{
              textDecoration: "none",
              background: "#b1223a",
              color: "white",
              padding: "12px 16px",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            + Nuevo material
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <CategoryFilters
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>

      <InventoryTable items={filteredMaterials} onOpenModal={setSelectedMaterial} />
      {
        selectedMaterial && (
          <MovementModal
            material={selectedMaterial}
            onClose={() => setSelectedMaterial(null)}
          />
        )
      }
      {
        isHistoryOpen && (
          <MovementsHistoryModal
            onClose={() => setIsHistoryOpen(false)}
          />
        )
      }
    </AppLayout>
  );
}