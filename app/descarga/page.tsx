"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useCasoEspecial } from "@/lib/store";
import { mallas, Materia, Semestre } from "@/data/mallas";
import { containerStagger, fadeUp } from "@/components/motion";
import DownloadButton from "@/components/DownloadButton";

/* =========================
   CONFIGURACIÓN DE CARRERAS
========================= */

const CARRERA_INFO: Record<string, { director: string; nombre: string }> = {
    Informática: {
        director: "Msc. José Junior Villagómez Melgar",
        nombre: "INGENIERÍA INFORMÁTICA",
    },
    "Informática 187-6": {
        director: "Msc. José Junior Villagómez Melgar",
        nombre: "INGENIERÍA INFORMÁTICA (Plan 187-6)",
    },
    Sistemas: {
        director: "Msc. Leonardo Vargas Peña",
        nombre: "INGENIERÍA EN SISTEMAS",
    },
    Redes: {
        director: "Msc. Jorge Marcelo Rosales Fuentes",
        nombre: "INGENIERÍA EN REDES Y TELECOMUNICACIONES",
    },
    Robótica: {
        director: "Msc. José Junior Villagómez Melgar",
        nombre: "INGENIERÍA EN ROBÓTICA",
    },
};

const PASOS = ["Datos", "Malla", "Carta", "Descarga"];

function getSemestres(carreraId: string): Semestre[] {
    const mapaCarrera: Record<string, string> = {
        Informática: "informatica_187_3",
        "Informática 187-6": "informatica_187_6",
        Sistemas: "sistemas_187_4",
        Redes: "redes_187_5",
        Robótica: "robotica_323_0",
    };
    const key = mapaCarrera[carreraId];
    if (!key) return [];
    const carrera = (mallas as any)[key];
    return carrera?.troncal ?? [];
}

// Colores para cada estado (fondo, borde, texto)
const ESTADO_STYLES: Record<
    string,
    { bg: string; border: string; text: string; label: string }
> = {
    aprobada: {
        bg: "#fef9c3",
        border: "#ca8a04",
        text: "#713f12",
        label: "Aprobada",
    },
    inscrita: {
        bg: "#dcfce7",
        border: "#16a34a",
        text: "#14532d",
        label: "Inscrita",
    },
    caso: {
        bg: "#fee2e2",
        border: "#dc2626",
        text: "#7f1d1d",
        label: "Caso Esp.",
    },
    pendiente: {
        bg: "#f3f4f6",
        border: "#9ca3af",
        text: "#4b5563",
        label: "Pendiente",
    },
};

