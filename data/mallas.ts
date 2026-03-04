/* =========================
   TIPOS
========================= */

export interface Materia {
    nombre: string
    sigla: string
    prerequisitos?: string[]  // Array de siglas que son prerrequisitos
}

export interface Semestre {
    semestre: number
    materias: Materia[]
}

export interface Mencion {
    nombre: string
    semestres: Semestre[]
}

export interface Carrera {
    codigo: string
    nombre: string
    troncal: Semestre[]
    menciones?: Record<string, Mencion>
}

/* =========================
   MALLAS CURRICULARES
========================= */

export const mallas = {
    // INGENIERÍA EN SISTEMAS (187-4)
    sistemas_187_4: {
        codigo: "187-4",
        nombre: "Ingeniería en Sistemas",
        troncal: [
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Estructuras Discretas", sigla: "INF119" },
                    { nombre: "Introducción a la Informática", sigla: "INF110" },
                    { nombre: "Física I", sigla: "FIS100" },
                    { nombre: "Inglés Técnico I", sigla: "LIN100" },
                ]
            },
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Álgebra Lineal", sigla: "MAT103" },
                    { nombre: "Programación I", sigla: "INF120", prerequisitos: ["INF110"] },
                    { nombre: "Física II", sigla: "FIS102", prerequisitos: ["FIS100"] },
                    { nombre: "Inglés Técnico II", sigla: "LIN101", prerequisitos: ["LIN100"] },
                ]
            },
            {
                semestre: 3,
                materias: [
                    { nombre: "Ecuaciones Diferenciales", sigla: "MAT207", prerequisitos: ["MAT102"] },
                    { nombre: "Programación II", sigla: "INF210", prerequisitos: ["INF120"] },
                    { nombre: "Arquitectura de Computadoras", sigla: "INF211" },
                    { nombre: "Física III", sigla: "FIS200", prerequisitos: ["FIS102"] },
                    { nombre: "Administración", sigla: "ADM100" },
                ]
            },
            {
                semestre: 4,
                materias: [
                    { nombre: "Probabilidad y Estadística I", sigla: "MAT202", prerequisitos: ["MAT102"] },
                    { nombre: "Métodos Numéricos", sigla: "MAT205", prerequisitos: ["MAT207"] },
                    { nombre: "Estructura de Datos I", sigla: "INF220", prerequisitos: ["INF210"] },
                    { nombre: "Programación Ensamblador", sigla: "INF221", prerequisitos: ["INF211"] },
                    { nombre: "Contabilidad", sigla: "ADM200" },
                ]
            },
            {
                semestre: 5,
                materias: [
                    { nombre: "Probabilidad y Estadística II", sigla: "MAT302", prerequisitos: ["MAT202"] },
                    { nombre: "Estructura de Datos II", sigla: "INF310", prerequisitos: ["INF220"] },
                    { nombre: "Organización y Métodos", sigla: "ADM330", prerequisitos: ["ADM100"] },
                    { nombre: "Base de Datos I", sigla: "INF312", prerequisitos: ["INF220"] },
                    { nombre: "Economía para la Gestión", sigla: "ECO300" },
                    { nombre: "Administración de Recursos Humanos", sigla: "ELC001" },
                    { nombre: "Costos y Presupuestos", sigla: "ELC002" },
                ]
            },
            {
                semestre: 6,
                materias: [
                    { nombre: "Investigación Operativa I", sigla: "MAT329", prerequisitos: ["MAT302"] },
                    { nombre: "Sistemas Operativos I", sigla: "INF323", prerequisitos: ["INF211"] },
                    { nombre: "Finanzas para la Empresa", sigla: "ADM320", prerequisitos: ["ADM200"] },
                    { nombre: "Sistemas de Información I", sigla: "INF342", prerequisitos: ["INF312"] },
                    { nombre: "Base de Datos II", sigla: "INF322", prerequisitos: ["INF312"] },
                    { nombre: "Producción y Marketing", sigla: "ELC003" },
                    { nombre: "Reingeniería", sigla: "ELC004" },
                ]
            },
            {
                semestre: 7,
                materias: [
                    { nombre: "Investigación Operativa II", sigla: "MAT419", prerequisitos: ["MAT329"] },
                    { nombre: "Redes I", sigla: "INF433", prerequisitos: ["INF323"] },
                    { nombre: "Sistemas Operativos II", sigla: "INF413", prerequisitos: ["INF323"] },
                    { nombre: "Soporte a la Toma de Decisiones", sigla: "INF432", prerequisitos: ["INF342"] },
                    { nombre: "Sistemas de Información II", sigla: "INF412", prerequisitos: ["INF342"] },
                    { nombre: "Ingeniería de la Calidad", sigla: "ELC005" },
                    { nombre: "Benchmarking", sigla: "ELC006" },
                ]
            },
            {
                semestre: 8,
                materias: [
                    { nombre: "Preparación y Eval. de Proyectos", sigla: "ECO449", prerequisitos: ["ADM320", "MAT419"] },
                    { nombre: "Redes II", sigla: "INF423", prerequisitos: ["INF433"] },
                    { nombre: "Auditoría Informática", sigla: "INF462", prerequisitos: ["INF412"] },
                    { nombre: "Sistemas de Inf. Geográfica", sigla: "INF442", prerequisitos: ["INF322"] },
                    { nombre: "Ingeniería de Software I", sigla: "INF422", prerequisitos: ["INF310", "INF322"] },
                    { nombre: "Introducción a la Macroeconomía", sigla: "ELC007" },
                    { nombre: "Legislación en Ciencias de la Computación", sigla: "ELC008" },
                ]
            },
            {
                semestre: 9,
                materias: [
                    { nombre: "Taller de Grado I", sigla: "INF511", prerequisitos: ["INF422", "ECO449"] },
                    { nombre: "Ingeniería de Software II", sigla: "INF512", prerequisitos: ["INF422"] },
                    { nombre: "Tecnología Web", sigla: "INF513", prerequisitos: ["INF422"] },
                    { nombre: "Arquitectura de Software", sigla: "INF552", prerequisitos: ["INF422"] },
                ]
            },
        ]
    },

    // INGENIERÍA INFORMÁTICA (187-3)
    informatica_187_3: {
        codigo: "187-3",
        nombre: "Ingeniería Informática",
        troncal: [

            // =======================
            // SEMESTRE 1
            // =======================
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Estructuras Discretas", sigla: "INF119" },
                    { nombre: "Introducción a la Informática", sigla: "INF110" },
                    { nombre: "Física I", sigla: "FIS100" },
                    { nombre: "Inglés Técnico I", sigla: "LIN100" },
                ]
            },

            // =======================
            // SEMESTRE 2
            // =======================
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Álgebra Lineal", sigla: "MAT103" },
                    { nombre: "Programación I", sigla: "INF120", prerequisitos: ["INF110"] },
                    { nombre: "Física II", sigla: "FIS102", prerequisitos: ["FIS100"] },
                    { nombre: "Inglés Técnico II", sigla: "LIN101", prerequisitos: ["LIN100"] },
                ]
            },

            // =======================
            // SEMESTRE 3
            // =======================
            {
                semestre: 3,
                materias: [
                    { nombre: "Ecuaciones Diferenciales", sigla: "MAT207", prerequisitos: ["MAT102"] },
                    { nombre: "Programación II", sigla: "INF210", prerequisitos: ["INF120"] },
                    { nombre: "Arquitectura de Computadoras", sigla: "INF211", prerequisitos: ["INF120"] },
                    { nombre: "Física III", sigla: "FIS200", prerequisitos: ["FIS102"] },
                    { nombre: "Administración", sigla: "ADM100" },
                ]
            },

            // =======================
            // SEMESTRE 4
            // =======================
            {
                semestre: 4,
                materias: [
                    { nombre: "Probabilidad y Estadística I", sigla: "MAT202", prerequisitos: ["MAT102"] },
                    { nombre: "Métodos Numéricos", sigla: "MAT205", prerequisitos: ["MAT207"] },
                    { nombre: "Estructura de Datos I", sigla: "INF220", prerequisitos: ["INF210"] },
                    { nombre: "Programación Ensamblador", sigla: "INF221", prerequisitos: ["INF211"] },
                    { nombre: "Contabilidad", sigla: "ADM200", prerequisitos: ["ADM100"] },
                ]
            },

            // =======================
            // SEMESTRE 5
            // =======================
            {
                semestre: 5,
                materias: [
                    { nombre: "Probabilidad y Estadística II", sigla: "MAT302", prerequisitos: ["MAT202"] },
                    { nombre: "Lenguajes Formales", sigla: "INF319", prerequisitos: ["INF220"] },
                    { nombre: "Estructura de Datos II", sigla: "INF310", prerequisitos: ["INF220"] },
                    { nombre: "Bases de Datos I", sigla: "INF312", prerequisitos: ["INF220"] },
                    { nombre: "Programación Lógica y Funcional", sigla: "INF318", prerequisitos: ["INF220"] },
                    { nombre: "Modelado de Simulacion de Sistemas", sigla: "ELC101" },
                    { nombre: "Programacion Grafica", sigla: "ELC102" },
                ]
            },

            // =======================
            // SEMESTRE 6
            // =======================
            {
                semestre: 6,
                materias: [
                    { nombre: "Investigación Operativa I", sigla: "MAT329", prerequisitos: ["MAT302"] },
                    { nombre: "Compiladores", sigla: "INF329", prerequisitos: ["INF319"] },
                    { nombre: "Sistemas Operativos I", sigla: "INF323", prerequisitos: ["INF310"] },
                    { nombre: "Bases de Datos II", sigla: "INF322", prerequisitos: ["INF312"] },
                    { nombre: "Sistemas de Información I", sigla: "INF342", prerequisitos: ["INF312"] },
                    { nombre: "Topicos Avanzados de Programacion", sigla: "ELC103" },
                    { nombre: "Programacion de Aplicaciones de tiempo real", sigla: "ELC104" },
                ]
            },

            // =======================
            // SEMESTRE 7
            // =======================
            {
                semestre: 7,
                materias: [
                    { nombre: "Investigación Operativa II", sigla: "MAT419", prerequisitos: ["MAT329"] },
                    { nombre: "Redes I", sigla: "INF433", prerequisitos: ["INF323"] },
                    { nombre: "Sistemas Operativos II", sigla: "INF413", prerequisitos: ["INF323"] },
                    { nombre: "Inteligencia Artificial", sigla: "INF418", prerequisitos: ["INF342"] },
                    { nombre: "Sistemas de Información II", sigla: "INF412", prerequisitos: ["INF342"] },
                    { nombre: "Sistemas Distribuidos", sigla: "ELC105" },
                    { nombre: "Interacion Hombre Computador", sigla: "ELC106" },
                ]
            },

            // =======================
            // SEMESTRE 8
            // =======================
            {
                semestre: 8,
                materias: [
                    { nombre: "Preparación y Evaluación de Proyectos", sigla: "ECO449" },
                    { nombre: "Redes II", sigla: "INF423", prerequisitos: ["INF433"] },
                    { nombre: "Sistemas Expertos", sigla: "INF428", prerequisitos: ["INF418"] },
                    { nombre: "Sistemas de Información Geográfica", sigla: "INF442" },
                    { nombre: "Ingeniería de Software I", sigla: "INF422", prerequisitos: ["INF412"] },
                    { nombre: "Criptografia y Seguridad", sigla: "ELC107" },
                    { nombre: "Control y Automatizacion", sigla: "ELC108" },
                ]
            },

            // =======================
            // SEMESTRE 9
            // =======================
            {
                semestre: 9,
                materias: [
                    { nombre: "Taller de Grado I", sigla: "INF511" },
                    { nombre: "Ingeniería de Software II", sigla: "INF512", prerequisitos: ["INF422"] },
                    { nombre: "Tecnología Web", sigla: "INF513" },
                    { nombre: "Arquitectura de Software", sigla: "INF552" },
                ]
            }

        ]
    },

    redes_187_5: {
        codigo: "187-5",
        nombre: "Ingeniería en Redes y Telecomunicaciones",
        troncal: [

            // =====================
            // SEMESTRE 1
            // =====================
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Estructuras Discretas", sigla: "INF119" },
                    { nombre: "Introducción a la Informática", sigla: "INF110" },
                    { nombre: "Física I", sigla: "FIS100" },
                    { nombre: "Inglés Técnico I", sigla: "LIN100" },
                ]
            },

            // =====================
            // SEMESTRE 2
            // =====================
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Álgebra Lineal", sigla: "MAT103" },
                    { nombre: "Programación I", sigla: "INF120", prerequisitos: ["INF110"] },
                    { nombre: "Física II", sigla: "FIS102", prerequisitos: ["FIS100"] },
                    { nombre: "Inglés Técnico II", sigla: "LIN101", prerequisitos: ["LIN100"] },
                ]
            },

            // =====================
            // SEMESTRE 3
            // =====================
            {
                semestre: 3,
                materias: [
                    { nombre: "Ecuaciones Diferenciales", sigla: "MAT207", prerequisitos: ["MAT102"] },
                    { nombre: "Programación II", sigla: "INF210", prerequisitos: ["INF120"] },
                    { nombre: "Arquitectura de Computadoras", sigla: "INF211", prerequisitos: ["INF120"] },
                    { nombre: "Análisis de Circuitos", sigla: "RDS210", prerequisitos: ["FIS102"] },
                    { nombre: "Teoría de Campo", sigla: "ELT241", prerequisitos: ["FIS102"] },
                ]
            },

            // =====================
            // SEMESTRE 4
            // =====================
            {
                semestre: 4,
                materias: [
                    { nombre: "Probabilidad y Estadística I", sigla: "MAT202", prerequisitos: ["MAT102"] },
                    { nombre: "Métodos Numéricos", sigla: "MAT205", prerequisitos: ["MAT207"] },
                    { nombre: "Estructura de Datos I", sigla: "INF220", prerequisitos: ["INF210"] },
                    { nombre: "Programación Ensamblador", sigla: "INF221", prerequisitos: ["INF211"] },
                    { nombre: "Análisis de Circuitos Electrónicos", sigla: "RDS220", prerequisitos: ["RDS210"] },
                ]
            },

            // =====================
            // SEMESTRE 5
            // =====================
            {
                semestre: 5,
                materias: [
                    { nombre: "Probabilidad y Estadística II", sigla: "MAT302", prerequisitos: ["MAT202"] },
                    { nombre: "Señales y Sistemas", sigla: "ELT354", prerequisitos: ["MAT207"] },
                    { nombre: "Sistemas Lógicos y Digitales I", sigla: "ELT352" },
                    { nombre: "Electrónica Aplicada a Redes", sigla: "RDS310", prerequisitos: ["RDS220"] },
                    { nombre: "Base de Datos I", sigla: "INF312", prerequisitos: ["INF220"] },
                    { nombre: "Diseño de Circuitos Integrados", sigla: "ELC201" },
                    { nombre: "Instrumentación", sigla: "ELC202" },
                ]
            },

            // =====================
            // SEMESTRE 6
            // =====================
            {
                semestre: 6,
                materias: [
                    { nombre: "Investigación Operativa I", sigla: "MAT329", prerequisitos: ["MAT302"] },
                    { nombre: "Interpretación de Señales y Sistemas", sigla: "RDS320", prerequisitos: ["ELT354"] },
                    { nombre: "Sistemas Lógicos y Digitales II", sigla: "ELT362", prerequisitos: ["ELT352"] },
                    { nombre: "Sistemas Operativos I", sigla: "INF323", prerequisitos: ["INF220"] },
                    { nombre: "Base de Datos II", sigla: "INF322", prerequisitos: ["INF312"] },
                    { nombre: "Sistemas de Comunicación SCADA", sigla: "ELC203" },
                    { nombre: "Televisión Digital", sigla: "ELC204" },
                ]
            },

            // =====================
            // SEMESTRE 7
            // =====================
            {
                semestre: 7,
                materias: [
                    { nombre: "Investigación Operativa II", sigla: "MAT419", prerequisitos: ["MAT329"] },
                    { nombre: "Redes I", sigla: "INF433", prerequisitos: ["INF323"] },
                    { nombre: "Sistemas Operativos II", sigla: "INF413", prerequisitos: ["INF323"] },
                    { nombre: "Sistemas de Comunicación I", sigla: "ELT374", prerequisitos: ["ELT354"] },
                    { nombre: "Aplicaciones con Microprocesadores", sigla: "RDS410", prerequisitos: ["ELT362"] },
                    { nombre: "Domótica", sigla: "ELC205" },
                    { nombre: "Líneas de Transmisión y Antenas", sigla: "ELC206" },
                ]
            },

            // =====================
            // SEMESTRE 8
            // =====================
            {
                semestre: 8,
                materias: [
                    { nombre: "Preparación y Evaluación de Proyectos", sigla: "ECO449" },
                    { nombre: "Redes II", sigla: "INF423", prerequisitos: ["INF433"] },
                    { nombre: "Taller de Análisis y Diseño de Redes", sigla: "RDS421", prerequisitos: ["INF433"] },
                    { nombre: "Legislación en Redes y Comunicaciones", sigla: "RDS429" },
                    { nombre: "Sistemas de Comunicación II", sigla: "ELT384", prerequisitos: ["ELT374"] },
                    { nombre: "Técnicas de Presentación para Ingeniería", sigla: "ELC207" },
                    { nombre: "Redes ADHOC", sigla: "ELC208" },
                ]
            },

            // =====================
            // SEMESTRE 9
            // =====================
            {
                semestre: 9,
                materias: [
                    { nombre: "Taller de Grado I", sigla: "INF511", prerequisitos: ["ECO449", "INF423"] },
                    { nombre: "Gestión y Administración de Redes", sigla: "RDS511", prerequisitos: ["RDS421"] },
                    { nombre: "Tecnología Web", sigla: "INF513" },
                    { nombre: "Redes Inalámbricas y Comunicaciones Móviles", sigla: "RDS512", prerequisitos: ["RDS511"] },
                    { nombre: "Seguridad de Redes y Transmisión de Datos", sigla: "RDS519", prerequisitos: ["INF423"] },
                ]
            }

        ]
    },

    // INGENIERÍA EN ROBÓTICA (323-0)
    robotica_323_0: {
        codigo: "323-0",
        nombre: "Ingeniería en Robótica",
        troncal: [

            // =======================
            // SEMESTRE 1 (6)
            // =======================
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Física I", sigla: "FIS100" },
                    { nombre: "Introducción a la Programación", sigla: "INF110" },
                    { nombre: "Introducción a la Robótica", sigla: "ROB101" },
                    { nombre: "Dibujo Mecánico en CAD", sigla: "ROB102" },
                    { nombre: "Metodología de la Investigación", sigla: "MET100" }
                ]
            },

            // =======================
            // SEMESTRE 2 (6)
            // =======================
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Física II", sigla: "FIS200", prerequisitos: ["FIS100"] },
                    { nombre: "Programación I", sigla: "INF120", prerequisitos: ["INF110"] },
                    { nombre: "Estática", sigla: "ROB103", prerequisitos: ["FIS100"] },
                    { nombre: "Probabilidades y Estadística I", sigla: "MAT202", prerequisitos: ["MET100"] },
                    { nombre: "Pensamiento Crítico y Creativo", sigla: "ROB104", prerequisitos: ["MET100"] }
                ]
            },

            // =======================
            // SEMESTRE 3 (6)
            // =======================
            {
                semestre: 3,
                materias: [
                    { nombre: "Ecuaciones Diferenciales", sigla: "MAT207", prerequisitos: ["MAT102"] },
                    { nombre: "Electricidad y Magnetismo", sigla: "ROB201", prerequisitos: ["FIS200"] },
                    { nombre: "Análisis de Circuitos", sigla: "RDS210", prerequisitos: ["ROB201"] },
                    { nombre: "Dinámica", sigla: "ROB203", prerequisitos: ["ROB103"] },
                    { nombre: "Tecnologías de la Manufactura", sigla: "ROB202" },
                    { nombre: "Álgebra Lineal", sigla: "MAT103" }
                ]
            },

            // =======================
            // SEMESTRE 4 (6)
            // =======================
            {
                semestre: 4,
                materias: [
                    { nombre: "Métodos Numéricos", sigla: "MAT205", prerequisitos: ["MAT207"] },
                    { nombre: "Circuitos Eléctricos I", sigla: "ELT352", prerequisitos: ["RDS210"] },
                    { nombre: "Estructura de Datos", sigla: "INF220", prerequisitos: ["INF120"] },
                    { nombre: "Circuitos Digitales", sigla: "ROB204", prerequisitos: ["RDS210"] },
                    { nombre: "Redes I", sigla: "INF433" },
                    { nombre: "Señales y Sistemas", sigla: "ELT354", prerequisitos: ["MAT207"] }
                ]
            },

            // =======================
            // SEMESTRE 5 (6)
            // =======================
            {
                semestre: 5,
                materias: [
                    { nombre: "Inteligencia Artificial", sigla: "INF418", prerequisitos: ["INF220"] },
                    { nombre: "Circuitos Eléctricos II", sigla: "ELT362", prerequisitos: ["ELT352"] },
                    { nombre: "Sistemas Embebidos", sigla: "ROB303", prerequisitos: ["INF220"] },
                    { nombre: "Sistemas de Control I", sigla: "ROB301", prerequisitos: ["ELT354"] },
                    { nombre: "Actuadores y Sensores", sigla: "ROB302", prerequisitos: ["ROB204"] },
                    { nombre: "Procesamiento Digital de Señales", sigla: "RDS320", prerequisitos: ["ELT354"] }
                ]
            },

            // =======================
            // SEMESTRE 6 (6)
            // =======================
            {
                semestre: 6,
                materias: [
                    { nombre: "Visión Computacional", sigla: "ROB307", prerequisitos: ["INF418"] },
                    { nombre: "Robótica Industrial", sigla: "ROB304", prerequisitos: ["ROB301"] },
                    { nombre: "Internet de las Cosas", sigla: "ROB306", prerequisitos: ["INF433"] },
                    { nombre: "Taller de Control", sigla: "ROB305", prerequisitos: ["ROB301"] },
                    { nombre: "Instrumentación Industrial", sigla: "ELEC202" },
                    { nombre: "Liderazgo, Emprendimiento y Startups", sigla: "MET200", prerequisitos: ["ROB104"] }
                ]
            },

            // =======================
            // SEMESTRE 7 (6)
            // =======================
            {
                semestre: 7,
                materias: [
                    { nombre: "Interacción Humano - Robot", sigla: "ROB405", prerequisitos: ["ROB307"] },
                    { nombre: "Robótica Avanzada", sigla: "ROB401", prerequisitos: ["ROB304"] },
                    { nombre: "Robot Operating System", sigla: "ROB404", prerequisitos: ["ROB303"] },
                    { nombre: "Sistemas de Control II", sigla: "ROB403", prerequisitos: ["ROB301"] },
                    { nombre: "Automatización y Control", sigla: "ROB402", prerequisitos: ["ROB403"] },
                    { nombre: "ELECTIVA", sigla: "ELT101" },
                ]
            },

            // =======================
            // SEMESTRE 8 (5)
            // =======================
            {
                semestre: 8,
                materias: [
                    { nombre: "Taller de Grado I", sigla: "INF511" },
                    { nombre: "Taller de Robótica y Sistemas Inteligentes", sigla: "ROB406", prerequisitos: ["ROB401"] },
                    { nombre: "Preparación y Evaluación de Proyectos", sigla: "ECO449" },
                    { nombre: "Práctica Profesional", sigla: "PRA001" },
                    { nombre: "ELECTIVA", sigla: "ELT102" },
                ]
            }

        ]
    }
}

