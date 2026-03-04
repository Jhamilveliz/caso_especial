"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCasoEspecial } from "@/lib/store";

/* =========================
   DATOS ESTÁTICOS
========================= */
const CARRERAS = [
    { id: "Informática", label: "Ing. Informática" },
    { id: "Sistemas", label: "Ing. en Sistemas" },
    { id: "Redes", label: "Ing. en Redes y Telecomunicaciones" },
    { id: "Robótica", label: "Ing. Robótica" },
];

const getDirector = (carreraId: string): string => {
    switch (carreraId) {
        case "Sistemas":
            return "Msc. Leonardo Vargas Peña";
        case "Redes":
            return "Msc. Jorge Marcelo Rosales Fuentes";
        case "Informática":
        case "Robótica":
            return "Msc. José Junior Villagómez Melgar";
        default:
            return "";
    }
};

/* =========================
   HELPERS DE ESTILO
========================= */
const inputClass =
    "w-full bg-white border border-gray-300 text-gray-800 rounded-md px-4 py-2.5 " +
    "focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 " +
    "placeholder-gray-400 transition text-sm font-normal";

const labelClass =
    "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1";

const errorClass = "text-red-600 text-xs mt-1";

const PASOS = ["Datos", "Malla", "Carta", "Descarga"];

/* =========================
   COMPONENTE PRINCIPAL
========================= */
export default function DatosPage() {
    const router = useRouter();
    const { datos, setDatos } = useCasoEspecial();

    const [form, setForm] = useState({
        nombre: datos.nombre || "",
        carrera: datos.carrera || "Informática",
        ppa: datos.ppa || "",
        ci: datos.ci || "",
        registro: datos.registro || "",
        celular: datos.celular || "", // <-- AGREGADO
        gestion: datos.gestion || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ---- handlers ---- */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
        if (!form.registro.trim()) e.registro = "El registro es obligatorio";
        if (!form.ci.trim()) e.ci = "El carnet de identidad es obligatorio";
        // El celular es opcional, no lo validamos
        if (!form.ppa.trim()) e.ppa = "El PPA es obligatorio";
        else if (isNaN(Number(form.ppa)) || Number(form.ppa) < 0 || Number(form.ppa) > 100)
            e.ppa = "El PPA debe ser un número entre 0 y 100";
        if (!form.gestion.trim()) e.gestion = "La gestión es obligatoria";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setDatos({
            universidad: "Universidad Autónoma Gabriel René Moreno",
            nombre: form.nombre,
            carrera: form.carrera,
            director: getDirector(form.carrera),
            ppa: form.ppa,
            ci: form.ci,
            celular: form.celular, // <-- AHORA SE GUARDA EL VALOR DEL FORM
            registro: form.registro,
            gestion: form.gestion,
        });

        router.push("/malla");
    };

    /* ---- render ---- */
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">

                {/* ── Header ── */}
                <div className="mb-7">
                    <div className="inline-flex items-center gap-2 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded mb-3 tracking-widest uppercase">
                        FICCT — U.A.G.R.M.
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        Solicitud de{" "}
                        <span className="text-red-700">Caso Especial</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Paso 1 de 4 — Ingresá tus datos personales
                    </p>
                </div>

                {/* ── Indicador de pasos ── */}
                <div className="flex gap-2 mb-7">
                    {PASOS.map((paso, i) => (
                        <div key={paso} className="flex-1">
                            <div className={`h-1 rounded-full mb-1 ${i === 0 ? "bg-red-600" : "bg-gray-200"}`} />
                            <span className={`text-xs font-medium ${i === 0 ? "text-red-600" : "text-gray-400"}`}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── Formulario ── */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 bg-white rounded-xl p-7 border border-gray-200 shadow-sm"
                >

                    {/* Carrera */}
                    <div>
                        <label className={labelClass}>Carrera</label>
                        <select
                            name="carrera"
                            value={form.carrera}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            {CARRERAS.map((c) => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Director (solo lectura) */}
                    <div>
                        <label className={labelClass}>Director de carrera</label>
                        <input
                            readOnly
                            value={getDirector(form.carrera)}
                            className={`${inputClass} bg-gray-50 text-gray-500 cursor-default`}
                        />
                    </div>

                    {/* Nombre completo */}
                    <div>
                        <label className={labelClass}>Nombre y apellido</label>
                        <input
                            name="nombre"
                            placeholder="Ej: Juan Carlos Pérez Rojas"
                            value={form.nombre}
                            onChange={handleChange}
                            className={`${inputClass} ${errors.nombre ? "border-red-500 ring-1 ring-red-400" : ""}`}
                        />
                        {errors.nombre && <p className={errorClass}>⚠ {errors.nombre}</p>}
                    </div>

                    {/* Registro, CI y Celular - AHORA EN 3 COLUMNAS */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Registro universitario</label>
                            <input
                                name="registro"
                                placeholder="Ej: 219012345"
                                value={form.registro}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.registro ? "border-red-500 ring-1 ring-red-400" : ""}`}
                            />
                            {errors.registro && <p className={errorClass}>⚠ {errors.registro}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Número de carnet</label>
                            <input
                                name="ci"
                                placeholder="Ej: 12345678"
                                value={form.ci}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.ci ? "border-red-500 ring-1 ring-red-400" : ""}`}
                            />
                            {errors.ci && <p className={errorClass}>⚠ {errors.ci}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Celular</label>
                            <input
                                name="celular"
                                placeholder="Ej: 71234567"
                                value={form.celular}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.celular ? "border-red-500 ring-1 ring-red-400" : ""}`}
                            />
                            {errors.celular && <p className={errorClass}>⚠ {errors.celular}</p>}
                        </div>
                    </div>

                    {/* PPA y Gestión */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>PPA</label>
                            <input
                                name="ppa"
                                type="text"
                                inputMode="decimal"
                                placeholder="Ej: 62.50"
                                value={form.ppa}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.ppa ? "border-red-500 ring-1 ring-red-400" : ""}`}
                            />
                            {errors.ppa && <p className={errorClass}>⚠ {errors.ppa}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Gestión</label>
                            <input
                                name="gestion"
                                placeholder="Ej: 01/2026"
                                value={form.gestion}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.gestion ? "border-red-500 ring-1 ring-red-400" : ""}`}
                            />
                            {errors.gestion && <p className={errorClass}>⚠ {errors.gestion}</p>}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-1" />

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-blue-800 hover:bg-blue-900 active:scale-[0.99] text-white font-semibold py-3 rounded-md text-sm transition-all flex items-center justify-center gap-2"
                    >
                        Continuar — Seleccionar Materias
                        <span>→</span>
                    </button>
                </form>

                <p className="text-center text-gray-400 text-xs mt-4">
                    🔒 Tus datos solo se usan para generar la carta — nada se envía a ningún servidor.
                </p>
            </div>
        </div>
    );
}