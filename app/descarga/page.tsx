"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial } from "@/lib/store"
import { mallas, Materia, Semestre } from "@/data/mallas"

/* =========================
   CONFIG CARRERAS
========================= */

const CARRERA_INFO: Record<string, { director: string; nombre: string }> = {
    "Informática": { director: "Msc. José Junior Villagómez Melgar", nombre: "INGENIERÍA INFORMÁTICA" },
    "Sistemas": { director: "Msc. Leonardo Vargas Peña", nombre: "INGENIERÍA EN SISTEMAS" },
    "Redes": { director: "Msc. Jorge Marcelo Rosales Fuentes", nombre: "INGENIERÍA EN REDES Y TELECOMUNICACIONES" },
    "Robótica": { director: "Msc. José Junior Villagómez Melgar", nombre: "INGENIERÍA EN ROBÓTICA" },
}

const PASOS = ["Datos", "Malla", "Carta", "Descarga"]

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

/* ── Colores estado ── */
const ESTADO_BG: Record<string, string> = { aprobada: "#fde047", inscrita: "#86efac", caso: "#fca5a5", pendiente: "#ffffff" }
const ESTADO_BORDER: Record<string, string> = { aprobada: "#ca8a04", inscrita: "#16a34a", caso: "#dc2626", pendiente: "#d1d5db" }
const ESTADO_TEXT: Record<string, string> = { aprobada: "#713f12", inscrita: "#14532d", caso: "#7f1d1d", pendiente: "#6b7280" }

/* ── Genera HTML de la carta (para PDF) ──
   Intentamos replicar lo más fiel posible el formato del modelo en Word */
