"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial, EstadoMateria } from "@/lib/store"
import { mallas } from "@/data/mallas"

/* =========================
   CONFIG
========================= */

const MAX_CASO = 2

const CARRERA_INFO: Record<string, { director: string; nombreCorto: string }> = {
    sistemas_187_4: { director: "Msc. Leonardo Vargas Peña", nombreCorto: "Ing. en Sistemas" },
    informatica_187_3: { director: "Msc. José Junior Villagómez Melgar", nombreCorto: "Ing. Informática" },
    redes_187_5: { director: "Msc. Jorge Marcelo Rosales Fuentes", nombreCorto: "Ing. en Redes y Telecomunicaciones" },
    robotica_323_0: { director: "Ing. Junior", nombreCorto: "Ing. Robótica" },
    informatica_menciones: { director: "Msc. José Junior Villagómez Melgar", nombreCorto: "Ing. Informática con Menciones" },
}

const ESTADO_CONFIG: Record<EstadoMateria, { label: string; emoji: string; bg: string; border: string; text: string }> = {
    pendiente: { label: "Pendiente", emoji: "⚪", bg: "bg-zinc-800", border: "border-zinc-700", text: "text-zinc-400" },
    inscrita: { label: "Inscrita", emoji: "🟢", bg: "bg-green-900/60", border: "border-green-600", text: "text-green-300" },
    caso: { label: "Caso Especial", emoji: "🔴", bg: "bg-red-900/60", border: "border-red-500", text: "text-red-300" },
}

/* =========================
   COMPONENTE
========================= */

