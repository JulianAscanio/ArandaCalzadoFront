import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const passwordResetEndpoints = [
    "/api/password-reset/",
    "/api/auth/password-reset/",
    "/api/password/forgot/",
    "/api/forgot-password/",
];

function buildUrl(path) {
    if (!path.startsWith("/")) {
        return `${API_BASE_URL}/${path}`;
    }

    return `${API_BASE_URL}${path}`;
}

function getErrorMessageFromData(data) {
    if (!data) {
        return null;
    }

    if (typeof data === "string") {
        return data;
    }

    if (typeof data === "object") {
        const candidates = [data.detail, data.message, data.error, data.non_field_errors];

        for (const value of candidates) {
            if (!value) {
                continue;
            }

            if (Array.isArray(value) && value.length > 0) {
                return String(value[0]);
            }

            return String(value);
        }

        for (const key of Object.keys(data)) {
            const value = data[key];
            if (Array.isArray(value) && value.length > 0) {
                return `${key}: ${value[0]}`;
            }
            if (typeof value === "string") {
                return `${key}: ${value}`;
            }
        }
    }

    return null;
}

async function safeReadJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function tryKnownEndpoints({ endpoints, payload, fallbackError }) {
    for (const endpoint of endpoints) {
        let response;

        try {
            response = await fetch(buildUrl(endpoint), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch {
            throw new Error("No fue posible conectar con el servidor.");
        }

        if (response.status === 404) {
            continue;
        }

        if (!response.ok) {
            const data = await safeReadJson(response);
            throw new Error(getErrorMessageFromData(data) || fallbackError);
        }

        return safeReadJson(response);
    }

    throw new Error(
        "No se encontro un endpoint compatible para esta accion. Configura VITE_API_BASE_URL o revisa las rutas del backend."
    );
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("access_token"));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            localStorage.setItem("access_token", token);
        } else {
            localStorage.removeItem("access_token");
        }
    }, [token]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await fetch(buildUrl("/api/token/"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await safeReadJson(response);
                throw new Error(getErrorMessageFromData(data) || "Credenciales invalidas");
            }

            const data = await response.json();
            setToken(data.access);
            navigate("/inventario");
        } catch (error) {
            toast.error("Error en login:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const requestPasswordReset = async ({ email, username }) => {
        setLoading(true);
        try {
            return await tryKnownEndpoints({
                endpoints: passwordResetEndpoints,
                payload: { email, username },
                fallbackError: "No se pudo iniciar la recuperación de contraseña",
            });
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ token, login, requestPasswordReset, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