function generarHTMLCarta(datos: any, carreraInfo: any, materiasCaso: any[], fechaLarga: string, totalInscritas: number): string {
    const totalFilas = Math.max(3, materiasCaso.length)
    const filasTabla = Array.from({ length: totalFilas }).map((_, i) => {
        const m = materiasCaso[i]
        return `
        <tr>
            <td style="border:1px solid #000;padding:4px 8px;text-align:center;width:8%;">${i + 1}</td>
            <td style="border:1px solid #000;padding:4px 8px;width:54%;">${m ? m.nombre : ""}</td>
            <td style="border:1px solid #000;padding:4px 8px;width:18%;font-family:monospace;">${m ? m.sigla : ""}</td>
            <td style="border:1px solid #000;padding:4px 8px;width:20%;font-weight:bold;text-align:center;">${m ? m.grupo : ""}</td>
        </tr>`
    }).join("")

    return `
    <div style="font-family:'Times New Roman',serif;font-size:11pt;line-height:1.5;color:#000;max-width:700px;margin:0 auto;">
        <!-- Encabezado de fecha (sin subrayados) -->
        <p style="text-align:right;margin:0 0 24px 0;">
            Santa Cruz, ${fechaLarga}
        </p>

        <!-- Destinatario -->
        <p style="margin:0 0 2px 0;">Señor</p>
        <p style="margin:0 0 2px 0;">${carreraInfo.director}</p>
        <p style="margin:0 0 2px 0;">DIRECTOR DE CARRERA – ${carreraInfo.nombre}</p>
        <p style="margin:0 0 14px 0;">F.I.C.C.T.- U.A.G.R.M.</p>
        <p style="margin:0 0 18px 0;">Presente:</p>

        <!-- Referencia -->
        <p style="text-align:center;font-weight:bold;margin:0 0 18px 0;">
            Ref.: SOLICITUD DE CASO ESPECIAL
        </p>

        <!-- Saludo -->
        <p style="margin:0 0 12px 0;">Distinguido Director:</p>

        <!-- Cuerpo principal, siguiendo el modelo -->
        <p style="text-align:justify;margin:0 0 12px 0;">
            Mediante la presente, tengo a bien dirigirme a su autoridad para solicitar mi adición de materias
            a través de caso especial, puesto que tengo inscritas ${totalInscritas} asignaturas y necesito
            adicionar como caso especial un total de ${materiasCaso.length} materias porque ${datos.motivo || "motivos justificando la razón por la que quiero hacer caso especial"}
            en la presente gestión ${datos.gestion}. Para tal efecto, detallo a continuación las materias que solicito que sean adicionadas como caso especial:
        </p>

        <!-- PPA -->
        <p style="margin:16px 0 10px 0;">
            TENGO UN PPA: ${datos.ppa}
        </p>

        <!-- Texto previo a la tabla -->
        <p style="margin:8px 0 10px 0;">
            Materias a inscribir en el semestre ${datos.gestion} por caso especial
        </p>

        <!-- Tabla de materias -->
        <table style="width:100%;border-collapse:collapse;margin:0 0 24px 0;font-size:11pt;">
            <thead>
                <tr>
                    <th style="border:1px solid #000;padding:4px 8px;text-align:center;">N°</th>
                    <th style="border:1px solid #000;padding:4px 8px;text-align:left;">NOMBRE DE MATERIA</th>
                    <th style="border:1px solid #000;padding:4px 8px;text-align:left;">SIGLA</th>
                    <th style="border:1px solid #000;padding:4px 8px;text-align:left;">GRUPO</th>
                </tr>
            </thead>
            <tbody>
                ${filasTabla}
            </tbody>
        </table>

        <!-- Cierre -->
        <p style="margin:0 0 60px 0;">
            Sin otro particular me despido con un saludo a usted atentamente:
        </p>

        <!-- Firma y datos del estudiante -->
        <div style="text-align:center;margin:0 0 16px 0;">
            <div style="border-top:1px solid #000;width:220px;margin:0 auto 8px auto;"></div>
        </div>
        <div style="font-size:10pt;line-height:1.4;margin:0 0 24px 0;text-align:center;">
            <p style="margin:0 0 4px 0;">Univ.: ${datos.nombre}</p>
            <p style="margin:0 0 4px 0;">Reg.: ${datos.registro}</p>
            <p style="margin:0 0 4px 0;">C.I.: ${datos.ci}</p>
            <p style="margin:0 0 4px 0;">Cel.: ${datos.celular || ""}</p>
        </div>

        <!-- Notas al pie -->
        <div style="font-size:9pt;margin-top:8px;">
            <p style="margin:0 0 4px 0;">Adjuntar en otra hoja:</p>
            <p style="margin:0 0 2px 0;">a) Boleta de inscripción actual</p>
            <p style="margin:0 0 2px 0;">b) Avance académico</p>
            <p style="margin:0 0 2px 0;">c) Fotocopia del Carnet de Identidad</p>
            <p style="margin:0;">d) Malla curricular de la carrera debidamente resaltada</p>
        </div>
    </div>
    `
}

