import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../../shared/layout/AppLayout";
import { useProducts } from "../context/ProductsContext";
import { useInventory } from "../../inventory/context/InventoryContext";
import { Upload, X } from "lucide-react";
import { MdArrowBack as ArrowLeft } from "react-icons/md";

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (typeof imagePath === 'object' && imagePath.url) imagePath = imagePath.url;
  if (typeof imagePath !== 'string') return null;

  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${baseUrl.replace(/\/+$/, '')}/${cleanPath}`;
};

export default function NewProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

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
    image: null,
    imageFile: null,
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
          image: productToEdit.image || null,
          imageFile: null,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null, imageFile: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("reference", form.reference);
    formData.append("heel_height", form.heel_height);
    formData.append("price", form.price);
    if (form.material) {
      formData.append("material", form.material);
    } else {
      formData.append("material", "");
    }
    formData.append("available_stock", form.available_stock);
    formData.append("description", form.description || "");

    // Solo adjuntamos la imagen si el usuario subió un archivo nuevo o si eliminó la foto
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    } else if (form.image === null) {
      formData.append("image", "");
    }

    try {
      if (isEditMode) {
        await updateProduct(id, formData);
      } else {
        await addProduct(formData);
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
                {isEditMode ? "Editar producto" : "Registrar nuevo producto"}
              </h1>
              <p style={{ color: "#6f5d56", margin: 0 }}>
                {isEditMode
                  ? "Actualiza la información técnica del calzado"
                  : "Agrega un nuevo diseño de zapato al catálogo"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/productos")}
              style={{ ...cancelButtonStyle, display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px" }}
            >
              <ArrowLeft size={16} /> Volver
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Fotografía del Calzado (Opcional)</label>
              
              {!form.image ? (
                <div 
                  style={{
                    border: "2px dashed #d8ccc4",
                    borderRadius: "14px",
                    padding: "30px",
                    textAlign: "center",
                    background: "#fdfbfa",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "#b1223a"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "#d8ccc4"}
                >
                  <Upload size={32} color="#8b7b78" style={{ marginBottom: "10px" }} />
                  <p style={{ margin: 0, color: "#4b3a35", fontWeight: "500" }}>Haz clic para subir una foto</p>
                  <p style={{ margin: "4px 0 0", color: "#8b7b78", fontSize: "13px" }}>JPG, PNG o WEBP (Máx. 2MB recomendado)</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img 
                    src={getImageUrl(form.image)} 
                    alt="Preview" 
                    style={{ width: "160px", height: "160px", objectFit: "cover", borderRadius: "14px", border: "1px solid #e8ded8" }} 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "#b1223a",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

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
