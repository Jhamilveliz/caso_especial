"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial, EstadoMateria } from "@/lib/store"
import { mallas, Semestre, Materia } from "@/data/mallas"

/* =========================================================
   HELPERS
========================================================= */

function getSemestres(carreraId: string): Semestre[] {
    const mapaCarrera: Record<string, string> = {
        "Informática": "informatica_187_3",
        "Sistemas": "sistemas_187_4",
        "Redes": "redes_187_5",
        "Robótica": "robotica_323_0",
    }
    const key = mapaCarrera[carreraId]
    if (!key) return []
    const carrera = (mallas as any)[key]
    return carrera?.troncal ?? []
}

function getNombreCarrera(id: string): string {
    const map: Record<string, string> = {
        "Informática": "INGENIERÍA INFORMÁTICA",
        "Sistemas": "INGENIERÍA EN SISTEMAS",
        "Redes": "ING. EN REDES Y TELECOMUNICACIONES",
        "Robótica": "INGENIERÍA EN ROBÓTICA",
    }
    return map[id] ?? id
}

function getPlanCode(id: string): string {
    const map: Record<string, string> = {
        "Sistemas": "187-4", "Informática": "187-3",
        "Redes": "187-5", "Robótica": "323-0",
    }
    return map[id] ?? ""
}

const SEM_LABEL: Record<number, string> = {
    9: "9n", 8: "8v", 7: "7m", 6: "6to",
    5: "5to", 4: "4to", 3: "3ro", 2: "2d", 1: "1ro"
}

/* =========================================================
   COLORES CLÁSICOS
========================================================= */

type EstadoCfg = { label: string; bg: string; border: string; text: string }

const ESTADO_CFG: Record<EstadoMateria, EstadoCfg> = {
    pendiente: { label: "Pendiente", bg: "#ffffff", border: "#d1d5db", text: "#374151" },
    aprobada: { label: "Aprobada", bg: "#fde047", border: "#ca8a04", text: "#713f12" },
    inscrita: { label: "Inscrita", bg: "#86efac", border: "#16a34a", text: "#14532d" },
    caso: { label: "Caso Especial", bg: "#fca5a5", border: "#dc2626", text: "#7f1d1d" },
}

/* =========================================================
   MATERIA CARD
========================================================= */

