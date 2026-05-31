import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../../shared/layout/AppLayout";
import { useProducts } from "../context/ProductsContext";
import { useInventory } from "../../inventory/context/InventoryContext";

export default function NewProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { products, addProduct, updateProduct } = useProducts();
  const { materials } = useInventory();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    reference: "",
    heel_height: "",
    price: "",
    material: "",
    available_stock: "0",
    description: "",
  });

  useEffect(() => {
    if (isEditMode && products.length > 0) {
      const productToEdit = products.find(
        (item) => String(item.id) === String(id)
      );

      if (productToEdit) {
        setForm({
          name: productToEdit.name || "",
          reference: productToEdit.reference || "",
          heel_height: productToEdit.heel_height || "",
          price: productToEdit.price || "",
          material: productToEdit.material || (productToEdit.material_detail?.id) || "",
          available_stock: String(productToEdit.available_stock ?? "0"),
          description: productToEdit.description || "",
        });
      }
    }
  }, [id, isEditMode, products]);

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
      form.reference.trim() === "" ||
      form.heel_height.trim() === "" ||
      form.price === "" ||
      form.available_stock === ""
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const payload = {
      name: form.name,
      reference: form.reference,
      heel_height: form.heel_height,
      price: Number(form.price),
      material: form.material ? Number(form.material) : null,
      available_stock: Number(form.available_stock),
      description: form.description,
    };

    try {
      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await addProduct(payload);
      }
      navigate("/productos");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppLayout title={isEditMode ? "Editar producto" : "Nuevo producto"}>
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
            {isEditMode ? "Editar producto" : "Registrar nuevo producto"}
          </h1>
          <p style={{ color: "#6f5d56", marginBottom: "24px" }}>
            {isEditMode
              ? "Actualiza la información técnica del calzado"
              : "Agrega un nuevo diseño de zapato al catálogo"}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Referencia del Calzado *</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="reference"
                  placeholder="Ej: REF 6504"
                  value={form.reference}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Nombre del Calzado *</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="name"
                  placeholder="Ej: Baletas destalonadas"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Altura del Tacón *</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="heel_height"
                  placeholder="Ej: 3.5 cm o Plano"
                  value={form.heel_height}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Precio de Venta *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  name="price"
                  placeholder="Ej: 150000"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Material Asociado (Opcional)</label>
                <select
                  style={inputStyle}
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                >
                  <option value="">Ninguno</option>
                  {materials?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category}) - Stock: {m.stock} {m.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Stock Inicial (Pares) *</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  name="available_stock"
                  value={form.available_stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label style={labelStyle}>Descripción y Colores Disponibles</label>
            <textarea
              style={{ ...inputStyle, height: "100px", fontFamily: "inherit", resize: "vertical" }}
              name="description"
              placeholder="Ej: Baletas destalonadas con lazo grande al frente (Negro, Palo de rosa, Marrón)..."
              value={form.description}
              onChange={handleChange}
            />

            <div style={actionsStyle}>
              <button type="submit" style={saveButtonStyle}>
                {isEditMode ? "Actualizar producto" : "Guardar producto"}
              </button>

              <button
                type="button"
                style={cancelButtonStyle}
                onClick={() => navigate("/productos")}
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
  color: "#2d1f20",
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
  fontWeight: "600",
};

const cancelButtonStyle = {
  border: "none",
  background: "#e8ded8",
  color: "#4b3a35",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
};
