"use client"

import { useState, useRef } from "react"

/* =========================
   DATOS
========================= */

const malla = [
    {
        semestre: 1,
        color: "#3B82F6",
        materias: [
            { nombre: "Cálculo I", sigla: "MAT101" },
            { nombre: "Estructuras Discretas", sigla: "INF119" },
            { nombre: "Introducción a la Informática", sigla: "INF110" },
            { nombre: "Inglés Técnico I", sigla: "LIN100" },
            { nombre: "Física I", sigla: "FIS100" },
        ]
    },
    {
        semestre: 2,
        color: "#F97316",
        materias: [
            { nombre: "Cálculo II", sigla: "MAT102" },
            { nombre: "Álgebra Lineal", sigla: "MAT103" },
            { nombre: "Programación I", sigla: "INF120" },
            { nombre: "Inglés Técnico II", sigla: "LIN101" },
            { nombre: "Física II", sigla: "FIS102" },
        ]
    },
    {
        semestre: 3,
        color: "#1E3A5F",
        materias: [
            { nombre: "Ecuaciones Diferenciales", sigla: "MAT207" },
            { nombre: "Programación II", sigla: "INF210" },
            { nombre: "Arquitectura de Computadoras", sigla: "INF211" },
            { nombre: "Administración", sigla: "ADM100" },
            { nombre: "Física III", sigla: "FIS200" },
        ]
    },
    {
        semestre: 4,
        color: "#84CC16",
        materias: [
            { nombre: "Probabilidad y Estadística I", sigla: "MAT202" },
            { nombre: "Métodos Numéricos", sigla: "MAT205" },
            { nombre: "Estructura de Datos I", sigla: "INF220" },
            { nombre: "Programación Ensamblador", sigla: "INF221" },
            { nombre: "Contabilidad", sigla: "ADM200" },
        ]
    },
    {
        semestre: 5,
        color: "#A855F7",
        materias: [
            { nombre: "Probabilidad y Estadísticas II", sigla: "MAT302" },
            { nombre: "Estructura de Datos II", sigla: "INF310" },
            { nombre: "Organización y Métodos", sigla: "ADM330" },
            { nombre: "Base de Datos I", sigla: "INF312" },
            { nombre: "Economía para la Gestión", sigla: "ECO300" },
        ]
    },
    {
        semestre: 6,
        color: "#22C55E",
        materias: [
            { nombre: "Investigación Operativa I", sigla: "MAT329" },
            { nombre: "Sistemas Operativos I", sigla: "INF323" },
            { nombre: "Finanzas para la Empresa", sigla: "ADM320" },
            { nombre: "Sistemas de Información I", sigla: "INF342" },
            { nombre: "Base de Datos II", sigla: "INF322" },
        ]
    },
    {
        semestre: 7,
        color: "#EAB308",
        materias: [
            { nombre: "Investigación Operativa II", sigla: "MAT419" },
            { nombre: "Redes I", sigla: "INF433" },
            { nombre: "Sistemas Operativos II", sigla: "INF413" },
            { nombre: "Soporte a la Toma de Decisiones", sigla: "INF432" },
            { nombre: "Sistemas de Información II", sigla: "INF412" },
        ]
    },
    {
        semestre: 8,
        color: "#F59E0B",
        materias: [
            { nombre: "Preparación y Eval. de Proyectos", sigla: "ECO449" },
            { nombre: "Redes II", sigla: "INF423" },
            { nombre: "Auditoría Informática", sigla: "INF462" },
            { nombre: "Sistemas de Inf. Geográfica", sigla: "INF442" },
            { nombre: "Ingeniería de Software I", sigla: "INF422" },
        ]
    },
    {
        semestre: 9,
        color: "#06B6D4",
        materias: [
            { nombre: "Taller de Grado I", sigla: "INF511" },
            { nombre: "Ingeniería de Software II", sigla: "INF512" },
            { nombre: "Tecnología Web", sigla: "INF513" },
            { nombre: "Arquitectura de Software", sigla: "INF552" },
            { nombre: "Modalidad de Licenciatura", sigla: "GRL001" },
        ]
    },
]

