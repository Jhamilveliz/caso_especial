"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { useCasoEspecial } from "@/lib/store"
import { mallas } from "@/data/mallas"
import { containerStagger, fadeUp } from "@/components/motion"

/* =========================
   CONFIG CARRERAS
========================= */

const CARRERA_INFO: Record<string, { director: string; nombre: string; codigo: string }> = {
    "Informática": { director: "Msc. José Junior Villagómez Melgar", nombre: "INGENIERÍA INFORMÁTICA", codigo: "187-3" },
    "Informática 187-6": { director: "Msc. José Junior Villagómez Melgar", nombre: "INGENIERÍA INFORMÁTICA", codigo: "187-6" },
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

    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos")
    }, [datos.nombre, router])

    const mapaCarrera: Record<string, string> = {
        "Informática": "informatica_187_3",
        "Informática 187-6": "informatica_187_6",
        "Sistemas": "sistemas_187_4",
        "Redes": "redes_187_5",
        "Robótica": "robotica_323_0",
    }
    const mallaKey = mapaCarrera[datos.carrera]
    const mallaCarrera = mallaKey ? (mallas as any)[mallaKey] : null
    const semestres = mallaCarrera?.troncal ?? []

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

    const hoy = new Date()
    const dia = hoy.getDate()
    const mes = hoy.toLocaleDateString("es-BO", { month: "long" })
    const año = hoy.getFullYear()
    const fechaLarga = `${dia} de ${mes} de ${año}`
    const ciudad = "Santa Cruz"

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen w-full flex justify-center px-4 md:px-8 py-8"
        >
            <motion.div
                variants={containerStagger}
                initial="hidden"
                animate="show"
                className="max-w-4xl w-full mx-auto"
            >
                {/* Header */}
                <motion.div variants={fadeUp} className="mb-6">
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded mb-3 tracking-widest uppercase"
                    >
                        FICCT — U.A.G.R.M.
                    </motion.div>
                    <motion.h1 variants={fadeUp} className="text-xl sm:text-2xl font-bold text-gray-900">
                        Vista Previa de la{" "}
                        <motion.span
                            className="text-red-700 inline-block"
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Carta
                        </motion.span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-gray-500 text-sm mt-1">
                        Paso 3 de 4 — Revisá los datos antes de descargar
                    </motion.p>
                </motion.div>

                {/* Indicador de pasos */}
                <motion.div variants={fadeUp} className="flex gap-2 mb-7">
                    {PASOS.map((paso, i) => (
                        <div key={paso} className="flex-1 relative">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{
                                    scaleX: 1,
                                    background: i <= 2 ? "#dc2626" : "#e5e7eb",
                                }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="h-1 rounded-full mb-1 origin-left"
                            />
                            <motion.span
                                animate={{
                                    color: i <= 2 ? "#dc2626" : "#9ca3af",
                                    scale: i === 2 ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-xs font-medium inline-block"
                            >
                                {paso}
                            </motion.span>
                        </div>
                    ))}
                </motion.div>

                {/* RESUMEN */}
                <motion.div
                    variants={containerStagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
                >
                    {[
                        { label: "Estudiante", value: datos.nombre },
                        { label: "Registro", value: datos.registro },
                        { label: "PPA", value: datos.ppa, highlight: true },
                        { label: "Gestión", value: datos.gestion },
                    ].map(item => (
                        <motion.div
                            key={item.label}
                            variants={fadeUp}
                            whileHover={{ y: -3 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            className={`rounded-xl p-4 border ${item.highlight
                                ? "bg-blue-50 border-blue-200"
                                : "bg-white border-gray-200 shadow-sm"
                                }`}
                        >
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                            <div className={`font-bold text-sm ${item.highlight ? "text-blue-800 text-xl" : "text-gray-900"}`}>
                                {item.value || "—"}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Materias caso especial */}
                <motion.div
                    variants={fadeUp}
                    className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                    <motion.div
                        variants={fadeUp}
                        className="px-5 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="inline-block w-2 h-2 rounded-full bg-red-600"
                        />
                        <span className="text-red-700 font-bold text-sm">Materias — Caso Especial</span>
                    </motion.div>
                    {materiasCaso.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-5 text-gray-500 text-sm"
                        >
                            No hay materias marcadas como caso especial.
                        </motion.div>
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
                                    <AnimatePresence initial={false}>
                                        {materiasCaso.map((m, i) => (
                                            <motion.tr
                                                key={m.sigla}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: i * 0.05, type: "spring", stiffness: 280, damping: 24 }}
                                                className="border-b border-gray-100 last:border-0"
                                            >
                                                <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                                                <td className="px-5 py-3 text-gray-900 font-medium">{m.nombre}</td>
                                                <td className="px-5 py-3 text-blue-800 font-mono font-semibold">{m.sigla}</td>
                                                <td className="px-5 py-3 text-red-700 font-bold">{m.grupo}</td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* CARTA FORMAL */}
                <motion.div variants={fadeUp} className="mb-8">
                    <motion.h2
                        variants={fadeUp}
                        className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3"
                    >
                        📄 Carta generada
                    </motion.h2>
                    <motion.div
                        variants={fadeUp}
                        whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(0,0,0,0.10)" }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        id="carta-imprimible"
                        className="bg-white text-black rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8 md:p-12 text-sm leading-relaxed overflow-x-auto"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        {/* Fecha y ciudad */}
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
                            de materias a través de caso especial, puesto que tengo inscritas{" "}
                            <strong>{Object.values(estadoMaterias).filter(e => e === "inscrita").length}</strong>{" "}
                            asignaturas y necesito adicionar como caso especial un total de{" "}
                            <strong>{materiasCaso.length} materia{materiasCaso.length !== 1 ? "s" : ""}</strong>{" "}
                            porque {datos.motivo || "motivos justificando la razón por la que quiero hacer caso especial"}{" "}
                            en la presente gestión <strong>{datos.gestion}</strong>.
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
                    </motion.div>
                </motion.div>

                {/* Botones */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/malla")}
                        className="flex-1 py-2.5 rounded-md bg-white text-gray-600 font-semibold border border-gray-300 transition text-sm"
                    >
                        ← Volver a Malla
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "#1e3a8a" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/descarga")}
                        className="flex-1 py-3 rounded-md bg-blue-800 text-white font-bold text-sm"
                    >
                        Continuar → Descargar
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
