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
                    { nombre: "Modalidad de Licenciatura", sigla: "GRL001", prerequisitos: ["INF511"] },
                ]
            },
        ]
    },

    // INGENIERÍA INFORMÁTICA (187-3)
    informatica_187_3: {
        codigo: "187-3",
        nombre: "Ingeniería Informática",
        troncal: [
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Estructuras Discretas", sigla: "INF119" },
                    { nombre: "Introducción a la Informática", sigla: "INF110" },
                    { nombre: "Física I", sigla: "FIS100" },
                    { nombre: "Inglés Técnico I", sigla: "LIN100" },
                    { nombre: "FICCT Community", sigla: "FICCT001" },
                ]
            },
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Álgebra Lineal", sigla: "MAT103" },
                    { nombre: "Programación I", sigla: "INF120", prerequisitos: ["INF110"] },
                    { nombre: "Arquitectura de Computadoras", sigla: "INF211" },
                    { nombre: "Física II", sigla: "FIS102", prerequisitos: ["FIS100"] },
                    { nombre: "Inglés Técnico II", sigla: "LIN101", prerequisitos: ["LIN100"] },
                    { nombre: "Administración", sigla: "ADM100" },
                ]
            },
            {
                semestre: 3,
                materias: [
                    { nombre: "Programación II", sigla: "INF210", prerequisitos: ["INF120"] },
                    { nombre: "Estructura de Datos I", sigla: "INF220", prerequisitos: ["INF210"] },
                    { nombre: "Programación Ensamblador", sigla: "INF221", prerequisitos: ["INF211"] },
                    { nombre: "Modelado y Simulación de Sistemas", sigla: "ELC102" },
                    { nombre: "Programación Gráfica", sigla: "ELC103" },
                    { nombre: "Tópicos Avanzados de Programación", sigla: "ELC104" },
                ]
            },
            {
                semestre: 4,
                materias: [
                    { nombre: "Programación de Aplicaciones de Tiempo Real", sigla: "ELC105" },
                    { nombre: "Sistemas de Información I", sigla: "INF342", prerequisitos: ["INF220"] },
                    { nombre: "Interacción Hombre Computador", sigla: "ELC107" },
                    { nombre: "Criptografía y Seguridad", sigla: "ELC108" },
                    { nombre: "Control y Automatización", sigla: "ELC109" },
                ]
            },
            {
                semestre: 5,
                materias: [
                    { nombre: "Ingeniería de Software I", sigla: "INF422", prerequisitos: ["INF220"] },
                    { nombre: "Software II", sigla: "ELC111" },
                    { nombre: "Software III", sigla: "ELC112" },
                    { nombre: "Software IV", sigla: "ELC113" },
                    { nombre: "Software V", sigla: "ELC114" },
                ]
            },
            {
                semestre: 6,
                materias: [
                    { nombre: "Software VI", sigla: "ELC115" },
                    { nombre: "Software VII", sigla: "ELC116" },
                    { nombre: "Software VIII", sigla: "ELC117" },
                    { nombre: "Software IX", sigla: "ELC118" },
                    { nombre: "Software X", sigla: "ELC119" },
                ]
            },
            {
                semestre: 7,
                materias: [
                    { nombre: "Software XI", sigla: "ELC120" },
                    { nombre: "Software XII", sigla: "ELC121" },
                    { nombre: "Software XIII", sigla: "ELC122" },
                    { nombre: "Software XIV", sigla: "ELC123" },
                    { nombre: "Software XV", sigla: "ELC124" },
                ]
            },
            {
                semestre: 8,
                materias: [
                    { nombre: "Software XVI", sigla: "ELC125" },
                    { nombre: "Software XVII", sigla: "ELC126" },
                    { nombre: "Software XVIII", sigla: "ELC127" },
                    { nombre: "Software XIX", sigla: "ELC128" },
                    { nombre: "Software XX", sigla: "ELC129" },
                ]
            },
            {
                semestre: 9,
                materias: [
                    { nombre: "Software XXI", sigla: "ELC130" },
                    { nombre: "Software XXII", sigla: "ELC131" },
                    { nombre: "Software XXIII", sigla: "ELC132" },
                    { nombre: "Software XXIV", sigla: "ELC133" },
                    { nombre: "Software XXV", sigla: "ELC134" },
                ]
            },
        ]
    },

    // INGENIERÍA EN REDES Y TELECOMUNICACIONES (187-5)
    redes_187_5: {
        codigo: "187-5",
        nombre: "Ingeniería en Redes y Telecomunicaciones",
        troncal: [
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Estructuras Discretas", sigla: "INF119" },
                    { nombre: "Introducción a la Informática", sigla: "INF110" },
                ]
            },
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Programación I", sigla: "INF120", prerequisitos: ["INF110"] },
                    { nombre: "Inglés Técnico I", sigla: "LIN100" },
                    { nombre: "Teoría de Campo", sigla: "FIS101", prerequisitos: ["FIS100"] },
                ]
            },
            {
                semestre: 3,
                materias: [
                    { nombre: "Ecuaciones Diferenciales", sigla: "MAT207", prerequisitos: ["MAT102"] },
                    { nombre: "Arquitectura de Computadoras", sigla: "INF210" },
                    { nombre: "Análisis de Circuitos", sigla: "RDS210", prerequisitos: ["FIS102"] },
                    { nombre: "Teoría de Campo", sigla: "ELT241" },
                ]
            },
            {
                semestre: 4,
                materias: [
                    { nombre: "Probabilidad y Estadística I", sigla: "MAT202", prerequisitos: ["MAT102"] },
                    { nombre: "Métodos Numéricos", sigla: "MAT205", prerequisitos: ["MAT207"] },
                    { nombre: "Estructura de Datos I", sigla: "INF221", prerequisitos: ["INF120"] },
                    { nombre: "Análisis de Circuitos Electrónicos", sigla: "RDS220", prerequisitos: ["RDS210"] },
                ]
            },
            {
                semestre: 5,
                materias: [
                    { nombre: "Probabilidad y Estadística II", sigla: "MAT302", prerequisitos: ["MAT202"] },
                    { nombre: "Señales y Sistemas", sigla: "ELT354", prerequisitos: ["MAT207"] },
                    { nombre: "Sistemas Lógicos y Digitales I", sigla: "INF230" },
                    { nombre: "Electrónica Aplicada a Redes", sigla: "RDS310", prerequisitos: ["RDS220"] },
                    { nombre: "Base de Datos I", sigla: "INF312", prerequisitos: ["INF221"] },
                    { nombre: "Diseño de Circuitos Integrados", sigla: "ELC201" },
                    { nombre: "Instrumentación", sigla: "ELC202" },
                ]
            },
            {
                semestre: 6,
                materias: [
                    { nombre: "Probabilidad y Estadística III", sigla: "MAT303", prerequisitos: ["MAT302"] },
                    { nombre: "Sistemas Lógicos y Digitales II", sigla: "INF329", prerequisitos: ["INF230"] },
                    { nombre: "Sistemas Operativos I", sigla: "RDS320", prerequisitos: ["INF210"] },
                    { nombre: "Sistemas Operativos II", sigla: "INF332", prerequisitos: ["RDS320"] },
                    { nombre: "Sistemas de Comunicación SCADA", sigla: "ELC203" },
                    { nombre: "Televisión Digital", sigla: "ELC204" },
                ]
            },
            {
                semestre: 7,
                materias: [
                    { nombre: "Investigación Operativa II", sigla: "MAT319", prerequisitos: ["MAT329"] },
                    { nombre: "Interpretación de Señales y Sistemas", sigla: "INF433", prerequisitos: ["ELT354"] },
                    { nombre: "Redes I", sigla: "RDS410", prerequisitos: ["INF332"] },
                    { nombre: "Domótica", sigla: "ELC205" },
                    { nombre: "Líneas de Transmisión y Antenas", sigla: "ELC206", prerequisitos: ["ELT241"] },
                ]
            },
            {
                semestre: 8,
                materias: [
                    { nombre: "Preparación y Evaluación de Proyectos", sigla: "ECO449", prerequisitos: ["MAT319"] },
                    { nombre: "Redes II", sigla: "INF423", prerequisitos: ["RDS410"] },
                    { nombre: "Sistemas de Comunicación I", sigla: "ELT374", prerequisitos: ["ELT354"] },
                    { nombre: "Telefonía de Redes", sigla: "RDS421", prerequisitos: ["RDS410"] },
                    { nombre: "Sistemas de Comunicación II", sigla: "ELT384", prerequisitos: ["ELT374"] },
                    { nombre: "Técnicas de Presentación para Ingeniería", sigla: "ELC207" },
                    { nombre: "Redes ADHOC", sigla: "ELC208", prerequisitos: ["INF423"] },
                ]
            },
            {
                semestre: 9,
                materias: [
                    { nombre: "Taller de Grado I", sigla: "INF511", prerequisitos: ["ECO449", "INF423"] },
                    { nombre: "Gestión y Administración de Redes", sigla: "RDS511", prerequisitos: ["RDS421"] },
                    { nombre: "Tecnología Web", sigla: "INF513" },
                    { nombre: "Redes Inalámbricas y Comunicaciones Móviles", sigla: "RDS512", prerequisitos: ["RDS511"] },
                    { nombre: "Sistemas de Comunicación III", sigla: "ELT385", prerequisitos: ["ELT384"] },
                ]
            },
        ]
    },

    // INGENIERÍA EN ROBÓTICA (323-0)
    robotica_323_0: {
        codigo: "323-0",
        nombre: "Ingeniería en Robótica",
        troncal: [
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Introducción a la Robótica", sigla: "ROB101" },
                    { nombre: "Introducción a la Programación", sigla: "INF110" },
                    { nombre: "Física I", sigla: "FIS100" },
                    { nombre: "Dibujo Mecánico en CAD", sigla: "ROB102" },
                    { nombre: "Metodología de la Investigación", sigla: "MET100" },
                ]
            },
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Física II", sigla: "FIS102", prerequisitos: ["FIS100"] },
                    { nombre: "Programación I", sigla: "INF120", prerequisitos: ["INF110"] },
                    { nombre: "Estática", sigla: "ROB103", prerequisitos: ["FIS100"] },
                    { nombre: "Pensamiento Crítico y Creativo", sigla: "ROB104" },
                    { nombre: "Álgebra Lineal", sigla: "MAT103" },
                ]
            },
            {
                semestre: 3,
                materias: [
                    { nombre: "Ecuaciones Diferenciales", sigla: "MAT207", prerequisitos: ["MAT102"] },
                    { nombre: "Electricidad y Magnetismo", sigla: "FIS200", prerequisitos: ["FIS102"] },
                    { nombre: "Análisis de Circuitos", sigla: "RDS210", prerequisitos: ["FIS200"] },
                    { nombre: "Dinámica", sigla: "ROB201", prerequisitos: ["ROB103"] },
                    { nombre: "Tecnologías de la Manufactura", sigla: "ROB202" },
                    { nombre: "Redes I", sigla: "INF433" },
                ]
            },
            {
                semestre: 4,
                materias: [
                    { nombre: "Métodos Numéricos", sigla: "MAT205", prerequisitos: ["MAT207"] },
                    { nombre: "Probabilidad y Estadística I", sigla: "MAT202", prerequisitos: ["MAT102"] },
                    { nombre: "Circuitos Digitales", sigla: "ROB203", prerequisitos: ["RDS210"] },
                    { nombre: "Estructura de Datos", sigla: "INF220", prerequisitos: ["INF120"] },
                    { nombre: "Inteligencia Artificial", sigla: "INF418", prerequisitos: ["INF220"] },
                    { nombre: "Sistemas Embebidos", sigla: "ROB204", prerequisitos: ["INF210"] },
                ]
            },
            {
                semestre: 5,
                materias: [
                    { nombre: "Señales y Sistemas", sigla: "ELT354", prerequisitos: ["MAT207"] },
                    { nombre: "Circuitos Eléctricos I", sigla: "ELEC202", prerequisitos: ["FIS200"] },
                    { nombre: "Sistemas de Control I", sigla: "ROB301", prerequisitos: ["ELT354"] },
                    { nombre: "Actuadores y Sensores", sigla: "ROB302", prerequisitos: ["ROB203"] },
                    { nombre: "Taller de Control", sigla: "ROB303", prerequisitos: ["ROB301"] },
                    { nombre: "Internet de las Cosas", sigla: "ROB304", prerequisitos: ["INF433"] },
                ]
            },
            {
                semestre: 6,
                materias: [
                    { nombre: "Circuitos Eléctricos II", sigla: "ELT352", prerequisitos: ["ELEC202"] },
                    { nombre: "Robótica Industrial", sigla: "ROB305", prerequisitos: ["ROB301"] },
                    { nombre: "Visión Computacional", sigla: "ROB306", prerequisitos: ["INF418"] },
                    { nombre: "Interacción Humano-Robot", sigla: "ROB307", prerequisitos: ["ROB302"] },
                    { nombre: "Robótica Avanzada", sigla: "ROB308", prerequisitos: ["ROB305"] },
                    { nombre: "Procesamiento Digital de Señales", sigla: "RDS320", prerequisitos: ["ELT354"] },
                ]
            },
            {
                semestre: 7,
                materias: [
                    { nombre: "Robot Operating System", sigla: "ROB401", prerequisitos: ["ROB308", "INF220"] },
                    { nombre: "Sistemas de Control II", sigla: "ROB402", prerequisitos: ["ROB301"] },
                    { nombre: "Instrumentación Industrial", sigla: "ROB403", prerequisitos: ["ROB302"] },
                    { nombre: "Automatización y Control", sigla: "ROB404", prerequisitos: ["ROB402"] },
                    { nombre: "Liderazgo, Emprendimiento y Startups", sigla: "MET200" },
                ]
            },
            {
                semestre: 8,
                materias: [
                    { nombre: "Taller de Grado I", sigla: "INF511", prerequisitos: ["ROB404"] },
                    { nombre: "Taller de Robótica y Sistemas Inteligentes", sigla: "ROB405", prerequisitos: ["ROB401"] },
                    { nombre: "Preparación y Evaluación de Proyectos", sigla: "ECO449", prerequisitos: ["MET200"] },
                    { nombre: "Electiva I", sigla: "ELECTIVA1" },
                    { nombre: "Electiva II", sigla: "ELECTIVA2" },
                ]
            },
            {
                semestre: 9,
                materias: [
                    { nombre: "Práctica Profesional", sigla: "PRA001", prerequisitos: ["INF511"] },
                    { nombre: "Modalidad de Titulación", sigla: "GRL001", prerequisitos: ["PRA001"] },
                    { nombre: "Proyecto Robótico", sigla: "ROB406", prerequisitos: ["ROB405"] },
                ]
            },
        ]
    },

    // INGENIERÍA INFORMÁTICA CON MENCIONES (NUEVA)
    informatica_menciones: {
        codigo: "188-0",
        nombre: "Ingeniería Informática con Menciones",
        troncal: [
            {
                semestre: 1,
                materias: [
                    { nombre: "Cálculo I", sigla: "MAT101" },
                    { nombre: "Estructuras Discretas", sigla: "INF119" },
                    { nombre: "Física I", sigla: "FIS100" },
                    { nombre: "Introducción a la Programación", sigla: "INF110" },
                    { nombre: "Metodología de la Investigación", sigla: "MET100" },
                ]
            },
            {
                semestre: 2,
                materias: [
                    { nombre: "Cálculo II", sigla: "MAT102", prerequisitos: ["MAT101"] },
                    { nombre: "Arquitectura de Computadoras", sigla: "INF112" },
                    { nombre: "Álgebra Lineal", sigla: "MAT123" },
                    { nombre: "Sistemas Operativos I", sigla: "INF123" },
                    { nombre: "Base de Datos I", sigla: "INF122" },
                ]
            },
            {
                semestre: 3,
                materias: [
                    { nombre: "Ecuaciones Diferenciales", sigla: "MAT207", prerequisitos: ["MAT102"] },
                    { nombre: "Ingeniería de Requisitos y Modelado", sigla: "INF219" },
                    { nombre: "Programación II", sigla: "INF210", prerequisitos: ["INF110"] },
                    { nombre: "Redes I", sigla: "INF212" },
                    { nombre: "Sistemas Operativos II", sigla: "INF223", prerequisitos: ["INF123"] },
                ]
            },
            {
                semestre: 4,
                materias: [
                    { nombre: "Probabilidad y Estadística I", sigla: "MAT202", prerequisitos: ["MAT102"] },
                    { nombre: "Arquitectura de Software", sigla: "INF252", prerequisitos: ["INF219"] },
                    { nombre: "Programación Web I", sigla: "INF240", prerequisitos: ["INF210"] },
                    { nombre: "Redes II", sigla: "INF226", prerequisitos: ["INF212"] },
                ]
            },
            {
                semestre: 5,
                materias: [
                    { nombre: "Probabilidad y Estadística II", sigla: "MAT302", prerequisitos: ["MAT202"] },
                    { nombre: "Taller de Sistemas", sigla: "INF342", prerequisitos: ["INF252"] },
                    { nombre: "Estructuras de Datos II", sigla: "INF310", prerequisitos: ["INF210"] },
                    { nombre: "Legislación Informática y Ética", sigla: "INF308" },
                    { nombre: "Liderazgo, Emprendimiento y Startup", sigla: "INF406" },
                ]
            },
            {
                semestre: 6,
                materias: [
                    { nombre: "Investigación Operativa I", sigla: "MAT329", prerequisitos: ["MAT302"] },
                    { nombre: "Ingeniería de Software I", sigla: "INF412", prerequisitos: ["INF252"] },
                    { nombre: "Gestión de Infraestructura TI", sigla: "INF421", prerequisitos: ["INF226", "INF223"] },
                    { nombre: "Preparación y Evaluación de Proyectos", sigla: "ECO449", prerequisitos: ["MAT329"] },
                ]
            },
            {
                semestre: 7,
                materias: [
                    { nombre: "Investigación Operativa II", sigla: "MAT419", prerequisitos: ["MAT329"] },
                    { nombre: "Ingeniería de Software II", sigla: "INF422", prerequisitos: ["INF412"] },
                    { nombre: "Gestión de Infraestructura TI II", sigla: "INF431", prerequisitos: ["INF421"] },
                ]
            },
            {
                semestre: 8,
                materias: [
                    { nombre: "Taller de Grado I", sigla: "INF411", prerequisitos: ["INF422", "ECO449"] },
                    { nombre: "Prácticas Profesionales", sigla: "INF512", prerequisitos: ["INF431"] },
                    { nombre: "Modalidad de Graduación", sigla: "GRL001", prerequisitos: ["INF411"] },
                ]
            },
        ],
        menciones: {
            ciberseguridad: {
                nombre: "Ciberseguridad",
                semestres: [
                    {
                        semestre: 5,
                        materias: [
                            { nombre: "Seguridad en BD y S.O.", sigla: "INF312", prerequisitos: ["INF122", "INF123"] },
                            { nombre: "Gestión de Riesgos de Ciberseguridad", sigla: "INF352", prerequisitos: ["INF308"] },
                        ]
                    },
                    {
                        semestre: 6,
                        materias: [
                            { nombre: "Machine Learning", sigla: "INF451", prerequisitos: ["MAT302", "INF310"] },
                            { nombre: "Gestión de la Seguridad de la Información", sigla: "INF452", prerequisitos: ["INF312"] },
                        ]
                    },
                    {
                        semestre: 7,
                        materias: [
                            { nombre: "Seguridad en Redes", sigla: "INF340", prerequisitos: ["INF226"] },
                            { nombre: "Criptografía Avanzada", sigla: "INF453", prerequisitos: ["INF312"] },
                            { nombre: "Ethical Hacking", sigla: "INF454", prerequisitos: ["INF340"] },
                        ]
                    },
                    {
                        semestre: 8,
                        materias: [
                            { nombre: "Auditoría de Seguridad", sigla: "INF455", prerequisitos: ["INF452"] },
                            { nombre: "Forensia Digital", sigla: "INF456", prerequisitos: ["INF454"] },
                        ]
                    },
                ]
            },
            ciencias_computacion: {
                nombre: "Ciencias de la Computación",
                semestres: [
                    {
                        semestre: 3,
                        materias: [
                            { nombre: "Base de Datos II", sigla: "INF212", prerequisitos: ["INF122"] },
                        ]
                    },
                    {
                        semestre: 5,
                        materias: [
                            { nombre: "Lenguajes Formales", sigla: "INF319", prerequisitos: ["INF119"] },
                        ]
                    },
                    {
                        semestre: 6,
                        materias: [
                            { nombre: "Inteligencia Artificial", sigla: "INF321", prerequisitos: ["INF310"] },
                            { nombre: "Criptografía", sigla: "INF307", prerequisitos: ["INF308"] },
                            { nombre: "Sistemas de Información Geográfica", sigla: "INF351", prerequisitos: ["INF322"] },
                        ]
                    },
                    {
                        semestre: 7,
                        materias: [
                            { nombre: "Computación Gráfica", sigla: "INF401", prerequisitos: ["INF210", "MAT103"] },
                            { nombre: "Sistemas Distribuidos y Computación Paralela", sigla: "INF403", prerequisitos: ["INF223", "INF226"] },
                        ]
                    },
                    {
                        semestre: 8,
                        materias: [
                            { nombre: "Interacción Hombre-Computador", sigla: "INF408", prerequisitos: ["INF401"] },
                        ]
                    },
                ]
            },
            desarrollo_software: {
                nombre: "Desarrollo de Software",
                semestres: [
                    {
                        semestre: 3,
                        materias: [
                            { nombre: "Base de Datos II", sigla: "INF212", prerequisitos: ["INF122"] },
                            { nombre: "Sistemas Operativos III", sigla: "INF223", prerequisitos: ["INF123"] },
                        ]
                    },
                    {
                        semestre: 4,
                        materias: [
                            { nombre: "Arquitectura de Software", sigla: "INF245", prerequisitos: ["INF219"] },
                        ]
                    },
                    {
                        semestre: 5,
                        materias: [
                            { nombre: "Herramientas de Desarrollo de Software", sigla: "INF311", prerequisitos: ["INF210"] },
                            { nombre: "Programación Web II", sigla: "INF340", prerequisitos: ["INF240"] },
                        ]
                    },
                    {
                        semestre: 6,
                        materias: [
                            { nombre: "Gestión de Configuración del Software", sigla: "INF320", prerequisitos: ["INF412"] },
                            { nombre: "Programación Móvil", sigla: "INF341", prerequisitos: ["INF311"] },
                            { nombre: "Seguridad en Redes", sigla: "INF350", prerequisitos: ["INF226"] },
                        ]
                    },
                    {
                        semestre: 7,
                        materias: [
                            { nombre: "Machine Learning", sigla: "INF461", prerequisitos: ["MAT302", "INF310"] },
                        ]
                    },
                    {
                        semestre: 8,
                        materias: [
                            { nombre: "Testing y Calidad del Software", sigla: "INF407", prerequisitos: ["INF422"] },
                            { nombre: "Interacción Hombre-Computador", sigla: "INF408", prerequisitos: ["INF245"] },
                            { nombre: "Gestión de Seguridad de la Información", sigla: "INF452", prerequisitos: ["INF308"] },
                        ]
                    },
                ]
            }
        }
    }
}

// Tipo para acceder a las