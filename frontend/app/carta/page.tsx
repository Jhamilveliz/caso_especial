"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCasoEspecial } from "@/lib/store"
import { mallas } from "@/data/mallas"

/* =========================
   CONFIG CARRERAS
========================= */

const CARRERA_INFO: Record<string, { director: string; nombre: string; codigo: string }> = {
    "Informática": { director: "Msc. José Junior Villagómez Melgar", nombre: "INGENIERÍA INFORMÁTICA", codigo: "187-3" },
    "Sistemas": { director: "Msc. Leonardo Vargas Peña", nombre: "INGENIERÍA EN SISTEMAS", codigo: "187-4" },
    "Redes": { director: "Msc. Jorge Marcelo Rosales Fuentes", nombre: "INGENIERÍA EN REDES Y TELECOMUNICACIONES", codigo: "187-5" },
    "Robótica": { director: "Msc. José Junior Villagómez Melgar", nombre: "INGENIERÍA EN ROBÓTICA", codigo: "323-0" },
}

const PASOS = ["Datos", "Malla", "Carta", "Descarga"]

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

    // Mapa de carrera → key de mallas
    const mapaCarrera: Record<string, string> = {
        "Informática": "informatica_187_3",
        "Sistemas": "sistemas_187_4",
        "Redes": "redes_187_5",
        "Robótica": "robotica_323_0",
    }
    const mallaKey = mapaCarrera[datos.carrera]
    const mallaCarrera = mallaKey ? (mallas as any)[mallaKey] : null
    const semestres = mallaCarrera?.troncal ?? []

    // Recopilar info de las materias caso especial
    const materiasCaso = Object.entries(estadoMaterias)
        .filter(([, e]) => e === "caso")
        .map(([sigla]) => {
            let nombreMateria = sigla
            for (const sem of semestres) {
                const mat = sem.materias.find((m: any) => m.sigla === sigla)
                if (mat) {
                    nombreMateria = mat.nombre
                    break
                }
            }
            return {
                sigla,
                nombre: nombreMateria,
                grupo: gruposMaterias[sigla] ?? "—",
            }
        })

    const carreraInfo = CARRERA_INFO[datos.carrera] ?? {
        director: "Director de Carrera",
        nombre: datos.carrera.toUpperCase(),
        codigo: ""
    }

    // Determinar el semestre del estudiante (esto deberías calcularlo según las materias aprobadas)
    // Por ahora usamos un valor por defecto
    const semestreEstudiante = "cuarto semestre"

    const hoy = new Date()
    const dia = hoy.getDate()
    const mes = hoy.toLocaleDateString("es-BO", { month: "long" })
    const año = hoy.getFullYear()
    const fechaLarga = `${dia} de ${mes} de ${año}`
    const ciudad = "Santa Cruz"

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded mb-3 tracking-widest uppercase">
                        FICCT — U.A.G.R.M.
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Vista Previa de la{" "}
                        <span className="text-red-700">Carta</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Paso 3 de 4 — Revisá los datos antes de descargar
                    </p>
                </div>

                {/* Indicador de pasos */}
                <div className="flex gap-2 mb-7">
                    {PASOS.map((paso, i) => (
                        <div key={paso} className="flex-1">
                            <div className={`h-1 rounded-full mb-1 ${i <= 2 ? "bg-red-600" : "bg-gray-200"}`} />
                            <span className={`text-xs font-medium ${i <= 2 ? "text-red-600" : "text-gray-400"}`}>
                                {paso}
                            </span>
                        </div>
                    ))}
                </div>

                {/* RESUMEN */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Estudiante", value: datos.nombre },
                        { label: "Registro", value: datos.registro },
                        { label: "PPA", value: datos.ppa, highlight: true },
                        { label: "Gestión", value: datos.gestion },
                    ].map(item => (
                        <div key={item.label} className={`rounded-xl p-4 border ${item.highlight
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 shadow-sm"
                            }`}>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                            <div className={`font-bold text-sm ${item.highlight ? "text-blue-800 text-xl" : "text-gray-900"}`}>
                                {item.value || "—"}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Materias caso especial */}
                {/* Tabla de materias caso especial — con scroll horizontal en mobile */}
                <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
                        <span className="text-red-700 font-bold text-sm">🔴 Materias — Caso Especial</span>
                    </div>
                    {materiasCaso.length === 0 ? (
                        <div className="p-5 text-gray-500 text-sm">No hay materias marcadas como caso especial.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[400px]">
                                <thead>
                                    <tr className="text-left text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200 bg-gray-50">
                                        <th className="px-5 py-3">N°</th>
                                        <th className="px-5 py-3">Materia</th>
                                        <th className="px-5 py-3">Sigla</th>
                                        <th className="px-5 py-3">Grupo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materiasCaso.map((m, i) => (
                                        <tr key={m.sigla} className="border-b border-gray-100 last:border-0">
                                            <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                                            <td className="px-5 py-3 text-gray-900 font-medium">{m.nombre}</td>
                                            <td className="px-5 py-3 text-blue-800 font-mono font-semibold">{m.sigla}</td>
                                            <td className="px-5 py-3 text-red-700 font-bold">{m.grupo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* CARTA FORMAL */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                        📄 Carta generada
                    </h2>
                    {/* Carta formal — con scroll horizontal si la pantalla es muy pequeña */}
                    <div
                        id="carta-imprimible"
                        className="bg-white text-black rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8 md:p-12 text-sm leading-relaxed overflow-x-auto"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        {/* Fecha y ciudad - Formato: Santa Cruz, 04 de marzo de 2026 */}
                        <p className="text-right mb-8 text-gray-600">
                            {ciudad}, {fechaLarga}
                        </p>

                        {/* Destinatario */}
                        <p className="mb-0.5 font-bold">Señor</p>
                        <p className="mb-0.5">{carreraInfo.director}</p>
                        <p className="mb-0.5 font-semibold">DIRECTOR DE CARRERA – {carreraInfo.nombre}</p>
                        <p className="mb-0.5">F.I.C.C.T. - U.A.G.R.M.</p>
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
                            de materias a través de caso especial. Necesito adicionar como caso especial un total de{" "}
                            <strong>{materiasCaso.length} materia{materiasCaso.length !== 1 ? "s" : ""}</strong>{" "}
                            para la presente gestión <strong>{datos.gestion}</strong>.
                        </p>

                        <p className="mb-4 text-justify">
                            El motivo de mi solicitud es la nivelación académica en la carrera de {carreraInfo.nombre}.
                            Busco regularizar mi avance curricular para completar las materias pendientes de mi
                            malla en el menor tiempo posible, evitando así cualquier desfase de requisitos y
                            asegurando la continuidad de mis estudios de manera regular.
                        </p>

                        <p className="mb-4">
                            Para tal efecto, detallo a continuación las materias que solicito sean adicionadas:
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
                            Sin otro particular, me despido con un saludo a usted atentamente:
                        </p>

                        {/* Firma */}
                        <div className="mt-16">
                            <p><strong>Univ.:</strong> {datos.nombre}</p>
                            <p><strong>Reg.:</strong> {datos.registro}</p>
                            <p><strong>C.I.:</strong> {datos.ci}</p>
                            <p><strong>Cel.:</strong> {datos.celular || "[Tu Número de Celular]"}</p>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push("/malla")}
                        className="flex-1 py-2.5 rounded-md bg-white hover:bg-gray-50 text-gray-600 font-semibold border border-gray-300 transition text-sm"
                    >
                        ← Volver a Malla
                    </button>
                    <button
                        onClick={() => router.push("/descarga")}
                        className="flex-1 py-3 rounded-md bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm transition-all"
                    >
                        Continuar → Descargar
                    </button>
                </div>

            </div>
        </div>
    )
}