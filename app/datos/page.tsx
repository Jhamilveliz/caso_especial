"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useCasoEspecial } from "@/lib/store";

/* =========================
   DATOS ESTÁTICOS
========================= */
const CARRERAS = [
    { id: "Informática", label: "Ing. Informática" },
    { id: "Informática 187-6", label: "Ing. Informática (Plan 187-6)" },
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
        case "Informática 187-6":
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
   VARIANTES MOTION
========================= */
const containerStagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.08 },
    },
};

const fieldUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
};

const shake = {
    shake: {
        x: [0, -6, 6, -5, 5, -3, 3, 0],
        transition: { duration: 0.4 },
    },
};

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
        celular: datos.celular || "",
        gestion: datos.gestion || "",
        motivo: (datos as any).motivo || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ---- handlers ---- */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        if (!form.ppa.trim()) e.ppa = "El PPA es obligatorio";
        else if (isNaN(Number(form.ppa)) || Number(form.ppa) < 0 || Number(form.ppa) > 100)
            e.ppa = "El PPA debe ser un número entre 0 y 100";
        if (!form.gestion.trim()) e.gestion = "El semestre es obligatorio";

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
            celular: form.celular,
            registro: form.registro,
            gestion: form.gestion,
            motivo: form.motivo,
        });

        router.push("/malla");
    };

    /* ---- render ---- */
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
            <motion.div
                variants={containerStagger}
                initial="hidden"
                animate="show"
                className="w-full max-w-2xl"
            >
                {/* ── Header ── */}
                <motion.div variants={fieldUp} className="mb-7">
                    <motion.div
                        variants={fieldUp}
                        className="inline-flex items-center gap-2 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded mb-3 tracking-widest uppercase"
                    >
                        FICCT — U.A.G.R.M.
                    </motion.div>
                    <motion.h1
                        variants={fieldUp}
                        className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
                    >
                        Solicitud de{" "}
                        <motion.span
                            className="text-red-700 inline-block"
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Caso Especial
                        </motion.span>
                    </motion.h1>
                    <motion.p variants={fieldUp} className="text-gray-500 text-sm mt-1">
                        Paso 1 de 4 — Ingresá tus datos personales
                    </motion.p>
                </motion.div>

                {/* ── Indicador de pasos ── */}
                <motion.div variants={fieldUp} className="flex gap-2 mb-7">
                    {PASOS.map((paso, i) => (
                        <div key={paso} className="flex-1 relative">
                            <motion.div
                                className={`h-1 rounded-full mb-1 ${i === 0 ? "" : "bg-gray-200"}`}
                                animate={i === 0
                                    ? { background: ["#dc2626", "#ef4444", "#dc2626"] }
                                    : {}}
                                transition={i === 0 ? { duration: 2, repeat: Infinity } : {}}
                            />
                            <span className={`text-xs font-medium ${i === 0 ? "text-red-600" : "text-gray-400"}`}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* ── Formulario ── */}
                <motion.form
                    variants={fieldUp}
                    onSubmit={handleSubmit}
                    className="space-y-5 bg-white rounded-xl p-4 sm:p-7 border border-gray-200 shadow-sm"
                >
                    {/* Carrera */}
                    <motion.div variants={fieldUp}>
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
                    </motion.div>

                    {/* Director (solo lectura) */}
                    <motion.div variants={fieldUp}>
                        <label className={labelClass}>Director de carrera</label>
                        <motion.input
                            readOnly
                            value={getDirector(form.carrera)}
                            className={`${inputClass} bg-gray-50 text-gray-500 cursor-default`}
                            // Re-anima el fade al cambiar director
                            key={form.carrera}
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                        />
                    </motion.div>

                    {/* Nombre completo */}
                    <motion.div variants={fieldUp}>
                        <label className={labelClass}>Nombre y apellido</label>
                        <motion.div animate={errors.nombre ? "shake" : undefined} variants={shake}>
                            <input
                                name="nombre"
                                placeholder="Ej: Juan Carlos Pérez Rojas"
                                value={form.nombre}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.nombre ? "border-red-500 ring-1 ring-red-400" : ""}`}
                            />
                        </motion.div>
                        <AnimatePresence mode="wait">
                            {errors.nombre && (
                                <motion.p
                                    key="err-nombre"
                                    className={errorClass}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >⚠ {errors.nombre}</motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Registro, CI y Celular */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <motion.div variants={fieldUp}>
                            <label className={labelClass}>Registro universitario</label>
                            <motion.div animate={errors.registro ? "shake" : undefined} variants={shake}>
                                <input
                                    name="registro"
                                    placeholder="Ej: 219012345"
                                    value={form.registro}
                                    onChange={handleChange}
                                    className={`${inputClass} ${errors.registro ? "border-red-500 ring-1 ring-red-400" : ""}`}
                                />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {errors.registro && (
                                    <motion.p
                                        key="err-registro"
                                        className={errorClass}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >⚠ {errors.registro}</motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <motion.div variants={fieldUp}>
                            <label className={labelClass}>Número de carnet</label>
                            <motion.div animate={errors.ci ? "shake" : undefined} variants={shake}>
                                <input
                                    name="ci"
                                    placeholder="Ej: 12345678"
                                    value={form.ci}
                                    onChange={handleChange}
                                    className={`${inputClass} ${errors.ci ? "border-red-500 ring-1 ring-red-400" : ""}`}
                                />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {errors.ci && (
                                    <motion.p
                                        key="err-ci"
                                        className={errorClass}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >⚠ {errors.ci}</motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <motion.div variants={fieldUp}>
                            <label className={labelClass}>Celular</label>
                            <input
                                name="celular"
                                placeholder="Ej: 71234567"
                                value={form.celular}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </motion.div>
                    </div>

                    {/* PPA y Semestre */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div variants={fieldUp}>
                            <label className={labelClass}>PPA</label>
                            <motion.div animate={errors.ppa ? "shake" : undefined} variants={shake}>
                                <input
                                    name="ppa"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="Ej: 62.50"
                                    value={form.ppa}
                                    onChange={handleChange}
                                    className={`${inputClass} ${errors.ppa ? "border-red-500 ring-1 ring-red-400" : ""}`}
                                />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {errors.ppa && (
                                    <motion.p
                                        key="err-ppa"
                                        className={errorClass}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >⚠ {errors.ppa}</motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        <motion.div variants={fieldUp}>
                            <label className={labelClass}>Semestre</label>
                            <motion.div animate={errors.gestion ? "shake" : undefined} variants={shake}>
                                <input
                                    name="gestion"
                                    placeholder="Ej: 1/2026"
                                    value={form.gestion}
                                    onChange={handleChange}
                                    className={`${inputClass} ${errors.gestion ? "border-red-500 ring-1 ring-red-400" : ""}`}
                                />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {errors.gestion && (
                                    <motion.p
                                        key="err-gestion"
                                        className={errorClass}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >⚠ {errors.gestion}</motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Motivo del caso especial (opcional) */}
                    <motion.div variants={fieldUp}>
                        <label className={labelClass}>Motivo del caso especial (opcional)</label>
                        <textarea
                            name="motivo"
                            rows={3}
                            placeholder="Ej: Necesito adelantar materias para nivelar mi avance curricular..."
                            value={form.motivo}
                            onChange={handleChange}
                            className={`${inputClass} resize-none`}
                        />
                    </motion.div>

                    <div className="border-t border-gray-100 pt-1" />

                    {/* Botón */}
                    <motion.button
                        type="submit"
                        variants={fieldUp}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 380, damping: 22 }}
                        className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-md text-sm flex items-center justify-center gap-2"
                    >
                        Continuar — Seleccionar Materias
                        <motion.span
                            aria-hidden
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        >→</motion.span>
                    </motion.button>
                </motion.form>

                <motion.p variants={fieldUp} className="text-center text-white text-xs mt-4">
                    🔒 Tus datos solo se usan para generar la carta — nada se envía a ningún servidor.
                </motion.p>
            </motion.div>
        </motion.div>
    );
}