/* =========================================
   GENERADOR DE HTML PARA LA CARTA (PDF)
   (Espaciado y márgenes mejorados)
========================================= */
function generarHTMLCarta(
    datos: any,
    carreraInfo: any,
    materiasCaso: any[],
    fechaLarga: string,
    totalInscritas: number
): string {
    const filasTabla = materiasCaso
        .map((m, i) => {
            return `
        <tr>
          <td style="border:1px solid #000;padding:10px 12px;text-align:center;width:8%;">${i + 1}</td>
          <td style="border:1px solid #000;padding:10px 12px;width:54%;">${m.nombre}</td>
          <td style="border:1px solid #000;padding:10px 12px;width:18%;font-family:'Courier New',monospace;">${m.sigla}</td>
          <td style="border:1px solid #000;padding:10px 12px;width:20%;font-weight:bold;text-align:center;">${m.grupo}</td>
        </tr>`;
        })
        .join("");

    return `
    <div style="font-family:'Times New Roman',serif;font-size:11.5pt;line-height:1.75;color:#000;max-width:700px;margin:0 auto;padding:10px 0;">
      <!-- Fecha -->
      <p style="text-align:right;margin:0 0 36px 0;">Santa Cruz, ${fechaLarga}</p>

      <!-- Encabezado Destinatario -->
      <div style="margin-bottom:32px;line-height:1.6;">
        <p style="margin:0;font-weight:bold;">Señor</p>
        <p style="margin:0;">${carreraInfo.director}</p>
        <p style="margin:0;font-weight:bold;">DIRECTOR DE CARRERA – ${carreraInfo.nombre}</p>
        <p style="margin:0;">F.I.C.C.T. - U.A.G.R.M.</p>
        <p style="margin:8px 0 0 0;">Presente:-</p>
      </div>

      <!-- Referencia -->
      <p style="text-align:center;font-weight:bold;text-decoration:underline;margin:0 0 32px 0;letter-spacing:0.5px;">
        Ref.: SOLICITUD DE CASO ESPECIAL
      </p>

      <!-- Saludo -->
      <p style="margin:0 0 20px 0;">Distinguido Director:</p>

      <!-- Cuerpo del texto -->
      <p style="text-align:justify;margin:0 0 20px 0;text-indent:30px;">
        Mediante la presente, tengo a bien dirigirme a su autoridad para solicitar mi adición de materias
        a través de caso especial, puesto que tengo inscritas <strong>${totalInscritas}</strong> asignaturas y necesito
        adicionar como caso especial un total de <strong>${materiasCaso.length} materia${materiasCaso.length !== 1 ? "s" : ""
        }</strong> porque ${datos.motivo || "motivos justificando la razón por la que quiero hacer caso especial"}
        en la presente gestión <strong>${datos.gestion}</strong>.
      </p>

      <p style="margin:0 0 16px 0;">
        Para tal efecto, detallo a continuación las materias que solicito sean adicionadas:
      </p>

      <p style="margin:0 0 16px 0;font-weight:bold;">
        TENGO UN PPA: ${datos.ppa}
      </p>

      <p style="margin:0 0 16px 0;">
        Materias a inscribir en el semestre <strong>${datos.gestion}</strong> por caso especial:
      </p>

      <!-- Tabla -->
      <table style="width:100%;border-collapse:collapse;margin:0 0 36px 0;font-size:11pt;">
        <thead>
          <tr>
            <th style="border:1px solid #000;padding:10px 12px;text-align:center;font-weight:bold;background:#f0f0f0;">N°</th>
            <th style="border:1px solid #000;padding:10px 12px;text-align:left;font-weight:bold;background:#f0f0f0;">NOMBRE DE MATERIA</th>
            <th style="border:1px solid #000;padding:10px 12px;text-align:left;font-weight:bold;background:#f0f0f0;">SIGLA</th>
            <th style="border:1px solid #000;padding:10px 12px;text-align:left;font-weight:bold;background:#f0f0f0;">GRUPO</th>
          </tr>
        </thead>
        <tbody>${filasTabla}</tbody>
      </table>

      <!-- Despedida -->
      <p style="margin:0 0 80px 0;">
        Sin otro particular, me despido con un saludo a usted atentamente:
      </p>

      <!-- Firma -->
      <div style="text-align:center;margin:0 0 12px 0;">
        <div style="border-top:1px solid #000;width:240px;margin:0 auto 12px auto;"></div>
      </div>
      <div style="font-size:10.5pt;line-height:1.6;margin:0 0 24px 0;text-align:center;">
        <p style="margin:0 0 3px 0;"><strong>Univ.:</strong> ${datos.nombre}</p>
        <p style="margin:0 0 3px 0;"><strong>Reg.:</strong> ${datos.registro}</p>
        <p style="margin:0 0 3px 0;"><strong>C.I.:</strong> ${datos.ci}</p>
        <p style="margin:0 0 3px 0;"><strong>Cel.:</strong> ${datos.celular || ""}</p>
      </div>
    </div>
  `;
}
/* =========================================
   GENERADOR DE HTML PARA LA MALLA (PDF)
   (Diseño horizontal con bloques de 4 columnas)
========================================= */
function generarHTMLMalla(
    datos: any,
    carreraInfo: any,
    semestres: Semestre[],
    estadoMaterias: any,
    gruposMaterias: any,
    fechaLarga: string
): string {
    // Orden descendente (de 9no a 1ro)
    const semestresOrdenados = [...semestres].sort(
        (a, b) => b.semestre - a.semestre
    );
    const SEM_LABEL: Record<number, string> = {
        9: "9no",
        8: "8vo",
        7: "7mo",
        6: "6to",
        5: "5to",
        4: "4to",
        3: "3ro",
        2: "2do",
        1: "1ro",
    };
    const maxMaterias = Math.max(...semestres.map((s) => s.materias.length), 1);

    const filas = semestresOrdenados
        .map((sem, semIdx) => {
            const celdas = Array.from({ length: maxMaterias })
                .map((_, idx) => {
                    const mat: Materia | undefined = sem.materias[idx];
                    if (!mat) {
                        return `<td style="border:1px solid #e5e7eb;padding:4px;background:#fafafa;"></td>`;
                    }
                    const estado = estadoMaterias[mat.sigla] || "pendiente";
                    const style = ESTADO_STYLES[estado];
                    const grupo = gruposMaterias[mat.sigla]
                        ? `<div style="font-size:6pt;font-weight:700;color:#1e293b;margin-top:2px;">Grupo: ${gruposMaterias[mat.sigla]}</div>`
                        : "";
                    return `
            <td style="border:1px solid #e5e7eb;padding:4px;vertical-align:top;background:${style.bg};">
              <div style="border:1px solid ${style.border};border-radius:4px;padding:4px 5px;min-height:42px;">
                <div style="font-weight:800;font-size:8pt;color:${style.text};font-family:'Courier New',monospace;">${mat.sigla}</div>
                <div style="font-size:6.5pt;color:${style.text};opacity:0.9;line-height:1.25;margin-top:2px;">${mat.nombre}</div>
                ${grupo}
              </div>
            </td>`;
                })
                .join("");

            return `
        <tr>
          <td style="width:38px;background:${semIdx % 2 === 0 ? "#eff6ff" : "#e0edff"};border:1px solid #e5e7eb;text-align:center;vertical-align:middle;padding:4px 2px;">
            <div style="font-weight:900;font-size:11pt;color:#1d4ed8;">${SEM_LABEL[sem.semestre] ?? sem.semestre}</div>
            <div style="font-size:6pt;color:#93c5fd;font-weight:600;text-transform:uppercase;">Sem</div>
          </td>
          ${celdas}
        </tr>`;
        })
        .join("");

    // Leyenda de colores
    const leyenda = Object.entries(ESTADO_STYLES)
        .map(
            ([key, style]) => `
      <div style="display:flex;align-items:center;gap:4px;">
        <div style="width:11px;height:11px;background:${style.bg};border:1px solid ${style.border};border-radius:2px;"></div>
        <span style="font-size:7.5pt;color:#374151;">${style.label}</span>
      </div>`
        )
        .join("");

    return `
    <div style="font-family:system-ui, -apple-system, sans-serif;font-size:9pt;color:#111827;padding:0;">
      <!-- Encabezado -->
      <div style="text-align:center;margin-bottom:10px;">
        <div style="font-size:8pt;font-weight:700;color:#1d4ed8;letter-spacing:1px;">FICCT — U.A.G.R.M.</div>
        <div style="font-size:14pt;font-weight:900;color:#111827;">MALLA CURRICULAR</div>
        <div style="font-size:12pt;font-weight:700;color:#dc2626;">${carreraInfo.nombre}</div>
        <div style="font-size:8pt;color:#6b7280;margin-top:4px;">
          ${datos.nombre} &nbsp;·&nbsp; Reg. ${datos.registro} &nbsp;·&nbsp; PPA ${datos.ppa} &nbsp;·&nbsp; Gestión ${datos.gestion}
        </div>
      </div>

      <!-- Materia de titulación (opcional) -->
      <div style="display:flex;justify-content:center;margin-bottom:8px;">
        <div style="background:#fff;border:1px solid #d1d5db;border-radius:4px;padding:3px 14px;font-size:8pt;font-weight:700;color:#374151;">
          GRL001 — Modal. de Titulación
        </div>
      </div>

      <!-- Tabla de semestres -->
      <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
        <tbody>${filas}</tbody>
      </table>

      <!-- Leyenda -->
      <div style="display:flex;justify-content:center;gap:16px;margin-top:10px;flex-wrap:wrap;">
        ${leyenda}
      </div>

      <!-- Pie -->
      <div style="text-align:center;font-size:7pt;color:#9ca3af;margin-top:8px;">
        Generado: ${fechaLarga}
      </div>
    </div>
  `;
}

