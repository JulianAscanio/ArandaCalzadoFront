import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../../shared/layout/AppLayout";
import { useInventory } from "../context/InventoryContext";

function toDateInputValue(value) {
  const fallback = new Date().toISOString().split("T")[0];

  if (!value || typeof value !== "string") return fallback;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  const match = value
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})$/i);

  if (match) {
    const [, dayRaw, monthRaw, year] = match;
    const monthMap = {
      ene: "01",
      enero: "01",
      feb: "02",
      febrero: "02",
      mar: "03",
      marzo: "03",
      abr: "04",
      abril: "04",
      may: "05",
      mayo: "05",
      jun: "06",
      junio: "06",
      jul: "07",
      julio: "07",
      ago: "08",
      agosto: "08",
      sep: "09",
      sept: "09",
      septiembre: "09",
      oct: "10",
      octubre: "10",
      nov: "11",
      noviembre: "11",
      dic: "12",
      diciembre: "12",
    };

    const month = monthMap[monthRaw];
    if (month) {
      const day = dayRaw.padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }

  return fallback;
}

export default function NewMaterialPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { materials, addMaterial, updateMaterial } = useInventory();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    stock: "",
    minStock: "",
    maxStock: "",
    lastEntry: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isEditMode) {
      const materialToEdit = materials.find(
        (item) => String(item.id) === String(id)
      );

      if (materialToEdit) {
        setForm({
          name: materialToEdit.name || "",
          unit: materialToEdit.unit || "",
          category: materialToEdit.category || "",
          stock: materialToEdit.stock ?? "",
          minStock: materialToEdit.minStock ?? "",
          maxStock: materialToEdit.maxStock ?? "",
          lastEntry: toDateInputValue(materialToEdit.lastEntry),
        });
      }
    }
  }, [id, isEditMode, materials]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.name.trim() === "" ||
      form.unit.trim() === "" ||
      form.category.trim() === "" ||
      form.stock === "" ||
      form.minStock === "" ||
      form.maxStock === "" ||
      form.lastEntry === ""
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const payload = {
      name: form.name,
      unit: form.unit,
      category: form.category,
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      maxStock: Number(form.maxStock),
      lastEntry: form.lastEntry
    };

    try {
      if (isEditMode) {
        await updateMaterial(id, payload);
        alert("Material actualizado correctamente");
      } else {
        await addMaterial(payload);
        alert("Material registrado correctamente");
      }

      navigate("/inventario");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el material");
    }
  };

  return (
    <AppLayout title={isEditMode ? "Editar material" : "Nuevo material"}>
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
            {isEditMode ? "Editar material" : "Registrar nuevo material"}
          </h1>
          <p style={{ color: "#6f5d56", marginBottom: "24px" }}>
            {isEditMode
              ? "Actualiza la información del material"
              : "Agrega un nuevo material al inventario"}
          </p>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Nombre del material</label>
            <input
              style={inputStyle}
              type="text"
              name="name"
              placeholder="Ej: Cuero vegano negro"
              value={form.name}
              onChange={handleChange}
            />

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Unidad de medida</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="unit"
                  placeholder="Ej: dm², pares, litros"
                  value={form.unit}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={labelStyle}>Categoría</label>
                <select
                  style={inputStyle}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Seleccione una categoría
                  </option>
                  <option value="Cuero">Cuero</option>
                  <option value="Suelas">Suelas</option>
                  <option value="Adhesivos">Adhesivos</option>
                  <option value="Plantillas">Plantillas</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Stock inicial</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={labelStyle}>Stock mínimo</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  name="minStock"
                  value={form.minStock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Stock máximo</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  name="maxStock"
                  value={form.maxStock}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={labelStyle}>Fecha de ingreso</label>
                <input
                  style={inputStyle}
                  type="date"
                  name="lastEntry"
                  value={form.lastEntry}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={actionsStyle}>
              <button type="submit" style={saveButtonStyle}>
                {isEditMode ? "Actualizar material" : "Guardar material"}
              </button>

              <button
                type="button"
                style={cancelButtonStyle}
                onClick={() => navigate("/inventario")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

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

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
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