const prerequisitos: Record<string, string[]> = {
    MAT102: ["MAT101"], MAT103: ["INF119"], INF120: ["INF110"],
    LIN101: ["LIN100"], FIS102: ["FIS100"],
    MAT207: ["MAT102"], INF210: ["INF120", "MAT103"], INF211: ["INF120"],
    FIS200: ["FIS102"],
    MAT202: ["MAT207"], MAT205: ["MAT207"], INF220: ["INF210", "MAT101"],
    INF221: ["INF211"], ADM200: ["ADM100"],
    MAT302: ["MAT202"], INF310: ["INF220"], ADM330: ["ADM200"],
    INF312: ["INF220"], ECO300: ["ADM200"],
    MAT329: ["MAT302"], INF323: ["INF310"], ADM320: ["ADM330"],
    INF342: ["INF312"], INF322: ["INF312"],
    MAT419: ["MAT329"], INF433: ["INF323"], INF413: ["INF323"],
    INF432: ["INF342"], INF412: ["INF342", "INF322"],
    ECO449: ["MAT419"], INF423: ["INF433"], INF462: ["INF413"],
    INF442: ["INF432"], INF422: ["INF412"],
    INF511: ["ECO449"], INF512: ["INF422"], INF513: ["INF422"],
    INF552: ["INF422"], GRL001: ["INF511", "INF512", "INF513", "INF552"],
}

/* =========================
   LAYOUT CONSTANTS
========================= */

const CARD_W = 130
const CARD_H = 52
const COL_GAP = 40
const SEM_HEADER = 38
const SEM_PADDING = 16
const SEM_GAP = 32

/* =========================
   COMPONENTE
========================= */

