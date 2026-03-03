"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial } from "@/lib/store"
import { mallas } from "@/data/mallas"

/* =========================
   CONFIG CARRERAS
========================= */

const CARRERA_INFO: Record<string, { director: string; nombre: string; codigo: string }> = {
    sistemas_187_4: { director: "Msc. Leonardo Vargas Peña", nombre: "Ingeniería en Sistemas", codigo: "187-4" },
    informatica_187_3: { director: "Msc. José Junior Villagómez Melgar", nombre: "Ingeniería Informática", codigo: "187-3" },
    redes_187_5: { director: "Msc. Jorge Marcelo Rosales Fuentes", nombre: "Ingeniería en Redes y Telecomunicaciones", codigo: "187-5" },
    robotica_323_0: { director: "Ing. Junior", nombre: "Ingeniería en Robótica", codigo: "323-0" },
    informatica_menciones: { director: "Msc. José Junior Villagómez Melgar", nombre: "Ingeniería Informática con Menciones", codigo: "188-0" },
}

/* =========================
   COMPONENTE
========================= */

export default function CartaPage() {
    const router = useRouter()
    const { datos, estadoMaterias, gruposMaterias } = useCasoEspecial()

    // Proteger ruta
    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    // Materias caso especial
    const mallaCarrera = (mallas as any)[datos.carrera]
    const semestres = mallaCarrera?.troncal ?? mallaCarrera ?? []

    // Recopilar info de las materias caso especial
    const materiasCaso = Object.entries(estadoMaterias)
        .filter(([, e]) => e === "caso")
        .map(([sigla]) => {
            let nombreMateria = sigla
            for (const sem of semestres) {
                const mat = sem.materias.find((m: any) => m.sigla === sigla)
                if (mat) { nombreMateria = mat.nombre; break }
            }
            return {
                sigla,
                nombre: nombreMateria,
                grupo: gruposMaterias[sigla] ?? "—",
            }
        })

    const carreraInfo = CARRERA_INFO[datos.carrera] ?? {
        director: "Director de Carrera",
        nombre: datos.carrera,
        codigo: ""
    }

    const hoy = new Date()
    const fechaLarga = hoy.toLocaleDateString("es-BO", {
        day: "numeric", month: "long", year: "numeric"
    })
    const ciudad = "Santa Cruz de la Sierra"

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                {/* Header de navegación */}
                <div className="mb-6 border-t-4 border-yellow-400 pt-5">
                    <p className="text-xs font-bold text-yellow-400 tracking-[0.3em] uppercase mb-1">
                        FICCT — U.A.G.R.M.
                    </p>
                    <h1 className="text-2xl font-black text-white">
                        Vista Previa de la <span className="text-yellow-400">Carta</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Paso 3 de 4 — Revisá los datos antes de descargar
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex gap-2 mb-8">
                    {["Datos", "Malla", "Carta", "Descarga"].map((paso, i) => (
                        <div key={paso} className="flex-1 text-center">
                            <div className={`h-1.5 rounded-full mb-1 ${i <= 2 ? "bg-yellow-400" : "bg-zinc-700"}`} />
                            <span className={`text-xs ${i <= 2 ? "text-yellow-400 font-semibold" : "text-zinc-600"}`}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </div>

                {/* RESUMEN */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                        { label: "Estudiante", value: datos.nombre },
                        { label: "Registro", value: datos.registro },
                        { label: "PPA", value: datos.ppa, highlight: true },
                        { label: "Gestión", value: datos.gestion },
                    ].map(item => (
                        <div key={item.label} className={`rounded-xl p-4 border ${item.highlight ? "bg-yellow-400/10 border-yellow-400" : "bg-zinc-900 border-zinc-800"}`}>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{item.label}</div>
                            <div className={`font-black text-sm ${item.highlight ? "text-yellow-400 text-xl" : "text-white"}`}>
                                {item.value || "—"}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Materias caso especial */}
                <div className="mb-8 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                    <div className="px-5 py-3 bg-red-900/30 border-b border-red-900/50 flex items-center gap-2">
                        <span className="text-red-400 font-black">🔴 Materias — Caso Especial</span>
                    </div>
                    {materiasCaso.length === 0 ? (
                        <div className="p-5 text-zinc-500 text-sm">No hay materias marcadas como caso especial.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                                    <th className="px-5 py-3">N°</th>
                                    <th className="px-5 py-3">Materia</th>
                                    <th className="px-5 py-3">Sigla</th>
                                    <th className="px-5 py-3">Grupo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materiasCaso.map((m, i) => (
                                    <tr key={m.sigla} className="border-b border-zinc-800 last:border-0">
                                        <td className="px-5 py-3 text-zinc-400">{i + 1}</td>
                                        <td className="px-5 py-3 text-white font-medium">{m.nombre}</td>
                                        <td className="px-5 py-3 text-yellow-400 font-mono">{m.sigla}</td>
                                        <td className="px-5 py-3 text-green-400 font-bold">{m.grupo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* CARTA FORMAL */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">
                        📄 Carta generada
                    </h2>
                    <div
                        id="carta-imprimible"
                        className="bg-white text-black rounded-2xl p-8 md:p-12 font-serif text-sm leading-relaxed shadow-2xl"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        {/* Fecha y ciudad */}
                        <p className="text-right mb-8 text-gray-600">
                            {ciudad}, {fechaLarga}
                        </p>

                        {/* Destinatario */}
                        <p className="mb-0.5 font-bold">Señor</p>
                        <p className="mb-0.5">{carreraInfo.director}</p>
                        <p className="mb-0.5 font-semibold">DIRECTOR DE CARRERA – {carreraInfo.nombre.toUpperCase()}</p>
                        <p className="mb-0.5">F.I.C.C.T.- U.A.G.R.M.</p>
                        <p className="mb-8">Presente:</p>

                        {/* Referencia */}
                        <p className="mb-8 font-bold underline text-center tracking-wide">
                            Ref.: SOLICITUD DE CASO ESPECIAL
                        </p>

                        {/* Saludo */}
                        <p className="mb-4">Distinguido Director:</p>

                        {/* Cuerpo */}
                        <p className="mb-4 text-justify">
                            Mediante la presente, tengo a bien dirigirme a su autoridad para solicitar mi adición
                            de materias a través de caso especial, puesto que tengo inscritas{" "}
                            <strong>{datos.materiasInscritas || "___"} materias</strong> y
                            necesito adicionar como caso especial un total de{" "}
                            <strong>{materiasCaso.length} materia{materiasCaso.length !== 1 ? "s" : ""}</strong>{" "}
                            en la presente gestión <strong>{datos.gestion}</strong>.
                        </p>

                        {/* PPA */}
                        <p className="mb-6 font-bold">
                            TENGO UN PPA: <span className="underline">{datos.ppa}</span>
                        </p>

                        {/* Lista de materias */}
                        <p className="mb-3">
                            Materias a inscribir en el semestre <strong>{datos.gestion}</strong> por caso especial:
                        </p>
                        <table className="w-full border-collapse mb-6 text-sm">
                            <thead>
                                <tr className="border border-gray-400 bg-gray-100">
                                    <th className="border border-gray-400 px-3 py-1.5 text-left">N°</th>
                                    <th className="border border-gray-400 px-3 py-1.5 text-left">NOMBRE DE MATERIA</th>
                                    <th className="border border-gray-400 px-3 py-1.5 text-left">SIGLA</th>
                                    <th className="border border-gray-400 px-3 py-1.5 text-left">GRUPO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materiasCaso.map((m, i) => (
                                    <tr key={m.sigla} className="border border-gray-400">
                                        <td className="border border-gray-400 px-3 py-1.5">{i + 1}</td>
                                        <td className="border border-gray-400 px-3 py-1.5">{m.nombre}</td>
                                        <td className="border border-gray-400 px-3 py-1.5 font-mono">{m.sigla}</td>
                                        <td className="border border-gray-400 px-3 py-1.5 font-bold">{m.grupo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Cierre */}
                        <p className="mb-12">
                            Sin otro particular me despido con un saludo a usted atentamente:
                        </p>

                        {/* Firma */}
                        <div className="mt-16">
                            <p><strong>Univ.:</strong> {datos.nombre}</p>
                            <p><strong>Reg.:</strong> {datos.registro}</p>
                            <p><strong>C.I.:</strong> {datos.ci}</p>
                            <p><strong>Cel.</strong> {datos.celular}</p>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push("/malla")}
                        className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold border border-zinc-700 transition"
                    >
                        ← Volver a Malla
                    </button>
                    <button
                        onClick={() => router.push("/descarga")}
                        className="flex-1 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-400/20"
                    >
                        Continuar → Descargar
                    </button>
                </div>

            </div>
        </div>
    )
}