export default function MallaPage() {
    const router = useRouter()
    const { datos, estadoMaterias, gruposMaterias, setEstadoMateria, setGrupoMateria } = useCasoEspecial()

    const [error, setError] = useState("")
    const [modoActivo, setModoActivo] = useState<EstadoMateria>("caso")

    // Si no llenaron datos, redirigir
    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    // Obtener la malla según la carrera seleccionada
    const mallaCarrera = (mallas as any)[datos.carrera]
    const semestres = mallaCarrera
        ? (mallaCarrera.troncal ?? mallaCarrera)
        : []

    // Semestres en orden normal (1 → 9) — mostrar de abajo hacia arriba con CSS
    const semestresOrdenados = [...semestres]

    // Contadores
    const casoCount = Object.values(estadoMaterias).filter(e => e === "caso").length

    const handleClick = (sigla: string) => {
        setError("")
        const actual = estadoMaterias[sigla] ?? "pendiente"

        if (modoActivo === "caso") {
            if (actual === "caso") {
                // deseleccionar
                setEstadoMateria(sigla, "pendiente")
            } else {
                if (casoCount >= MAX_CASO) {
                    setError(`Solo podés marcar máximo ${MAX_CASO} materias como Caso Especial.`)
                    return
                }
                setEstadoMateria(sigla, "caso")
            }
        } else {
            if (actual === modoActivo) {
                setEstadoMateria(sigla, "pendiente")
            } else {
                setEstadoMateria(sigla, modoActivo)
            }
        }
    }

    const handleContinuar = () => {
        if (casoCount === 0) {
            setError("Marcá al menos 1 materia como Caso Especial.")
            return
        }
        // Validar grupos para materias de caso especial
        const casoSiglas = Object.entries(estadoMaterias)
            .filter(([, e]) => e === "caso")
            .map(([s]) => s)

        const sinGrupo = casoSiglas.filter(s => !gruposMaterias[s]?.trim())
        if (sinGrupo.length > 0) {
            setError(`Falta el GRUPO en: ${sinGrupo.join(", ")}`)
            return
        }
        router.push("/carta")
    }

    const getEstado = (sigla: string): EstadoMateria =>
        estadoMaterias[sigla] ?? "pendiente"

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black text-white p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6 border-t-4 border-yellow-400 pt-5">
                    <p className="text-xs font-bold text-yellow-400 tracking-[0.3em] uppercase mb-1">
                        FICCT — U.A.G.R.M.
                    </p>
                    <h1 className="text-2xl font-black text-white">
                        Malla Curricular —{" "}
                        <span className="text-yellow-400">
                            {CARRERA_INFO[datos.carrera]?.nombreCorto ?? datos.carrera}
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Paso 2 de 4 — Marcá las materias que querés inscribir por caso especial
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex gap-2 mb-6">
                    {["Datos", "Malla", "Carta", "Descarga"].map((paso, i) => (
                        <div key={paso} className="flex-1 text-center">
                            <div className={`h-1.5 rounded-full mb-1 ${i <= 1 ? "bg-yellow-400" : "bg-zinc-700"}`} />
                            <span className={`text-xs ${i <= 1 ? "text-yellow-400 font-semibold" : "text-zinc-600"}`}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Panel superior: modo + contador */}
                <div className="flex flex-wrap items-center gap-3 mb-5 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">

                    <span className="text-sm text-zinc-400 font-semibold mr-2">Modo activo:</span>

                    {(["inscrita", "caso", "pendiente"] as EstadoMateria[]).map(modo => {
                        const cfg = ESTADO_CONFIG[modo]
                        return (
                            <button
                                key={modo}
                                onClick={() => setModoActivo(modo)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition
                                    ${modoActivo === modo
                                        ? `${cfg.bg} ${cfg.border} ${cfg.text} ring-2 ring-yellow-400`
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                                    }`}
                            >
                                {cfg.emoji} {cfg.label}
                            </button>
                        )
                    })}

                    <div className="ml-auto flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-lg font-black text-sm border ${casoCount >= MAX_CASO ? "bg-red-900/60 border-red-500 text-red-300" : "bg-zinc-800 border-zinc-700 text-zinc-300"}`}>
                            Caso especial: {casoCount}/{MAX_CASO}
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 bg-red-900/50 border border-red-500 text-red-300 rounded-xl px-5 py-3 text-sm font-semibold">
                        ⚠️ {error}
                    </div>
                )}

                {/* Semestres — de abajo hacia arriba */}
                <div className="flex flex-col-reverse gap-4 mb-8">
                    {semestresOrdenados.map((sem: any) => (
                        <div key={sem.semestre} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">

                            {/* Header del semestre */}
                            <div className="px-5 py-2 bg-zinc-800 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-yellow-400 text-black font-black text-xs flex items-center justify-center flex-shrink-0">
                                    {sem.semestre}
                                </span>
                                <span className="text-sm font-bold text-zinc-300">
                                    {sem.semestre === 1
                                        ? "🎓 Primer Semestre"
                                        : sem.semestre === 9
                                            ? "🏆 Noveno Semestre"
                                            : `Semestre ${sem.semestre}`}
                                </span>
                                <span className="ml-auto text-xs text-zinc-600">
                                    {sem.materias.length} materias
                                </span>
                            </div>

                            {/* Grilla de materias */}
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {sem.materias.map((mat: any) => {
                                    const estado = getEstado(mat.sigla)
                                    const cfg = ESTADO_CONFIG[estado]
                                    const esCaso = estado === "caso"

                                    return (
                                        <div
                                            key={mat.sigla}
                                            className={`rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-150`}
                                        >
                                            {/* Materia clickeable */}
                                            <button
                                                onClick={() => handleClick(mat.sigla)}
                                                className={`w-full text-left px-3 py-2.5 rounded-t-xl ${esCaso ? "" : "rounded-xl"}`}
                                            >
                                                <div className={`text-xs font-bold tracking-widest ${cfg.text} mb-0.5`}>
                                                    {mat.sigla}
                                                </div>
                                                <div className="text-sm text-white font-medium leading-tight">
                                                    {mat.nombre}
                                                </div>
                                                <div className={`text-xs mt-1 ${cfg.text}`}>
                                                    {cfg.emoji} {cfg.label}
                                                </div>
                                            </button>

                                            {/* Input de grupo — solo si es caso especial */}
                                            {esCaso && (
                                                <div className="px-3 pb-3 pt-1 border-t border-red-800">
                                                    <input
                                                        type="text"
                                                        placeholder="Grupo (ej: SD, A, SX)"
                                                        value={gruposMaterias[mat.sigla] ?? ""}
                                                        onChange={e => setGrupoMateria(mat.sigla, e.target.value)}
                                                        onClick={e => e.stopPropagation()}
                                                        className="w-full text-xs bg-zinc-900 border border-red-600 text-white rounded px-2 py-1.5 focus:outline-none focus:border-yellow-400 placeholder-zinc-600"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Leyenda */}
                <div className="flex flex-wrap gap-4 text-xs text-zinc-500 mb-6">
                    {Object.entries(ESTADO_CONFIG).map(([k, cfg]) => (
                        <span key={k} className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full border ${cfg.border} inline-block`} />
                            {cfg.emoji} {cfg.label}
                        </span>
                    ))}
                    <span className="ml-auto">Hacé clic en una materia para cambiarle el estado</span>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push("/datos")}
                        className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold border border-zinc-700 transition"
                    >
                        ← Volver a Datos
                    </button>
                    <button
                        onClick={handleContinuar}
                        className="flex-1 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-400/20"
                    >
                        Continuar → Ver Carta
                    </button>
                </div>

            </div>
        </div>
    )
}