export default function MallaCurricular() {
    const [hovered, setHovered] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const totalCols = Math.max(...malla.map(s => s.materias.length))

    const semesterOffsets: number[] = []
    let yAcc = 0
    malla.forEach((sem) => {
        semesterOffsets.push(yAcc)
        yAcc += SEM_HEADER + SEM_PADDING + CARD_H + SEM_PADDING + SEM_GAP
    })

    const totalH = yAcc
    const totalW = totalCols * (CARD_W + COL_GAP) - COL_GAP + 80

    const getCardPos = (sigla: string) => {
        for (let si = 0; si < malla.length; si++) {
            const sem = malla[si]
            const mi = sem.materias.findIndex(m => m.sigla === sigla)
            if (mi !== -1) {
                const x = 40 + mi * (CARD_W + COL_GAP)
                const y = semesterOffsets[si] + SEM_HEADER + SEM_PADDING
                return { x, y, cx: x + CARD_W / 2, cy: y + CARD_H / 2 }
            }
        }
        return null
    }

    const getHighlighted = (sigla: string | null) => {
        if (!sigla) return { cards: new Set<string>(), arrows: [] as [string, string][] }
        const cards = new Set<string>([sigla])
        const arrows: [string, string][] = []

        const addPrereqs = (s: string) => {
            const prs = prerequisitos[s] || []
            prs.forEach(p => { cards.add(p); arrows.push([p, s]); addPrereqs(p) })
        }
        const addDeps = (s: string) => {
            Object.entries(prerequisitos).forEach(([child, prs]) => {
                if (prs.includes(s)) { cards.add(child); arrows.push([s, child]); addDeps(child) }
            })
        }
        addPrereqs(sigla)
        addDeps(sigla)
        return { cards, arrows }
    }

    const { cards: highlighted, arrows: activeArrows } = getHighlighted(hovered)

    const allArrows: [string, string][] = []
    Object.entries(prerequisitos).forEach(([child, prs]) => {
        prs.forEach(pr => allArrows.push([pr, child]))
    })

    const renderArrow = (from: string, to: string, active: boolean, key: string) => {
        const a = getCardPos(from)
        const b = getCardPos(to)
        if (!a || !b) return null

        const x1 = a.cx, y1 = a.y + CARD_H
        const x2 = b.cx, y2 = b.y

        const sameCol = Math.abs(x1 - x2) < 5
        const dy = y2 - y1

        let d: string
        if (sameCol) {
            d = `M ${x1} ${y1} L ${x2} ${y2}`
        } else {
            const mid = y1 + dy * 0.5
            d = `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`
        }

        return (
            <path
                key={key}
                d={d}
                fill="none"
                stroke={active ? "#FFD600" : "#333"}
                strokeWidth={active ? 2 : 1}
                strokeOpacity={active ? 1 : 0.35}
                markerEnd={active ? "url(#arrowActive)" : "url(#arrowDim)"}
                style={{ transition: "all 0.15s" }}
            />
        )
    }

    return (
        <div style={{
            background: "#0a0a0a",
            minHeight: "100vh",
            padding: "2rem",
            fontFamily: "'DM Mono', monospace",
            overflowX: "auto"
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: "2rem", borderTop: "3px solid #FFD600", paddingTop: "1rem" }}>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "#FFD600", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    FICCT — Plan de Estudios
                </div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>
                    Malla Curricular{" "}
                    <span style={{ color: "#FFD600" }}>187-4</span>
                    <span style={{ fontSize: "0.9rem", color: "#555", marginLeft: "1rem", fontWeight: 400 }}>
                        Ingeniería en Sistemas
                    </span>
                </div>
                <div style={{ fontSize: "0.65rem", color: "#444", marginTop: "0.4rem" }}>
                    Pasá el cursor sobre una materia para ver sus prerequisitos y dependencias
                </div>
            </div>

            {/* SVG + Cards */}
            <div ref={containerRef} style={{ position: "relative", width: totalW, height: totalH }}>

                {/* SVG arrows */}
                <svg style={{ position: "absolute", top: 0, left: 0, width: totalW, height: totalH, pointerEvents: "none", overflow: "visible" }}>
                    <defs>
                        <marker id="arrowDim" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#333" />
                        </marker>
                        <marker id="arrowActive" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="#FFD600" />
                        </marker>
                    </defs>

                    {/* Dim arrows */}
                    {allArrows.map(([from, to], i) => {
                        const isActive = hovered && activeArrows.some(([f, t]) => f === from && t === to)
                        if (isActive) return null
                        return renderArrow(from, to, false, `dim-${i}`)
                    })}

                    {/* Active arrows on top */}
                    {hovered && activeArrows.map(([from, to], i) =>
                        renderArrow(from, to, true, `active-${i}`)
                    )}
                </svg>

                {/* Semester rows */}
                {malla.map((sem, si) => {
                    const yOff = semesterOffsets[si]
                    const rowW = sem.materias.length * (CARD_W + COL_GAP) - COL_GAP + SEM_PADDING * 2
                    return (
                        <div key={sem.semestre}>
                            {/* Semester label */}
                            <div style={{
                                position: "absolute",
                                top: yOff,
                                left: 40 - SEM_PADDING,
                                width: rowW,
                                height: SEM_HEADER,
                                background: sem.color,
                                borderRadius: "4px 4px 0 0",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "0.75rem",
                                gap: "0.5rem"
                            }}>
                                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "0.7rem", color: "#fff", letterSpacing: "0.08em" }}>
                                    SEMESTRE {sem.semestre}
                                </span>
                            </div>

                            {/* Cards */}
                            {sem.materias.map((mat, mi) => {
                                const x = 40 + mi * (CARD_W + COL_GAP)
                                const y = yOff + SEM_HEADER + SEM_PADDING
                                const isHov = hovered === mat.sigla
                                const isHL = highlighted.has(mat.sigla)
                                const isDim = hovered && !isHL

                                return (
                                    <div
                                        key={mat.sigla}
                                        onMouseEnter={() => setHovered(mat.sigla)}
                                        onMouseLeave={() => setHovered(null)}
                                        style={{
                                            position: "absolute",
                                            left: x,
                                            top: y,
                                            width: CARD_W,
                                            height: CARD_H,
                                            background: isHov ? "#FFD600" : isHL ? "#1a1800" : "#111",
                                            border: `1px solid ${isHov ? "#FFD600" : isHL ? "#FFD600" : "#222"}`,
                                            borderLeft: `3px solid ${isHov ? "#000" : sem.color}`,
                                            cursor: "default",
                                            transition: "all 0.12s",
                                            opacity: isDim ? 0.25 : 1,
                                            padding: "0.4rem 0.5rem",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            gap: "2px",
                                            zIndex: isHov ? 10 : 1
                                        }}
                                    >
                                        <div style={{
                                            fontSize: "0.55rem",
                                            letterSpacing: "0.1em",
                                            color: isHov ? "#000" : "#FFD600",
                                            fontWeight: 500
                                        }}>
                                            {mat.sigla}
                                        </div>
                                        <div style={{
                                            fontSize: "0.6rem",
                                            color: isHov ? "#000" : "#ccc",
                                            lineHeight: 1.3,
                                            fontFamily: "DM Mono, monospace"
                                        }}>
                                            {mat.nombre}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: "2rem", display: "flex", gap: "2rem", fontSize: "0.6rem", color: "#444", letterSpacing: "0.1em" }}>
                <span>━━ Prerequisito</span>
                <span style={{ color: "#FFD600" }}>━━ Seleccionado</span>
            </div>
        </div>
    )
}