function MateriaCard({
    mat, estado, grupo, onClick, onGrupoChange,
}: {
    mat: Materia
    estado: EstadoMateria
    grupo: string
    onClick: () => void
    onGrupoChange: (v: string) => void
}) {
    const cfg = ESTADO_CFG[estado]
    const esCaso = estado === "caso"

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <button
                onClick={onClick}
                style={{
                    width: "100%",
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 6,
                    padding: "7px 8px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "box-shadow 0.12s",
                    minHeight: 60,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.06)")}
            >
                <div style={{
                    fontWeight: 700, fontSize: 10,
                    color: cfg.text,
                    fontFamily: "'Courier New', monospace",
                    lineHeight: 1, marginBottom: 4,
                }}>
                    {mat.sigla}
                </div>
                <div style={{
                    fontSize: 8, color: cfg.text,
                    lineHeight: 1.3, opacity: 0.8,
                    fontFamily: "sans-serif",
                }}>
                    {mat.nombre}
                </div>
            </button>

            {/* Input grupo siempre visible si es caso especial */}
            {esCaso && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{
                        fontSize: 8, fontFamily: "sans-serif",
                        fontWeight: 600, color: "#dc2626", whiteSpace: "nowrap",
                    }}>
                        Grupo:
                    </span>
                    <input
                        type="text"
                        placeholder="Nº"
                        value={grupo}
                        onChange={e => onGrupoChange(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        style={{
                            flex: 1, fontSize: 9,
                            border: "1px solid #dc2626",
                            borderRadius: 4, padding: "2px 6px",
                            outline: "none", background: "#fff",
                            fontFamily: "sans-serif", color: "#7f1d1d", fontWeight: 600,
                        }}
                        onFocus={e => (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(220,38,38,0.2)")}
                        onBlur={e => (e.currentTarget.style.boxShadow = "none")}
                    />
                </div>
            )}
        </div>
    )
}

/* =========================================================
   MAIN
========================================================= */

export default function MallaPage() {
    const router = useRouter()
    const { datos, estadoMaterias, gruposMaterias, setEstadoMateria, setGrupoMateria } = useCasoEspecial()
    const [error, setError] = useState("")
    const [modoActivo, setModoActivo] = useState<EstadoMateria>("caso")

    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    const semestres = getSemestres(datos.carrera)
    const casoCount = Object.values(estadoMaterias).filter(e => e === "caso").length
    const semestresOrdenados = [...semestres].sort((a, b) => b.semestre - a.semestre)
    const maxMaterias = Math.max(...semestres.map(s => s.materias.length), 1)

    const getEstado = (sigla: string): EstadoMateria => estadoMaterias[sigla] ?? "pendiente"

    const handleClick = (sigla: string) => {
        setError("")
        const actual = estadoMaterias[sigla]
        setEstadoMateria(sigla, actual === modoActivo ? "pendiente" : modoActivo)
    }

    const handleContinuar = () => {
        if (casoCount === 0) { setError("Marcá al menos 1 materia como Caso Especial."); return }
        const casoSiglas = Object.entries(estadoMaterias).filter(([, e]) => e === "caso").map(([s]) => s)
        const sinGrupo = casoSiglas.filter(s => !gruposMaterias[s]?.trim())
        if (sinGrupo.length > 0 && !confirm(`Materias sin grupo: ${sinGrupo.join(", ")}. ¿Continuar?`)) return
        router.push("/carta")
    }

    if (semestres.length === 0) {
        return (
            <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 360, textAlign: "center", border: "1px solid #e5e7eb" }}>
                    <h2 style={{ fontWeight: 700, color: "#dc2626", marginBottom: 8, fontFamily: "sans-serif" }}>Malla no encontrada</h2>
                    <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14, fontFamily: "sans-serif" }}>Carrera: <strong>{datos.carrera}</strong></p>
                    <button onClick={() => router.push("/datos")}
                        style={{ background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
                        Volver a Datos
                    </button>
                </div>
            </div>
        )
    }

    return (
        /* Fondo gris igual al resto de páginas */
        <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "32px 16px", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>

                {/* ── BADGE + TÍTULO ── igual a las otras páginas */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{
                        display: "inline-block",
                        background: "#1d4ed8", color: "#fff",
                        fontSize: 11, fontWeight: 700,
                        padding: "4px 10px", borderRadius: 6,
                        letterSpacing: 0.5, marginBottom: 10,
                    }}>
                        FICCT — U.A.G.R.M.
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 4px 0", lineHeight: 1.2 }}>
                        Seleccioná tu <span style={{ color: "#dc2626" }}>Malla</span>
                    </h1>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                        Paso 2 de 4 — Marcá tus materias según su estado
                    </p>
                </div>

                {/* ── BARRA DE PROGRESO ── igual a las otras páginas */}
                <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
                    {["Datos", "Malla", "Carta", "Descarga"].map((step, i) => {
                        const done = i < 1
                        const active = i === 1
                        return (
                            <div key={step} style={{ flex: 1, textAlign: "center" }}>
                                <div style={{
                                    height: 3, borderRadius: 2,
                                    background: done || active ? "#dc2626" : "#e5e7eb",
                                    marginBottom: 6,
                                }} />
                                <span style={{
                                    fontSize: 12, fontWeight: active ? 700 : 400,
                                    color: active ? "#dc2626" : done ? "#374151" : "#9ca3af",
                                }}>
                                    {step}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* ── CARD PRINCIPAL ── */}
                <div style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                    marginBottom: 16,
                }}>
                    {/* Cabecera de la card con info de carrera */}
                    <div style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        flexWrap: "wrap", gap: 10,
                    }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                                Malla Curricular · Plan {getPlanCode(datos.carrera)}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                                {getNombreCarrera(datos.carrera)}
                            </div>
                        </div>

                        {/* Selector de modo */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginRight: 2 }}>Marcar:</span>
                            {(["caso", "inscrita", "aprobada", "pendiente"] as EstadoMateria[]).map(m => {
                                const cfg = ESTADO_CFG[m]
                                const active = modoActivo === m
                                return (
                                    <button
                                        key={m}
                                        onClick={() => setModoActivo(m)}
                                        title={cfg.label}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 5,
                                            padding: "4px 10px", borderRadius: 20,
                                            border: `1.5px solid ${active ? cfg.border : "#e5e7eb"}`,
                                            background: active ? cfg.bg : "#f9fafb",
                                            cursor: "pointer", fontSize: 10,
                                            fontWeight: active ? 700 : 500,
                                            color: active ? cfg.text : "#9ca3af",
                                            transition: "all 0.12s",
                                            fontFamily: "sans-serif",
                                        }}
                                    >
                                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.border, flexShrink: 0 }} />
                                        {cfg.label}
                                    </button>
                                )
                            })}
                            {/* Contador casos */}
                            <div style={{
                                marginLeft: 6,
                                background: casoCount > 0 ? "#fca5a5" : "#f3f4f6",
                                border: `1px solid ${casoCount > 0 ? "#dc2626" : "#e5e7eb"}`,
                                borderRadius: 20, padding: "4px 12px",
                                fontSize: 11, color: casoCount > 0 ? "#7f1d1d" : "#9ca3af",
                                fontWeight: 700,
                            }}>
                                {casoCount} caso{casoCount !== 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            margin: "12px 20px 0",
                            background: "#fef2f2", border: "1px solid #fca5a5",
                            color: "#dc2626", borderRadius: 8,
                            padding: "8px 14px", fontSize: 13, fontWeight: 600,
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* GRL001 */}
                    <div style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex", justifyContent: "center",
                        background: "#f9fafb",
                    }}>
                        <div style={{
                            background: "#fff", border: "1px solid #d1d5db",
                            borderRadius: 6, padding: "4px 16px",
                            fontSize: 11, fontWeight: 700, color: "#374151",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}>
                            GRL001 — Modal. de Titulación
                        </div>
                    </div>

                    {/* MALLA */}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: maxMaterias * 110 + 60 }}>
                            <tbody>
                                {semestresOrdenados.map((sem, semIdx) => {
                                    const isLast = semIdx === semestresOrdenados.length - 1
                                    return (
                                        <tr key={sem.semestre} style={{ borderBottom: isLast ? "none" : "1px solid #f3f4f6" }}>
                                            {/* Etiqueta semestre */}
                                            <td style={{
                                                width: 52, minWidth: 52,
                                                background: "#f9fafb",
                                                borderRight: "1px solid #e5e7eb",
                                                textAlign: "center",
                                                verticalAlign: "middle",
                                                padding: "10px 4px",
                                            }}>
                                                <div style={{ fontSize: 13, fontWeight: 800, color: "#1d4ed8" }}>
                                                    {SEM_LABEL[sem.semestre] ?? sem.semestre}
                                                </div>
                                                <div style={{ fontSize: 7, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>
                                                    Sem
                                                </div>
                                            </td>

                                            {/* Materias */}
                                            {Array.from({ length: maxMaterias }).map((_, idx) => {
                                                const mat = sem.materias[idx]
                                                return (
                                                    <td
                                                        key={idx}
                                                        style={{
                                                            padding: "8px 6px",
                                                            verticalAlign: "top",
                                                            borderRight: idx < maxMaterias - 1 ? "1px solid #f3f4f6" : "none",
                                                        }}
                                                    >
                                                        {mat ? (
                                                            <MateriaCard
                                                                mat={mat}
                                                                estado={getEstado(mat.sigla)}
                                                                grupo={gruposMaterias[mat.sigla] ?? ""}
                                                                onClick={() => handleClick(mat.sigla)}
                                                                onGrupoChange={v => setGrupoMateria(mat.sigla, v)}
                                                            />
                                                        ) : null}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── LEYENDA ── */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 18,
                    marginBottom: 16, flexWrap: "wrap",
                    padding: "10px 16px",
                    background: "#fff", borderRadius: 8,
                    border: "1px solid #e5e7eb",
                }}>
                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Referencia:</span>
                    {(["aprobada", "inscrita", "caso", "pendiente"] as EstadoMateria[]).map(m => {
                        const cfg = ESTADO_CFG[m]
                        return (
                            <div key={m} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{
                                    width: 14, height: 14, borderRadius: 3,
                                    background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                                    flexShrink: 0,
                                }} />
                                <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>
                                    {cfg.label}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* ── BOTONES ── igual estilo al resto de páginas */}
                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={() => router.push("/datos")}
                        style={{
                            flex: 1, padding: "14px 0", borderRadius: 8,
                            background: "#fff", border: "1px solid #d1d5db",
                            color: "#374151", fontWeight: 600, fontSize: 14,
                            cursor: "pointer", fontFamily: "sans-serif",
                        }}
                    >
                        ← Volver a Datos
                    </button>
                    <button
                        onClick={handleContinuar}
                        style={{
                            flex: 2, padding: "14px 0", borderRadius: 8,
                            background: "#1d4ed8",
                            border: "none", color: "#fff",
                            fontWeight: 700, fontSize: 14, cursor: "pointer",
                            fontFamily: "sans-serif",
                            letterSpacing: 0.2,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#1e40af")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#1d4ed8")}
                    >
                        Continuar — Ver Carta →
                    </button>
                </div>

                {/* Footer igual al de datos */}
                <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
                    🔒 Tus datos solo se usan para generar la carta — nada se envía a ningún servidor.
                </p>
            </div>
        </div>
    )
}