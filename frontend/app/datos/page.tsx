"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial, DatosPersonales } from "@/lib/store"

/* =========================
   OPCIONES DE CARRERA
========================= */

const CARRERAS = [
    { id: "sistemas_187_4", label: "Ingeniería en Sistemas (187-4)" },
    { id: "informatica_187_3", label: "Ingeniería Informática (187-3)" },
    { id: "redes_187_5", label: "Ingeniería en Redes y Telecomunicaciones (187-5)" },
    { id: "robotica_323_0", label: "Ingeniería en Robótica (323-0)" },
    { id: "informatica_menciones", label: "Ingeniería Informática con Menciones (188-0)" },
]

/* =========================
   HELPERS
========================= */

const inputClass =
    "w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 " +
    "focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 " +
    "placeholder-zinc-500 transition"

const labelClass = "block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1"

/* =========================
   COMPONENTE
========================= */

export default function DatosPage() {
    const router = useRouter()
    const { datos, setDatos } = useCasoEspecial()

    const [form, setForm] = useState<DatosPersonales>({ ...datos })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: "" })
    }

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
        if (!form.registro.trim()) newErrors.registro = "El registro es obligatorio"
        if (!form.ci.trim()) newErrors.ci = "El CI es obligatorio"
        if (!form.celular.trim()) newErrors.celular = "El celular es obligatorio"
        if (!form.ppa.trim()) newErrors.ppa = "El PPA es obligatorio"
        else if (isNaN(Number(form.ppa)) || Number(form.ppa) < 0 || Number(form.ppa) > 100)
            newErrors.ppa = "El PPA debe ser un número entre 0 y 100"
        if (!form.materiasInscritas.trim()) newErrors.materiasInscritas = "Indica cuántas materias tienes inscritas"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setDatos(form)
        router.push("/malla")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="mb-8 border-t-4 border-yellow-400 pt-5">
                    <p className="text-xs font-bold text-yellow-400 tracking-[0.3em] uppercase mb-1">
                        FICCT — U.A.G.R.M.
                    </p>
                    <h1 className="text-3xl font-black text-white">
                        Solicitud de{" "}
                        <span className="text-yellow-400">Caso Especial</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Paso 1 de 4 — Ingresá tus datos personales
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex gap-2 mb-8">
                    {["Datos", "Malla", "Carta", "Descarga"].map((paso, i) => (
                        <div key={paso} className="flex-1 text-center">
                            <div className={`h-1.5 rounded-full mb-1 ${i === 0 ? "bg-yellow-400" : "bg-zinc-700"}`} />
                            <span className={`text-xs ${i === 0 ? "text-yellow-400 font-semibold" : "text-zinc-600"}`}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-900 rounded-2xl p-7 border border-zinc-800">

                    {/* Universidad */}
                    <div>
                        <label className={labelClass}>Universidad</label>
                        <input
                            name="universidad"
                            value={form.universidad}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* Carrera */}
                    <div>
                        <label className={labelClass}>Carrera</label>
                        <select
                            name="carrera"
                            value={form.carrera}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            {CARRERAS.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className={labelClass}>Nombre completo</label>
                        <input
                            name="nombre"
                            placeholder="Ej: Juan Carlos Pérez Rojas"
                            value={form.nombre}
                            onChange={handleChange}
                            className={`${inputClass} ${errors.nombre ? "border-red-500" : ""}`}
                        />
                        {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    {/* Registro y CI en grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Registro universitario</label>
                            <input
                                name="registro"
                                placeholder="Ej: 219012345"
                                value={form.registro}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.registro ? "border-red-500" : ""}`}
                            />
                            {errors.registro && <p className="text-red-400 text-xs mt-1">{errors.registro}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>CI</label>
                            <input
                                name="ci"
                                placeholder="Ej: 12345678"
                                value={form.ci}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.ci ? "border-red-500" : ""}`}
                            />
                            {errors.ci && <p className="text-red-400 text-xs mt-1">{errors.ci}</p>}
                        </div>
                    </div>

                    {/* Celular y Gestión en grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Celular</label>
                            <input
                                name="celular"
                                placeholder="Ej: 70011223"
                                value={form.celular}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.celular ? "border-red-500" : ""}`}
                            />
                            {errors.celular && <p className="text-red-400 text-xs mt-1">{errors.celular}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Gestión</label>
                            <input
                                name="gestion"
                                placeholder="Ej: 01/2026"
                                value={form.gestion}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* PPA y Materias inscritas en grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                PPA <span className="text-yellow-400">(obligatorio)</span>
                            </label>
                            <input
                                name="ppa"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="Ej: 62.50"
                                value={form.ppa}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.ppa ? "border-red-500" : ""}`}
                            />
                            {errors.ppa && <p className="text-red-400 text-xs mt-1">{errors.ppa}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Materias inscritas normalmente</label>
                            <input
                                name="materiasInscritas"
                                type="number"
                                min="0"
                                placeholder="Ej: 4"
                                value={form.materiasInscritas}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.materiasInscritas ? "border-red-500" : ""}`}
                            />
                            {errors.materiasInscritas && <p className="text-red-400 text-xs mt-1">{errors.materiasInscritas}</p>}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full mt-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-400/20"
                    >
                        Continuar → Seleccionar Materias
                    </button>
                </form>

                <p className="text-center text-zinc-600 text-xs mt-4">
                    Tus datos solo se usan para generar la carta — nada se envía a ningún servidor.
                </p>
            </div>
        </div>
    )
}