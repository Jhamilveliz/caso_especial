"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import { useCasoEspecial, EstadoMateria } from "@/lib/store"
import { mallas, Semestre, Materia } from "@/data/mallas"
import { containerStagger, fadeUp } from "@/components/motion"

/* =========================================================
   HELPERS
========================================================= */

function getSemestres(carreraId: string): Semestre[] {
    const mapaCarrera: Record<string, string> = {
        "Informática": "informatica_187_3",
        "Informática 187-6": "informatica_187_6",
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
        "Informática 187-6": "INGENIERÍA INFORMÁTICA (Plan 187-6)",
        "Sistemas": "INGENIERÍA EN SISTEMAS",
        "Redes": "ING. EN REDES Y TELECOMUNICACIONES",
        "Robótica": "INGENIERÍA EN ROBÓTICA",
    }
    return map[id] ?? id
}

function getPlanCode(id: string): string {
    const map: Record<string, string> = {
        "Sistemas": "187-4", "Informática": "187-3",
        "Informática 187-6": "187-6",
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
        <motion.div
            variants={fadeUp}
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
            <motion.button
                onClick={onClick}
                layout
                whileHover={{ y: -2, boxShadow: "0 6px 18px rgba(0,0,0,0.16)" }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                animate={{
                    backgroundColor: cfg.bg,
                    borderColor: cfg.border,
                    boxShadow: esCaso
                        ? "0 0 0 2px rgba(220,38,38,0.5)"
                        : "0 1px 2px rgba(0,0,0,0.06)",
                }}
                style={{
                    width: "100%",
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 6,
                    padding: "7px 8px",
                    textAlign: "left",
                    cursor: "pointer",
                    minHeight: 60,
                }}
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
                    lineHeight: 1.3, opacity: 0.85,
                    fontFamily: "sans-serif",
                }}>
                    {mat.nombre}
                </div>
            </motion.button>

            {/* Input grupo siempre visible si es caso especial */}
            <AnimatePresence initial={false}>
                {esCaso && (
                    <motion.div
                        key="grupo-input"
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ type: "spring", stiffness: 350, damping: 26 }}
                        style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
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

    const semestres = useMemo(() => getSemestres(datos.carrera), [datos.carrera])
    const casoCount = Object.values(estadoMaterias).filter(e => e === "caso").length
    const semestresOrdenados = useMemo(
        () => [...semestres].sort((a, b) => b.semestre - a.semestre),
        [semestres]
    )
    const maxMaterias = Math.max(...semestres.map(s => s.materias.length), 1)

    const getEstado = (sigla: string): EstadoMateria => estadoMaterias[sigla] ?? "pendiente"

    const handleClick = (sigla: string) => {
        setError("")
        const actual = estadoMaterias[sigla]
        setEstadoMateria(sigla, actual === modoActivo ? "pendiente" : modoActivo)
    }

    const handleContinuar = () => {
        if (casoCount === 0) {
            setError("Marcá al menos 1 materia como Caso Especial.")
            return
        }
        const casoSiglas = Object.entries(estadoMaterias)
            .filter(([, e]) => e === "caso")
            .map(([s]) => s)
        const sinGrupo = casoSiglas.filter(s => !gruposMaterias[s]?.trim())
        if (sinGrupo.length > 0) {
            setError(`Completá el grupo para: ${sinGrupo.join(", ")}`)
            return
        }
        router.push("/carta")
    }

    if (semestres.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            >
                <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 360, textAlign: "center", border: "1px solid #e5e7eb" }}>
                    <h2 style={{ fontWeight: 700, color: "#dc2626", marginBottom: 8, fontFamily: "sans-serif" }}>Malla no encontrada</h2>
                    <p style={{ color: "#6b7280", marginBottom: 16, fontSize: 14, fontFamily: "sans-serif" }}>Carrera: <strong>{datos.carrera}</strong></p>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/datos")}
                        style={{ background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}
                    >
                        Volver a Datos
                    </motion.button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{ minHeight: "100vh", padding: "32px 16px", fontFamily: "sans-serif" }}
        >
            <motion.div
                variants={containerStagger}
                initial="hidden"
                animate="show"
                style={{ maxWidth: 900, margin: "0 auto" }}
            >
                {/* ── BADGE + TÍTULO ── */}
                <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
                    <motion.div
                        variants={fadeUp}
                        style={{
                            display: "inline-block",
                            background: "#1d4ed8", color: "#fff",
                            fontSize: 11, fontWeight: 700,
                            padding: "4px 10px", borderRadius: 6,
                            letterSpacing: 0.5, marginBottom: 10,
                        }}
                    >
                        FICCT — U.A.G.R.M.
                    </motion.div>
                    <motion.h1
                        variants={fadeUp}
                        style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 4px 0", lineHeight: 1.2 }}
                    >
                        Seleccioná tu <motion.span
                            style={{ color: "#dc2626", display: "inline-block" }}
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        >Malla</motion.span>
                    </motion.h1>
                    <motion.p variants={fadeUp} style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                        Paso 2 de 4 — Marcá tus materias según su estado
                    </motion.p>
                </motion.div>

                {/* ── BARRA DE PROGRESO ── */}
                <motion.div variants={fadeUp} style={{ display: "flex", gap: 0, marginBottom: 28 }}>
                    {["Datos", "Malla", "Carta", "Descarga"].map((step, i) => {
                        const done = i < 1
                        const active = i === 1
                        return (
                            <div key={step} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                                <motion.div
                                    animate={{
                                        background: done || active ? "#dc2626" : "#e5e7eb",
                                        scaleX: active ? 1 : done ? 1 : 0.6,
                                    }}
                                    initial={{ scaleX: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.08 }}
                                    style={{ height: 3, borderRadius: 2, marginBottom: 6, originX: 0 }}
                                />
                                <motion.span
                                    animate={{
                                        color: active ? "#dc2626" : done ? "#374151" : "#9ca3af",
                                        scale: active ? 1.05 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        fontSize: 12, fontWeight: active ? 700 : 400, display: "inline-block",
                                    }}
                                >
                                    {step}
                                </motion.span>
                            </div>
                        )
                    })}
                </motion.div>

                {/* ── CARD PRINCIPAL ── */}
                <motion.div
                    variants={fadeUp}
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        marginBottom: 16,
                    }}
                >
                    {/* Cabecera de la card con info de carrera */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid #e5e7eb",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            flexWrap: "wrap", gap: 10,
                        }}
                    >
                        <motion.div variants={fadeUp}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>
                                Malla Curricular · Plan {getPlanCode(datos.carrera)}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                                {getNombreCarrera(datos.carrera)}
                            </div>
                        </motion.div>

                        {/* Selector de modo (con layoutId shared underline) */}
                        <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <LayoutGroup id="modo-selector">
                                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginRight: 2 }}>Marcar:</span>
                                {(["caso", "inscrita", "aprobada", "pendiente"] as EstadoMateria[]).map(m => {
                                    const cfg = ESTADO_CFG[m]
                                    const active = modoActivo === m
                                    return (
                                        <motion.button
                                            key={m}
                                            onClick={() => setModoActivo(m)}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 380, damping: 24 }}
                                            style={{
                                                position: "relative",
                                                display: "flex", alignItems: "center", gap: 5,
                                                padding: "4px 10px", borderRadius: 20,
                                                border: `1.5px solid ${active ? cfg.border : "#e5e7eb"}`,
                                                background: active ? cfg.bg : "#f9fafb",
                                                cursor: "pointer", fontSize: 10,
                                                fontWeight: active ? 700 : 500,
                                                color: active ? cfg.text : "#9ca3af",
                                                fontFamily: "sans-serif",
                                            }}
                                        >
                                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.border, flexShrink: 0 }} />
                                            {cfg.label}
                                            {active && (
                                                <motion.div
                                                    layoutId="modo-pill"
                                                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                                    style={{
                                                        position: "absolute", inset: -3,
                                                        borderRadius: 22,
                                                        border: `2px solid ${cfg.border}`,
                                                        pointerEvents: "none",
                                                    }}
                                                />
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </LayoutGroup>
                            {/* Contador casos */}
                            <motion.div
                                key={casoCount}
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{
                                    scale: casoCount > 0 ? [1, 1.15, 1] : 1,
                                    opacity: 1,
                                }}
                                transition={{ duration: 0.35 }}
                                style={{
                                    marginLeft: 6,
                                    background: casoCount > 0 ? "#fca5a5" : "#f3f4f6",
                                    border: `1px solid ${casoCount > 0 ? "#dc2626" : "#e5e7eb"}`,
                                    borderRadius: 20, padding: "4px 12px",
                                    fontSize: 11, color: casoCount > 0 ? "#7f1d1d" : "#9ca3af",
                                    fontWeight: 700,
                                }}
                            >
                                {casoCount} caso{casoCount !== 1 ? "s" : ""}
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                style={{
                                    margin: "12px 20px 0",
                                    background: "#fef2f2", border: "1px solid #fca5a5",
                                    color: "#dc2626", borderRadius: 8,
                                    padding: "8px 14px", fontSize: 13, fontWeight: 600,
                                    overflow: "hidden",
                                }}
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* GRL001 */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            padding: "10px 0",
                            borderBottom: "1px solid #e5e7eb",
                            display: "flex", justifyContent: "center",
                            background: "#f9fafb",
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            style={{
                                background: "#fff", border: "1px solid #d1d5db",
                                borderRadius: 6, padding: "4px 16px",
                                fontSize: 11, fontWeight: 700, color: "#374151",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                        >
                            GRL001 — Modal. de Titulación
                        </motion.div>
                    </motion.div>

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
                </motion.div>

                {/* ── LEYENDA ── */}
                <motion.div
                    variants={fadeUp}
                    style={{
                        display: "flex", alignItems: "center", gap: 18,
                        marginBottom: 16, flexWrap: "wrap",
                        padding: "10px 16px",
                        background: "#fff", borderRadius: 8,
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Referencia:</span>
                    {(["aprobada", "inscrita", "caso", "pendiente"] as EstadoMateria[]).map(m => {
                        const cfg = ESTADO_CFG[m]
                        return (
                            <motion.div
                                key={m}
                                whileHover={{ scale: 1.05 }}
                                style={{ display: "flex", alignItems: "center", gap: 6 }}
                            >
                                <div style={{
                                    width: 14, height: 14, borderRadius: 3,
                                    background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                                    flexShrink: 0,
                                }} />
                                <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>
                                    {cfg.label}
                                </span>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* ── BOTONES ── */}
                <motion.div variants={fadeUp} style={{ display: "flex", gap: 10 }}>
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/datos")}
                        style={{
                            flex: 1, padding: "14px 0", borderRadius: 8,
                            background: "#fff", border: "1px solid #d1d5db",
                            color: "#374151", fontWeight: 600, fontSize: 14,
                            cursor: "pointer", fontFamily: "sans-serif",
                        }}
                    >
                        ← Volver a Datos
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#1e40af" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleContinuar}
                        style={{
                            flex: 2, padding: "14px 0", borderRadius: 8,
                            background: "#1d4ed8",
                            border: "none", color: "#fff",
                            fontWeight: 700, fontSize: 14, cursor: "pointer",
                            fontFamily: "sans-serif",
                            letterSpacing: 0.2,
                        }}
                    >
                        Continuar — Ver Carta →
                    </motion.button>
                </motion.div>

                {/* Footer igual al de datos */}
                <motion.p variants={fadeUp} style={{ textAlign: "center", fontSize: 12, color: "#ffffff", marginTop: 16 }}>
                    🔒 Tus datos solo se usan para generar la carta — nada se envía a ningún servidor.
                </motion.p>
            </motion.div>
        </motion.div>
    )
}