/* =========================================
   COMPONENTE PRINCIPAL
========================================= */
export default function DescargaPage() {
    const router = useRouter();
    const { datos, estadoMaterias, gruposMaterias, resetAll } = useCasoEspecial();

    useEffect(() => {
        if (!datos.nombre.trim()) router.replace("/datos");
    }, [datos.nombre, router]);

    const semestres = getSemestres(datos.carrera);

    // Materias marcadas como "caso"
    const materiasCaso = Object.entries(estadoMaterias)
        .filter(([, e]) => e === "caso")
        .map(([sigla]) => {
            let nombreMateria = sigla;
            for (const sem of semestres) {
                const mat = sem.materias.find((m: Materia) => m.sigla === sigla);
                if (mat) {
                    nombreMateria = mat.nombre;
                    break;
                }
            }
            return { sigla, nombre: nombreMateria, grupo: gruposMaterias[sigla] ?? "—" };
        });

    const totalInscritas = Object.values(estadoMaterias).filter(
        (e) => e === "inscrita"
    ).length;

    const carreraInfo =
        CARRERA_INFO[datos.carrera] ?? {
            director: "Director de Carrera",
            nombre: datos.carrera.toUpperCase(),
        };

    const hoy = new Date();
    const fechaLarga = hoy.toLocaleDateString("es-BO", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // ── Descarga PDF usando jsPDF + html2canvas ──
    const lastRequest = useRef(0);

    const descargarPDF = async (
        htmlContent: string,
        nombreArchivo: string,
        landscape = false
    ) => {
        const req = ++lastRequest.current;
        const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
            import("jspdf"),
            import("html2canvas"),
        ]);

        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = "-9999px";
        container.style.top = "0";
        container.style.width = landscape ? "1056px" : "816px";
        container.style.background = "#ffffff";
        container.style.padding = landscape ? "28px 32px" : "56px 72px";
        container.style.boxSizing = "border-box";
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
            });

            if (req !== lastRequest.current) return;

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: landscape ? "landscape" : "portrait",
                unit: "pt",
                format: "letter",
            });

            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const ratio = canvas.height / canvas.width;
            const imgW = pageW;
            const imgH = pageW * ratio;

            if (imgH <= pageH) {
                pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
            } else {
                const scaledH = pageH;
                const scaledW = pageH / ratio;
                const xOffset = (pageW - scaledW) / 2;
                pdf.addImage(imgData, "PNG", xOffset, 0, scaledW, scaledH);
            }

            pdf.save(nombreArchivo);
        } finally {
            document.body.removeChild(container);
        }
    };

    const handleDescargarCarta = async () => {
        const html = generarHTMLCarta(
            datos,
            carreraInfo,
            materiasCaso,
            fechaLarga,
            totalInscritas
        );
        await descargarPDF(
            html,
            `carta-caso-especial-${datos.registro || "solicitud"}.pdf`,
            false
        );
    };

    const handleDescargarMalla = async () => {
        const html = generarHTMLMalla(
            datos,
            carreraInfo,
            semestres,
            estadoMaterias,
            gruposMaterias,
            fechaLarga
        );
        await descargarPDF(
            html,
            `malla-${datos.carrera.toLowerCase().replace(/\s+/g, "-")}-${datos.registro || "malla"
            }.pdf`,
            true
        );
    };

    const nuevaSolicitud = () => {
        resetAll();
        router.push("/datos");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen w-full flex justify-center px-4 md:px-8 py-8 bg-slate-50"
        >
            <motion.div
                variants={containerStagger}
                initial="hidden"
                animate="show"
                className="max-w-3xl w-full mx-auto"
            >
                {/* ── BADGE + TÍTULO ── */}
                <motion.div variants={fadeUp} className="mb-6">
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 bg-blue-800 text-white text-xs font-semibold px-3 py-1 rounded-md mb-3 tracking-widest uppercase"
                    >
                        FICCT — U.A.G.R.M.
                    </motion.div>
                    {/* ── REQUISITOS A ADJUNTAR (COMPACTO Y NEUTRO) ── */}
                    <motion.div
                        variants={fadeUp}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6"
                    >
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                            <span>📌</span> Adjuntar en otra hoja al presentar:
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-700 font-medium">
                            <div className="flex items-center gap-1.5">
                                <span className="text-red-700 font-bold">a)</span>
                                <span>Boleta de inscripción actual</span>
                            </div>
                            <span className="text-gray-300 hidden md:inline">•</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-red-700 font-bold">b)</span>
                                <span>Avance académico</span>
                            </div>
                            <span className="text-gray-300 hidden md:inline">•</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-red-700 font-bold">c)</span>
                                <span>Fotocopia de C.I.</span>
                            </div>
                            <span className="text-gray-300 hidden md:inline">•</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-red-700 font-bold">d)</span>
                                <span>Malla curricular (resaltada)</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.h1
                        variants={fadeUp}
                        className="text-2xl md:text-3xl font-extrabold text-gray-900"
                    >
                        Descargar{" "}
                        <motion.span
                            className="text-red-700 inline-block"
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Documentos
                        </motion.span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-gray-500 text-sm mt-1">
                        Paso 4 de 4 — Revisá y descargá los archivos generados
                    </motion.p>
                </motion.div>

                {/* ── BARRA DE PROGRESO ── */}
                <motion.div variants={fadeUp} className="flex gap-0 mb-8">
                    {PASOS.map((paso, i) => (
                        <div key={paso} className="flex-1 relative">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{
                                    scaleX: 1,
                                    background: i <= 3 ? "#dc2626" : "#e5e7eb",
                                }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="h-1 rounded-full mb-1 origin-left"
                            />
                            <motion.span
                                animate={{
                                    color: i === 3 ? "#dc2626" : "#9ca3af",
                                    scale: i === 3 ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-xs font-medium inline-block"
                            >
                                {paso}
                            </motion.span>
                        </div>
                    ))}
                </motion.div>

                {/* ── RESUMEN DE LA SOLICITUD ── */}
                <motion.div
                    variants={fadeUp}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6"
                >
                    <motion.div
                        variants={fadeUp}
                        className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4"
                    >
                        Resumen de la solicitud
                    </motion.div>

                    <motion.div
                        variants={containerStagger}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5"
                    >
                        {[
                            { label: "Estudiante", value: datos.nombre },
                            { label: "Registro", value: datos.registro },
                            { label: "PPA", value: datos.ppa, highlight: true },
                            { label: "Gestión", value: datos.gestion },
                            { label: "Celular", value: datos.celular || "—" },
                            { label: "C.I.", value: datos.ci },
                        ].map((item) => (
                            <motion.div key={item.label} variants={fadeUp}>
                                <div className="text-xs text-gray-400">{item.label}</div>
                                <div
                                    className={`text-base font-semibold ${item.highlight ? "text-blue-700 text-2xl" : "text-gray-800"
                                        }`}
                                >
                                    {item.value}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Tabla de materias caso especial */}
                    <motion.div variants={fadeUp} className="border-t border-gray-100 pt-4">
                        <motion.div
                            variants={fadeUp}
                            className="flex items-center gap-2 mb-3"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-red-600"
                            />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Materias — Caso Especial
                            </span>
                        </motion.div>

                        {materiasCaso.length === 0 ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-gray-400"
                            >
                                No hay materias marcadas como caso especial.
                            </motion.p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200">
                                            <th className="pb-2 pr-4">N°</th>
                                            <th className="pb-2 pr-4">Materia</th>
                                            <th className="pb-2 pr-4">Sigla</th>
                                            <th className="pb-2">Grupo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence initial={false}>
                                            {materiasCaso.map((m, i) => (
                                                <motion.tr
                                                    key={m.sigla}
                                                    layout
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    transition={{
                                                        delay: i * 0.04,
                                                        type: "spring",
                                                        stiffness: 280,
                                                        damping: 24,
                                                    }}
                                                    className="border-b border-gray-50 last:border-0"
                                                >
                                                    <td className="py-2 pr-4 text-gray-400">{i + 1}</td>
                                                    <td className="py-2 pr-4 font-medium text-gray-800">
                                                        {m.nombre}
                                                    </td>
                                                    <td className="py-2 pr-4 font-mono text-blue-700 font-bold">
                                                        {m.sigla}
                                                    </td>
                                                    <td className="py-2 text-red-700 font-bold">
                                                        {m.grupo}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* ── BOTONES DE DESCARGA ── */}
                <motion.div
                    variants={containerStagger}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-3"
                >
                    <motion.div variants={fadeUp}>
                        <DownloadButton
                            onDownload={handleDescargarCarta}
                            color="#1d4ed8"
                            icon="📄"
                            label="Descargar Carta de Solicitud (PDF)"
                        />
                    </motion.div>
                    <motion.div variants={fadeUp}>
                        <DownloadButton
                            onDownload={handleDescargarMalla}
                            color="#15803d"
                            icon="📊"
                            label="Descargar Malla Curricular (PDF)"
                        />
                    </motion.div>

                    <motion.button
                        variants={fadeUp}
                        whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/carta")}
                        className="w-full py-3 rounded-lg bg-white border border-gray-300 text-gray-600 font-semibold text-sm transition hover:bg-gray-50"
                    >
                        👁 Volver a ver la carta
                    </motion.button>

                    <motion.button
                        variants={fadeUp}
                        whileHover={{ scale: 1.01, color: "#374151", borderColor: "#d1d5db" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={nuevaSolicitud}
                        className="w-full py-3 rounded-lg bg-white border border-gray-200 text-gray-400 font-semibold text-sm transition hover:text-gray-600 hover:border-gray-300"
                    >
                        🔄 Nueva Solicitud
                    </motion.button>
                </motion.div>

                <motion.p
                    variants={fadeUp}
                    className="text-center text-xs text-gray-400 mt-8"
                >
                    🔒 Los documentos se generan en tu navegador — nada se envía a ningún servidor.
                </motion.p>
            </motion.div>
        </motion.div>
    );
}