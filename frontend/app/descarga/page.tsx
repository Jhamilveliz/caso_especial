"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial } from "@/lib/store"
import { mallas } from "@/data/mallas"

/* =========================
   CONFIG CARRERAS
========================= */

const CARRERA_INFO: Record<string, { director: string; nombre: string }> = {
    sistemas_187_4: { director: "Msc. Leonardo Vargas Peña", nombre: "Ingeniería en Sistemas" },
    informatica_187_3: { director: "Msc. José Junior Villagómez Melgar", nombre: "Ingeniería Informática" },
    redes_187_5: { director: "Msc. Jorge Marcelo Rosales Fuentes", nombre: "Ing. en Redes y Telecomunicaciones" },
    robotica_323_0: { director: "Ing. Junior", nombre: "Ingeniería en Robótica" },
    informatica_menciones: { director: "Msc. José Junior Villagómez Melgar", nombre: "Ing. Informática con Menciones" },
}

export default function DescargaPage() {
    const router = useRouter()
    const { datos, estadoMaterias, gruposMaterias, resetAll } = useCasoEspecial()

    // Proteger ruta
    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    // Materias caso especial
    const mallaCarrera = (mallas as any)[datos.carrera]
    const semestres = mallaCarrera?.troncal ?? mallaCarrera ?? []

    const materiasCaso = Object.entries(estadoMaterias)
        .filter(([, e]) => e === "caso")
        .map(([sigla]) => {
            let nombreMateria = sigla
            for (const sem of semestres) {
                const mat = sem.materias.find((m: any) => m.sigla === sigla)
                if (mat) { nombreMateria = mat.nombre; break }
            }
            return { sigla, nombre: nombreMateria, grupo: gruposMaterias[sigla] ?? "—" }
        })

    const carreraInfo = CARRERA_INFO[datos.carrera] ?? { director: "Director de Carrera", nombre: datos.carrera }

    const hoy = new Date()
    const fechaLarga = hoy.toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })

    const imprimirCarta = () => {
        const contenido = document.getElementById("carta-print")
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
                    table { width: 100%; border-collapse: collapse; margin-bottom: 1.2em; }
                    th, td { border: 1px solid #555; padding: 6px 10px; text-align: left; }
                    th { background: #eee; font-weight: bold; }
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

    const nuevaSolicitud = () => {
        resetAll()
        router.push("/datos")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black text-white p-4 md:p-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-6 border-t-4 border-yellow-400 pt-5">
                    <p className="text-xs font-bold text-yellow-400 tracking-[0.3em] uppercase mb-1">
                        FICCT — U.A.G.R.M.
                    </p>
                    <h1 className="text-2xl font-black text-white">
                        Descargar <span className="text-yellow-400">Documentos</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Paso 4 de 4 — Descargá tu solicitud de caso especial
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex gap-2 mb-8">
                    {["Datos", "Malla", "Carta", "Descarga"].map((paso, i) => (
                        <div key={paso} className="flex-1 text-center">
                            <div className="h-1.5 rounded-full mb-1 bg-yellow-400" />
                            <span className="text-xs text-yellow-400 font-semibold">{paso}</span>
                        </div>
                    ))}
                </div>

                {/* Resumen final */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-6">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Resumen</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                            <span className="text-zinc-500">Estudiante:</span>
                            <span className="text-white font-semibold ml-2">{datos.nombre}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500">Registro:</span>
                            <span className="text-white font-semibold ml-2">{datos.registro}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500">PPA:</span>
                            <span className="text-yellow-400 font-black ml-2 text-lg">{datos.ppa}</span>
                        </div>
                        <div>
                            <span className="text-zinc-500">Gestión:</span>
                            <span className="text-white font-semibold ml-2">{datos.gestion}</span>
                        </div>
                    </div>

                    {/* Materias */}
                    <div className="border-t border-zinc-800 pt-4">
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Materias — Caso Especial</p>
                        {materiasCaso.map((m, i) => (
                            <div key={m.sigla} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
                                <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-black">{i + 1}</span>
                                <span className="flex-1 text-white text-sm">{m.nombre}</span>
                                <span className="text-yellow-400 font-mono text-xs">{m.sigla}</span>
                                <span className="bg-zinc-800 text-green-400 text-xs font-bold px-2 py-0.5 rounded">Grupo: {m.grupo}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTONES DE DESCARGA */}
                <div className="flex flex-col gap-4 mb-8">
                    <button
                        onClick={imprimirCarta}
                        className="w-full py-5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl transition-all transform hover:scale-[1.02] shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-3"
                    >
                        <span className="text-2xl">📄</span>
                        DESCARGAR / IMPRIMIR CARTA
                    </button>

                    <button
                        onClick={() => router.push("/carta")}
                        className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold border border-zinc-700 transition flex items-center justify-center gap-2"
                    >
                        👁 Volver a ver la carta
                    </button>

                    <button
                        onClick={nuevaSolicitud}
                        className="w-full py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold border border-zinc-800 transition flex items-center justify-center gap-2"
                    >
                        🔄 Nueva Solicitud
                    </button>
                </div>

                <p className="text-center text-zinc-600 text-xs">
                    Al imprimir la carta, seleccioná "Guardar como PDF" en el cuadro de impresión para obtener el archivo.
                </p>
            </div>

            {/* CARTA OCULTA para imprimir */}
            <div id="carta-print" className="hidden">
                <p style={{ textAlign: "right", marginBottom: "2em", color: "#555" }}>
                    Santa Cruz de la Sierra, {fechaLarga}
                </p>

                <p style={{ fontWeight: "bold" }}>Señor</p>
                <p>{carreraInfo.director}</p>
                <p style={{ fontWeight: "600" }}>DIRECTOR DE CARRERA – {carreraInfo.nombre.toUpperCase()}</p>
                <p>F.I.C.C.T.- U.A.G.R.M.</p>
                <p style={{ marginBottom: "2em" }}>Presente:</p>

                <p style={{ textAlign: "center", fontWeight: "bold", textDecoration: "underline", letterSpacing: "0.05em", marginBottom: "2em" }}>
                    Ref.: SOLICITUD DE CASO ESPECIAL
                </p>

                <p style={{ marginBottom: "1em" }}>Distinguido Director:</p>

                <p style={{ textAlign: "justify", marginBottom: "1em" }}>
                    Mediante la presente, tengo a bien dirigirme a su autoridad para solicitar mi adición
                    de materias a través de caso especial, puesto que tengo inscritas{" "}
                    <strong>{datos.materiasInscritas || "___"} materias</strong> y
                    necesito adicionar como caso especial un total de{" "}
                    <strong>{materiasCaso.length} materia{materiasCaso.length !== 1 ? "s" : ""}</strong>{" "}
                    en la presente gestión <strong>{datos.gestion}</strong>.
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
                    Sin otro particular me despido con un saludo a usted atentamente:
                </p>

                <div className="firma">
                    <p><strong>Univ.:</strong> {datos.nombre}</p>
                    <p><strong>Reg.:</strong> {datos.registro}</p>
                    <p><strong>C.I.:</strong> {datos.ci}</p>
                    <p><strong>Cel.</strong> {datos.celular}</p>
                </div>
            </div>
        </div>
    )
}