/* ── Genera HTML de la malla (para PDF) ── */
function generarHTMLMalla(datos: any, carreraInfo: any, semestres: Semestre[], estadoMaterias: any, gruposMaterias: any, fechaLarga: string): string {
    const semestresOrdenados = [...semestres].sort((a, b) => b.semestre - a.semestre)
    const SEM_LABEL: Record<number, string> = { 9: "9n", 8: "8v", 7: "7m", 6: "6to", 5: "5to", 4: "4to", 3: "3ro", 2: "2d", 1: "1ro" }
    const maxMaterias = Math.max(...semestres.map(s => s.materias.length), 1)

    const filas = semestresOrdenados.map((sem, semIdx) => {
        const celdas = Array.from({ length: maxMaterias }).map((_, idx) => {
            const mat: Materia | undefined = sem.materias[idx]
            if (!mat) return `<td style="border:1px solid #e5e7eb;padding:4px;background:#fafafa;"></td>`
            const estado = estadoMaterias[mat.sigla] || "pendiente"
            const bg = ESTADO_BG[estado]
            const border = ESTADO_BORDER[estado]
            const text = ESTADO_TEXT[estado]
            const grupo = estado === "caso" && gruposMaterias[mat.sigla] ? `<div style="font-size:6.5pt;color:#dc2626;font-weight:700;margin-top:2px;">G: ${gruposMaterias[mat.sigla]}</div>` : ""
            return `
                <td style="border:1px solid #e5e7eb;padding:4px;vertical-align:top;">
                    <div style="background:${bg};border:1px solid ${border};border-radius:4px;padding:4px 5px;min-height:42px;">
                        <div style="font-weight:800;font-size:8pt;color:${text};font-family:'Courier New',monospace;">${mat.sigla}</div>
                        <div style="font-size:6.5pt;color:${text};opacity:0.8;line-height:1.25;margin-top:2px;">${mat.nombre}</div>
                        ${grupo}
                    </div>
                </td>`
        }).join("")

        return `
            <tr>
                <td style="width:38px;background:${semIdx % 2 === 0 ? "#eff6ff" : "#f0f4ff"};border:1px solid #e5e7eb;text-align:center;vertical-align:middle;padding:4px 2px;">
                    <div style="font-weight:900;font-size:11pt;color:#1d4ed8;">${SEM_LABEL[sem.semestre] ?? sem.semestre}</div>
                    <div style="font-size:6pt;color:#93c5fd;font-weight:600;text-transform:uppercase;">Sem</div>
                </td>
                ${celdas}
            </tr>`
    }).join("")

    return `
    <div style="font-family:sans-serif;font-size:9pt;color:#111827;padding:0;">
        <div style="text-align:center;margin-bottom:10px;">
            <div style="font-size:8pt;font-weight:700;color:#1d4ed8;letter-spacing:1px;">FICCT — U.A.G.R.M.</div>
            <div style="font-size:13pt;font-weight:900;color:#111827;">MALLA CURRICULAR</div>
            <div style="font-size:11pt;font-weight:700;color:#dc2626;">${carreraInfo.nombre}</div>
            <div style="font-size:8pt;color:#6b7280;margin-top:2px;">
                ${datos.nombre} &nbsp;·&nbsp; Reg. ${datos.registro} &nbsp;·&nbsp; PPA ${datos.ppa} &nbsp;·&nbsp; Gestión ${datos.gestion}
            </div>
        </div>

        <div style="display:flex;justify-content:center;margin-bottom:6px;">
            <div style="background:#fff;border:1px solid #d1d5db;border-radius:4px;padding:3px 14px;font-size:8pt;font-weight:700;color:#374151;">
                GRL001 — Modal. de Titulación
            </div>
        </div>

        <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
            <tbody>${filas}</tbody>
        </table>

        <div style="display:flex;justify-content:center;gap:16px;margin-top:8px;flex-wrap:wrap;font-size:7.5pt;">
            ${Object.entries({ aprobada: "Aprobada", inscrita: "Inscrita", caso: "Caso Especial", pendiente: "Pendiente" }).map(([k, v]) =>
        `<div style="display:flex;align-items:center;gap:4px;">
                    <div style="width:11px;height:11px;background:${ESTADO_BG[k]};border:1px solid ${ESTADO_BORDER[k]};border-radius:2px;"></div>
                    <span style="color:#374151;">${v}</span>
                </div>`
    ).join("")}
        </div>
        <div style="text-align:center;font-size:7pt;color:#9ca3af;margin-top:6px;">Generado: ${fechaLarga}</div>
    </div>
    `
}

/* =========================
   COMPONENTE PRINCIPAL
========================= */

