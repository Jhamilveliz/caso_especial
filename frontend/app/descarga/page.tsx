"use client"

import { useEffect } from "react"
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
   COMPONENTE
========================= */

export default function DescargaPage() {
    const router = useRouter()
    const { datos, estadoMaterias, gruposMaterias, resetAll } = useCasoEspecial()

    // Proteger ruta
    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    const { semestres } = getSemestres(datos.carrera)

    const materiasCaso = Object.entries(estadoMaterias)
        .filter(([, e]) => e === "caso")
        .map(([sigla]) => {
            let nombreMateria = sigla
            for (const sem of semestres) {
                const mat = sem.materias.find((m: Materia) => m.sigla === sigla)
                if (mat) {
                    nombreMateria = mat.nombre
                    break
                }
            }
            return {
                sigla,
                nombre: nombreMateria,
                grupo: gruposMaterias[sigla] ?? "—"
            }
        })

    const carreraInfo = CARRERA_INFO[datos.carrera] ?? {
        director: "Director de Carrera",
        nombre: datos.carrera.toUpperCase()
    }

    const hoy = new Date()
    const fechaLarga = hoy.toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    // Función para imprimir la carta (usa el elemento existente del paso anterior)
    const imprimirCarta = () => {
        // Buscamos la carta que ya está en el DOM de la página anterior
        // Como no podemos acceder directamente, usamos el contenido que ya generamos
        const contenido = document.getElementById("carta-print-content")
        if (!contenido) return

        const ventana = window.open("", "_blank", "width=800,height=1000")
        if (!ventana) return

        ventana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <title>Caso Especial — ${datos.nombre}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Georgia, 'Times New Roman', serif; font-size: 13pt; line-height: 1.6; padding: 2.5cm 3cm; color: #000; }
                    table { width: 100%; border-collapse: collapse; margin: 1.2em 0; }
                    th, td { border: 1px solid #333; padding: 8px 12px; text-align: left; }
                    th { background: #f0f0f0; font-weight: bold; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .text-justify { text-align: justify; }
                    .bold { font-weight: bold; }
                    .underline { text-decoration: underline; }
                    .firma { margin-top: 80px; }
                    @page { size: Letter; margin: 2.5cm 3cm; }
                </style>
            </head>
            <body>${contenido.innerHTML}</body>
            </html>
        `)
        ventana.document.close()
        ventana.focus()
        setTimeout(() => { ventana.print() }, 400)
    }

    // Función para imprimir la malla (con colores)
    const imprimirMalla = () => {
        const ventana = window.open("", "_blank", "width=1200,height=800")
        if (!ventana) return

        // Función para obtener el color según el estado
        const getEstadoColor = (estado: string) => {
            switch (estado) {
                case "aprobada": return "#fef9c3"; // amarillo claro
                case "inscrita": return "#dcfce7"; // verde claro
                case "caso": return "#fee2e2"; // rojo claro
                default: return "#f9fafb"; // gris claro
            }
        }

        const getEstadoBorder = (estado: string) => {
            switch (estado) {
                case "aprobada": return "#facc15";
                case "inscrita": return "#22c55e";
                case "caso": return "#ef4444";
                default: return "#d1d5db";
            }
        }

        const getEstadoTexto = (estado: string) => {
            switch (estado) {
                case "aprobada": return "APROBADA";
                case "inscrita": return "INSCRITA";
                case "caso": return "CASO ESPECIAL";
                default: return "PENDIENTE";
            }
        }

        ventana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <title>Malla Curricular — ${datos.carrera}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                        font-size: 11pt; 
                        line-height: 1.5; 
                        padding: 2rem;
                        background: #f9fafb;
                        color: #111827;
                    }
                    .header {
                        margin-bottom: 2rem;
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 20pt;
                        font-weight: 800;
                        color: #1e3a8a;
                        margin-bottom: 0.5rem;
                    }
                    .header h2 {
                        font-size: 16pt;
                        font-weight: 700;
                        color: #b91c1c;
                        margin-bottom: 0.5rem;
                    }
                    .header p {
                        font-size: 11pt;
                        color: #6b7280;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 1rem;
                        margin-bottom: 2rem;
                        padding: 1rem;
                        background: white;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                    }
                    .info-item {
                        text-align: center;
                    }
                    .info-label {
                        font-size: 9pt;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        color: #6b7280;
                        margin-bottom: 0.25rem;
                    }
                    .info-value {
                        font-size: 14pt;
                        font-weight: 700;
                        color: #1f2937;
                    }
                    .semestre {
                        background: white;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        margin-bottom: 1.5rem;
                        overflow: hidden;
                    }
                    .semestre-header {
                        background: #f3f4f6;
                        padding: 1rem;
                        border-bottom: 1px solid #e5e7eb;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }
                    .semestre-numero {
                        width: 32px;
                        height: 32px;
                        background: #1e3a8a;
                        color: white;
                        font-weight: 700;
                        font-size: 12pt;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                    }
                    .semestre-titulo {
                        font-size: 14pt;
                        font-weight: 600;
                        color: #1f2937;
                    }
                    .materias-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1rem;
                        padding: 1rem;
                    }
                    .materia-card {
                        border: 2px solid;
                        border-radius: 6px;
                        padding: 0.75rem;
                        transition: all 0.2s;
                    }
                    .materia-sigla {
                        font-size: 9pt;
                        font-weight: 700;
                        color: #6b7280;
                        margin-bottom: 0.25rem;
                    }
                    .materia-nombre {
                        font-size: 10pt;
                        font-weight: 600;
                        color: #1f2937;
                        margin-bottom: 0.5rem;
                    }
                    .materia-estado {
                        font-size: 8pt;
                        font-weight: 700;
                        padding: 2px 8px;
                        border-radius: 4px;
                        display: inline-block;
                    }
                    .materia-grupo {
                        font-size: 8pt;
                        color: #b91c1c;
                        font-weight: 700;
                        margin-top: 0.5rem;
                    }
                    .leyenda {
                        display: flex;
                        gap: 2rem;
                        justify-content: center;
                        margin: 2rem 0;
                        padding: 1rem;
                        background: white;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                    }
                    .leyenda-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                    .leyenda-color {
                        width: 16px;
                        height: 16px;
                        border: 2px solid;
                        border-radius: 4px;
                    }
                    .footer {
                        margin-top: 2rem;
                        text-align: center;
                        font-size: 9pt;
                        color: #9ca3af;
                    }
                    @page { size: A4; margin: 2cm; }
                    @media print {
                        body { background: white; padding: 0; }
                        .info-grid { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>FACULTAD DE INGENIERÍA EN CIENCIAS DE LA COMPUTACIÓN Y TELECOMUNICACIONES</h1>
                    <h2>${carreraInfo.nombre}</h2>
                    <p>MALLA CURRICULAR • ${datos.gestion}</p>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">ESTUDIANTE</div>
                        <div class="info-value">${datos.nombre}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">REGISTRO</div>
                        <div class="info-value">${datos.registro}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">PPA</div>
                        <div class="info-value">${datos.ppa}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">CASOS ESPECIALES</div>
                        <div class="info-value">${materiasCaso.length}</div>
                    </div>
                </div>

                <div class="semestres-container">
                    ${[...semestres].reverse().map(sem => {
            const materiasHTML = sem.materias.map((mat: Materia) => {
                const estado = estadoMaterias[mat.sigla] || "pendiente"
                const bgColor = getEstadoColor(estado)
                const borderColor = getEstadoBorder(estado)
                const estadoTexto = getEstadoTexto(estado)
                const grupo = gruposMaterias[mat.sigla]

                return `
                                <div class="materia-card" style="background-color: ${bgColor}; border-color: ${borderColor};">
                                    <div class="materia-sigla">${mat.sigla}</div>
                                    <div class="materia-nombre">${mat.nombre}</div>
                                    <span class="materia-estado" style="background-color: ${borderColor}20; color: ${borderColor};">${estadoTexto}</span>
                                    ${estado === "caso" && grupo ? `<div class="materia-grupo">Grupo: ${grupo}</div>` : ''}
                                </div>
                            `
            }).join('')

            return `
                            <div class="semestre">
                                <div class="semestre-header">
                                    <span class="semestre-numero">${sem.semestre}</span>
                                    <span class="semestre-titulo">
                                        ${sem.semestre === 1 ? "PRIMER SEMESTRE" :
                    sem.semestre === 9 ? "NOVENO SEMESTRE" :
                        `${sem.semestre}° SEMESTRE`}
                                    </span>
                                </div>
                                <div class="materias-grid">
                                    ${materiasHTML}
                                </div>
                            </div>
                        `
        }).join('')}
                </div>

                <div class="leyenda">
                    <div class="leyenda-item">
                        <div class="leyenda-color" style="background: #fef9c3; border-color: #facc15;"></div>
                        <span>Aprobada</span>
                    </div>
                    <div class="leyenda-item">
                        <div class="leyenda-color" style="background: #dcfce7; border-color: #22c55e;"></div>
                        <span>Inscrita</span>
                    </div>
                    <div class="leyenda-item">
                        <div class="leyenda-color" style="background: #fee2e2; border-color: #ef4444;"></div>
                        <span>Caso Especial</span>
                    </div>
                    <div class="leyenda-item">
                        <div class="leyenda-color" style="background: #f9fafb; border-color: #d1d5db;"></div>
                        <span>Pendiente</span>
                    </div>
                </div>

                <div class="footer">
                    Documento generado el ${fechaLarga} • Sistema de Solicitud de Casos Especiales FICCT
                </div>
            </body>
            </html>
        `)
        ventana.document.close()
        ventana.focus()
        setTimeout(() => { ventana.print() }, 400)
    }

    const nuevaSolicitud = () => {
        resetAll()
        router.push("/datos")
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded mb-3 tracking-widest uppercase">
                        FICCT — U.A.G.R.M.
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Descargar{" "}
                        <span className="text-red-700">Documentos</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Paso 4 de 4 — Descargá los documentos generados
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex gap-2 mb-7">
                    {PASOS.map((paso, i) => (
                        <div key={paso} className="flex-1">
                            <div className="h-1 rounded-full mb-1 bg-red-600" />
                            <span className="text-xs font-medium text-red-600">{paso}</span>
                        </div>
                    ))}
                </div>

                {/* Resumen final */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Resumen de la solicitud</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                            <span className="text-gray-500">Estudiante:</span>
                            <span className="text-gray-900 font-semibold ml-2">{datos.nombre}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Registro:</span>
                            <span className="text-gray-900 font-semibold ml-2">{datos.registro}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">PPA:</span>
                            <span className="text-blue-800 font-black ml-2 text-lg">{datos.ppa}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Gestión:</span>
                            <span className="text-gray-900 font-semibold ml-2">{datos.gestion}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Celular:</span>
                            <span className="text-gray-900 font-semibold ml-2">{datos.celular || "—"}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">CI:</span>
                            <span className="text-gray-900 font-semibold ml-2">{datos.ci}</span>
                        </div>
                    </div>

                    {/* Materias caso especial */}
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Materias — Caso Especial</p>
                        {materiasCaso.length === 0 ? (
                            <p className="text-gray-400 text-sm">No hay materias marcadas como caso especial.</p>
                        ) : (
                            materiasCaso.map((m, i) => (
                                <div key={m.sigla} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                                    <span className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0">{i + 1}</span>
                                    <span className="flex-1 text-gray-900 text-sm font-medium">{m.nombre}</span>
                                    <span className="text-blue-800 font-mono text-xs font-semibold">{m.sigla}</span>
                                    <span className="bg-gray-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded border border-gray-200">Grupo: {m.grupo}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* BOTONES DE DESCARGA */}
                <div className="flex flex-col gap-3 mb-8">
                    <button
                        onClick={imprimirCarta}
                        className="w-full py-4 rounded-md bg-blue-800 hover:bg-blue-900 active:scale-[0.99] text-white font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                        <span className="text-xl">📄</span>
                        Descargar Carta de Solicitud
                    </button>

                    <button
                        onClick={imprimirMalla}
                        className="w-full py-4 rounded-md bg-green-700 hover:bg-green-800 active:scale-[0.99] text-white font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                        <span className="text-xl">📊</span>
                        Descargar Malla Curricular
                    </button>

                    <button
                        onClick={() => router.push("/carta")}
                        className="w-full py-3 rounded-md bg-white hover:bg-gray-50 text-gray-600 font-semibold border border-gray-300 transition flex items-center justify-center gap-2 text-sm"
                    >
                        👁 Volver a ver la carta
                    </button>

                    <button
                        onClick={nuevaSolicitud}
                        className="w-full py-3 rounded-md bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 font-semibold border border-gray-200 transition flex items-center justify-center gap-2 text-sm"
                    >
                        🔄 Nueva Solicitud
                    </button>
                </div>

                <p className="text-center text-gray-400 text-xs">
                    Al hacer clic en los botones, se abrirá una ventana para imprimir o guardar como PDF.
                </p>
            </div>

            {/* Elemento oculto con el contenido de la carta para imprimir */}
            <div id="carta-print-content" className="hidden">
                <p style={{ textAlign: "right", marginBottom: "2em", color: "#555" }}>
                    Santa Cruz de la Sierra, {fechaLarga}
                </p>

                <p style={{ fontWeight: "bold" }}>Señor</p>
                <p>{carreraInfo.director}</p>
                <p style={{ fontWeight: "600" }}>DIRECTOR DE CARRERA – {carreraInfo.nombre}</p>
                <p>F.I.C.C.T. - U.A.G.R.M.</p>
                <p style={{ marginBottom: "2em" }}>Presente:</p>

                <p style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", letterSpacing: "0.05em", marginBottom: "2em" }}>
                    Ref.: SOLICITUD DE CASO ESPECIAL
                </p>

                <p style={{ marginBottom: "1em" }}>Distinguido Director:</p>

                <p style={{ textAlign: "justify", marginBottom: "1em" }}>
                    Mediante la presente, tengo a bien dirigirme a su autoridad para solicitar mi adición
                    de materias a través de caso especial. Necesito adicionar como caso especial un total de{" "}
                    <strong>{materiasCaso.length} materia{materiasCaso.length !== 1 ? "s" : ""}</strong>{" "}
                    para la presente gestión <strong>{datos.gestion}</strong>.
                </p>

                <p style={{ textAlign: "justify", marginBottom: "1em" }}>
                    El motivo de mi solicitud se fundamenta en la necesidad de nivelación académica. Al
                    encontrarme cursando el <strong>cuarto semestre</strong> de la carrera de {carreraInfo.nombre},
                    busco optimizar mi avance curricular para completar las materias del plan de estudios
                    en el menor tiempo posible. Mi objetivo es regularizar mi situación académica y evitar
                    el desfase en los niveles superiores, aprovechando mi rendimiento actual para adelantar
                    asignaturas que son requisitos críticos en la malla.
                </p>

                <p style={{ marginBottom: "1em" }}>
                    Para tal efecto, detallo a continuación las materias que solicito sean adicionadas:
                </p>

                <p style={{ fontWeight: "bold", marginBottom: "1.5em" }}>
                    TENGO UN PPA: <span style={{ textDecoration: "underline" }}>{datos.ppa}</span>
                </p>

                <p style={{ marginBottom: "0.75em" }}>
                    Materias a inscribir en el semestre <strong>{datos.gestion}</strong> por caso especial:
                </p>

                <table>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>NOMBRE DE MATERIA</th>
                            <th>SIGLA</th>
                            <th>GRUPO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materiasCaso.map((m, i) => (
                            <tr key={m.sigla}>
                                <td>{i + 1}</td>
                                <td>{m.nombre}</td>
                                <td style={{ fontFamily: "monospace" }}>{m.sigla}</td>
                                <td style={{ fontWeight: "bold" }}>{m.grupo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p style={{ marginBottom: "5em" }}>
                    Sin otro particular, me despido con un saludo a usted atentamente:
                </p>

                <div className="firma">
                    <p><strong>Univ.:</strong> {datos.nombre}</p>
                    <p><strong>Reg.:</strong> {datos.registro}</p>
                    <p><strong>C.I.:</strong> {datos.ci}</p>
                    <p><strong>Cel.:</strong> {datos.celular || "[No especificado]"}</p>
                </div>
            </div>
        </div>
    )
}