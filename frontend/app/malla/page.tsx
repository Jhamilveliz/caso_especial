"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial, EstadoMateria } from "@/lib/store"
import { mallas, Semestre, Materia } from "@/data/mallas"

/* =========================
   CONFIG
========================= */

const ESTADO_CONFIG: Record<EstadoMateria, { label: string; emoji: string; bg: string; border: string; text: string }> = {
    pendiente: { label: "Pendiente", emoji: "⚪", bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-400" },
    aprobada: { label: "Aprobada", emoji: "🟡", bg: "bg-yellow-50", border: "border-yellow-400", text: "text-yellow-700" },
    inscrita: { label: "Inscrita", emoji: "🟢", bg: "bg-green-50", border: "border-green-400", text: "text-green-700" },
    caso: { label: "Caso Especial", emoji: "🔴", bg: "bg-red-50", border: "border-red-400", text: "text-red-700" },
}

/* =========================
   HELPER: obtener semestres
========================= */

function getSemestres(carreraId: string): { semestres: Semestre[] } {
    const mapaCarrera: Record<string, string> = {
        "Informática": "informatica_187_3",
        "Sistemas": "sistemas_187_4",
        "Redes": "redes_187_5",
        "Robótica": "robotica_323_0",
    }

    const key = mapaCarrera[carreraId]
    if (!key) return { semestres: [] }

    const carrera = (mallas as any)[key]
    if (!carrera) return { semestres: [] }

    const troncal: Semestre[] = carrera.troncal ?? []
    return { semestres: troncal }
}

/* =========================
   MAPA DE NOMBRE CARRERA
========================= */

function getNombreCarrera(carreraId: string): string {
    const nombres: Record<string, string> = {
        "Informática": "Ing. Informática",
        "Sistemas": "Ing. en Sistemas",
        "Redes": "Ing. en Redes y Telecomunicaciones",
        "Robótica": "Ing. en Robótica",
    }
    return nombres[carreraId] ?? carreraId
}

/* =========================
   COMPONENTE
========================= */

export default function MallaPage() {
    const router = useRouter()
    const { datos, estadoMaterias, gruposMaterias, setEstadoMateria, setGrupoMateria } = useCasoEspecial()

    const [error, setError] = useState("")
    const [modoActivo, setModoActivo] = useState<EstadoMateria>("caso")

    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    const { semestres } = getSemestres(datos.carrera)
    const casoCount = Object.values(estadoMaterias).filter(e => e === "caso").length

    const handleClick = (sigla: string) => {
        setError("")
        const actual = estadoMaterias[sigla]

        if (modoActivo === "caso") {
            if (actual === "caso") {
                // Si ya es caso, lo quitamos
                setEstadoMateria(sigla, "pendiente")
            } else {
                // Sin límite
                setEstadoMateria(sigla, "caso")
            }
        } else {
            // Para aprobada e inscrita: toggle simple
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

        // OPCIÓN 1: QUITAR LA VALIDACIÓN DE GRUPO (comentar estas líneas)
        /*
        const casoSiglas = Object.entries(estadoMaterias)
            .filter(([, e]) => e === "caso")
            .map(([s]) => s)
        const sinGrupo = casoSiglas.filter(s => !gruposMaterias[s]?.trim())
        if (sinGrupo.length > 0) {
            setError(`Falta el GRUPO en: ${sinGrupo.join(", ")}`)
            return
        }
        */

        // OPCIÓN 2: HACER EL GRUPO OPCIONAL - solo advertencia pero permite continuar
        const casoSiglas = Object.entries(estadoMaterias)
            .filter(([, e]) => e === "caso")
            .map(([s]) => s)
        const sinGrupo = casoSiglas.filter(s => !gruposMaterias[s]?.trim())
        if (sinGrupo.length > 0) {
            // Solo mostramos una advertencia pero permitimos continuar
            if (!confirm(`¿Estás seguro? Las siguientes materias no tienen grupo: ${sinGrupo.join(", ")}. ¿Continuar de todas formas?`)) {
                return
            }
        }

        router.push("/carta")
    }

    const getEstado = (sigla: string): EstadoMateria =>
        estadoMaterias[sigla] ?? "pendiente"

    // Si no hay semestres, mostrar mensaje de error
    if (semestres.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-red-50 border border-red-400 text-red-700 rounded-lg p-8 text-center">
                        <h2 className="text-xl font-bold mb-2">Error: Malla no encontrada</h2>
                        <p className="mb-4">No se encontró la malla para la carrera: {datos.carrera}</p>
                        <button
                            onClick={() => router.push("/datos")}
                            className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded"
                        >
                            Volver a Datos
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded mb-3 tracking-widest uppercase">
                        FICCT — U.A.G.R.M.
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Malla Curricular —{" "}
                        <span className="text-red-700">
                            {getNombreCarrera(datos.carrera)}
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Paso 2 de 4 — Marcá las materias que querés inscribir por caso especial
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex gap-2 mb-6">
                    {["Datos", "Malla", "Carta", "Descarga"].map((paso, i) => (
                        <div key={paso} className="flex-1">
                            <div className={`h-1 rounded-full mb-1 ${i <= 1 ? "bg-red-600" : "bg-gray-200"}`} />
                            <span className={`text-xs font-medium ${i <= 1 ? "text-red-600" : "text-gray-400"}`}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Panel modo + contador */}
                <div className="flex flex-wrap items-center gap-3 mb-5 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500 font-semibold mr-1">Modo:</span>

                    {(["aprobada", "inscrita", "caso"] as EstadoMateria[]).map(modo => {
                        const cfg = ESTADO_CONFIG[modo]
                        return (
                            <button
                                key={modo}
                                onClick={() => setModoActivo(modo)}
                                className={`px-3 py-1.5 rounded-md text-sm font-semibold border transition
                                    ${modoActivo === modo
                                        ? `${cfg.bg} ${cfg.border} ${cfg.text} ring-2 ring-offset-1 ring-blue-700`
                                        : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                                    }`}
                            >
                                {cfg.emoji} {cfg.label}
                            </button>
                        )
                    })}

                    <div className="ml-auto px-3 py-1.5 rounded-md font-bold text-sm border bg-gray-50 border-gray-300 text-gray-600">
                        Casos especiales: {casoCount}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-400 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
                        ⚠️ {error}
                    </div>
                )}

                {/* Semestres */}
                <div className="flex flex-col-reverse gap-4 mb-8">
                    {semestres.map((sem) => {
                        return (
                            <div key={sem.semestre} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Header semestre */}
                                <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-blue-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                                        {sem.semestre}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-700">
                                        {sem.semestre === 1 ? "Primer Semestre" :
                                            sem.semestre === 9 ? "Noveno Semestre" :
                                                `Semestre ${sem.semestre}`}
                                    </span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {sem.materias.length} materia{sem.materias.length !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* Grilla de materias */}
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {sem.materias.map((mat) => {
                                        const estado = getEstado(mat.sigla)
                                        const cfg = ESTADO_CONFIG[estado]
                                        const esCaso = estado === "caso"
                                        const estaMarcada = estado !== "pendiente"

                                        return (
                                            <div
                                                key={mat.sigla}
                                                className={`rounded-lg border ${cfg.border} ${cfg.bg} transition-all duration-150`}
                                            >
                                                <button
                                                    onClick={() => handleClick(mat.sigla)}
                                                    className={`w-full text-left px-3 py-2.5 ${esCaso ? "rounded-t-lg" : "rounded-lg"}`}
                                                >
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <span className="text-xs font-bold tracking-wider text-gray-400">
                                                            {mat.sigla}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-800 font-medium leading-snug">
                                                        {mat.nombre}
                                                    </div>
                                                    {estaMarcada ? (
                                                        <div className={`text-xs mt-1 ${cfg.text}`}>
                                                            {cfg.emoji} {cfg.label}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs mt-1 text-gray-300">
                                                            ⚪ Sin marcar
                                                        </div>
                                                    )}
                                                </button>

                                                {/* Input grupo — solo caso especial (ahora opcional) */}
                                                {esCaso && (
                                                    <div className="px-3 pb-3 pt-1.5 border-t border-red-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Grupo (opcional)"
                                                            value={gruposMaterias[mat.sigla] ?? ""}
                                                            onChange={e => setGrupoMateria(mat.sigla, e.target.value)}
                                                            onClick={e => e.stopPropagation()}
                                                            className="w-full text-xs bg-white border border-red-300 text-gray-800 rounded px-2 py-1.5 focus:outline-none focus:border-blue-700 placeholder-gray-400"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Leyenda */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6 items-center">
                    {Object.entries(ESTADO_CONFIG).map(([k, cfg]) => (
                        <span key={k} className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full border ${cfg.border} inline-block`} />
                            {cfg.label}
                        </span>
                    ))}
                    <span className="ml-auto text-gray-400">Hacé clic para marcar/desmarcar</span>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push("/datos")}
                        className="flex-1 py-2.5 rounded-md bg-white hover:bg-gray-50 text-gray-600 font-semibold border border-gray-300 transition text-sm"
                    >
                        ← Volver a Datos
                    </button>
                    <button
                        onClick={handleContinuar}
                        className="flex-1 py-3 rounded-md bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm transition-all"
                    >
                        Continuar → Ver Carta
                    </button>
                </div>

            </div>
        </div>
    )
}