export default function DescargaPage() {
    const router = useRouter()
    const { datos, estadoMaterias, gruposMaterias, resetAll } = useCasoEspecial()

    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    const semestres = getSemestres(datos.carrera)

    const materiasCaso = Object.entries(estadoMaterias)
        .filter(([, e]) => e === "caso")
        .map(([sigla]) => {
            let nombreMateria = sigla
            for (const sem of semestres) {
                const mat = sem.materias.find((m: Materia) => m.sigla === sigla)
                if (mat) { nombreMateria = mat.nombre; break }
            }
            return { sigla, nombre: nombreMateria, grupo: gruposMaterias[sigla] ?? "—" }
        })

    const totalInscritas = Object.values(estadoMaterias).filter(e => e === "inscrita").length

    const carreraInfo = CARRERA_INFO[datos.carrera] ?? { director: "Director de Carrera", nombre: datos.carrera.toUpperCase() }

    const hoy = new Date()
    const fechaLarga = hoy.toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })

    /* ── Descarga PDF usando jsPDF + html2canvas ── */
    const descargarPDF = async (htmlContent: string, nombreArchivo: string, landscape = false) => {
        // Importar dinámicamente para evitar SSR issues
        const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
            import("jspdf"),
            import("html2canvas"),
        ])

        // Crear elemento temporal
        const container = document.createElement("div")
        container.style.position = "fixed"
        container.style.left = "-9999px"
        container.style.top = "0"
        container.style.width = landscape ? "1056px" : "816px" // Letter: 8.5in × 11in @ 96dpi
        container.style.background = "#ffffff"
        container.style.padding = landscape ? "28px 32px" : "56px 72px"
        container.style.boxSizing = "border-box"
        container.innerHTML = htmlContent
        document.body.appendChild(container)

        try {
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: landscape ? "landscape" : "portrait",
                unit: "pt",
                format: "letter",
            })

            const pageW = pdf.internal.pageSize.getWidth()
            const pageH = pdf.internal.pageSize.getHeight()
            const ratio = canvas.height / canvas.width
            const imgW = pageW
            const imgH = pageW * ratio

            if (imgH <= pageH) {
                pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH)
            } else {
                // Si no entra, escala para que entre en 1 página
                const scaledH = pageH
                const scaledW = pageH / ratio
                const xOffset = (pageW - scaledW) / 2
                pdf.addImage(imgData, "PNG", xOffset, 0, scaledW, scaledH)
            }

            pdf.save(nombreArchivo)
        } finally {
            document.body.removeChild(container)
        }
    }

    const handleDescargarCarta = async () => {
        const html = generarHTMLCarta(datos, carreraInfo, materiasCaso, fechaLarga, totalInscritas)
        await descargarPDF(html, `carta-caso-especial-${datos.registro || "solicitud"}.pdf`, false)
    }

    const handleDescargarMalla = async () => {
        const html = generarHTMLMalla(datos, carreraInfo, semestres, estadoMaterias, gruposMaterias, fechaLarga)
        await descargarPDF(html, `malla-${datos.carrera.toLowerCase()}-${datos.registro || "malla"}.pdf`, true)
    }

    const nuevaSolicitud = () => {
        resetAll()
        router.push("/datos")
    }

    return (
        <div style={{ minHeight: "100vh", padding: "32px 16px", fontFamily: "sans-serif" }}>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>

                {/* ── BADGE + TÍTULO ── */}
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
                        Descargar <span style={{ color: "#dc2626" }}>Documentos</span>
                    </h1>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                        Paso 4 de 4 — Descargá los documentos generados
                    </p>
                </div>

                {/* ── BARRA DE PROGRESO ── */}
                <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
                    {PASOS.map((paso, i) => (
                        <div key={paso} style={{ flex: 1, textAlign: "center" }}>
                            <div style={{
                                height: 3, borderRadius: 2,
                                background: "#dc2626",
                                marginBottom: 6,
                            }} />
                            <span style={{
                                fontSize: 12, fontWeight: i === 3 ? 700 : 400,
                                color: i === 3 ? "#dc2626" : "#374151",
                            }}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── RESUMEN ── */}
                <div style={{
                    background: "#fff", borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    padding: "24px", marginBottom: 16,
                }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                        Resumen de la solicitud
                    </div>

                    {/* Grid info estudiante */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px", marginBottom: 20 }}>
                        {[
                            { label: "Estudiante", value: datos.nombre },
                            { label: "Registro", value: datos.registro },
                            { label: "PPA", value: datos.ppa, highlight: true },
                            { label: "Gestión", value: datos.gestion },
                            { label: "Celular", value: datos.celular || "—" },
                            { label: "C.I.", value: datos.ci },
                        ].map(item => (
                            <div key={item.label}>
                                <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.label}</div>
                                <div style={{
                                    fontSize: item.highlight ? 22 : 14,
                                    fontWeight: item.highlight ? 900 : 600,
                                    color: item.highlight ? "#1d4ed8" : "#111827",
                                }}>
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Materias caso especial */}
                    <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            marginBottom: 12,
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                                Materias — Caso Especial
                            </span>
                        </div>

                        {materiasCaso.length === 0 ? (
                            <p style={{ color: "#9ca3af", fontSize: 13 }}>No hay materias marcadas como caso especial.</p>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: "#f9fafb" }}>
                                        <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>N°</th>
                                        <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>Materia</th>
                                        <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>Sigla</th>
                                        <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>Grupo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materiasCaso.map((m, i) => (
                                        <tr key={m.sigla} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                            <td style={{ padding: "8px 10px", color: "#6b7280" }}>{i + 1}</td>
                                            <td style={{ padding: "8px 10px", color: "#111827", fontWeight: 500 }}>{m.nombre}</td>
                                            <td style={{ padding: "8px 10px", color: "#1d4ed8", fontFamily: "monospace", fontWeight: 700 }}>{m.sigla}</td>
                                            <td style={{ padding: "8px 10px", color: "#dc2626", fontWeight: 700 }}>{m.grupo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* ── BOTONES DE DESCARGA ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    <button
                        onClick={handleDescargarCarta}
                        style={{
                            width: "100%", padding: "16px 0",
                            borderRadius: 8, background: "#1d4ed8",
                            border: "none", color: "#fff",
                            fontWeight: 700, fontSize: 15,
                            cursor: "pointer", fontFamily: "sans-serif",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#1e40af")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#1d4ed8")}
                    >
                        <span style={{ fontSize: 20 }}>📄</span>
                        Descargar Carta de Solicitud (PDF)
                    </button>

                    <button
                        onClick={handleDescargarMalla}
                        style={{
                            width: "100%", padding: "16px 0",
                            borderRadius: 8, background: "#15803d",
                            border: "none", color: "#fff",
                            fontWeight: 700, fontSize: 15,
                            cursor: "pointer", fontFamily: "sans-serif",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#166534")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#15803d")}
                    >
                        <span style={{ fontSize: 20 }}>📊</span>
                        Descargar Malla Curricular (PDF)
                    </button>

                    <button
                        onClick={() => router.push("/carta")}
                        style={{
                            width: "100%", padding: "12px 0",
                            borderRadius: 8, background: "#fff",
                            border: "1px solid #d1d5db", color: "#374151",
                            fontWeight: 600, fontSize: 13,
                            cursor: "pointer", fontFamily: "sans-serif",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                    >
                        👁 Volver a ver la carta
                    </button>

                    <button
                        onClick={nuevaSolicitud}
                        style={{
                            width: "100%", padding: "12px 0",
                            borderRadius: 8, background: "#fff",
                            border: "1px solid #e5e7eb", color: "#9ca3af",
                            fontWeight: 600, fontSize: 13,
                            cursor: "pointer", fontFamily: "sans-serif",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#374151")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                    >
                        🔄 Nueva Solicitud
                    </button>
                </div>

                <p style={{ textAlign: "center", fontSize: 12, color: "#ffffff" }}>
                    🔒 Los documentos se generan en tu navegador — nada se envía a ningún servidor.
                </p>
            </div>
        </div>
    )
}