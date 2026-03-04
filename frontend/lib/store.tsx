"use client"

import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react"

/* =========================
   TIPOS
========================= */

export interface DatosPersonales {
    universidad: string
    carrera: string
    nombre: string
    registro: string
    ci: string
    celular: string
    ppa: string
    gestion: string
    director: string  // se calcula automáticamente según la carrera
}

export type EstadoMateria = "pendiente" | "aprobada" | "inscrita" | "caso"

export interface CasoEspecialState {
    datos: DatosPersonales
    estadoMaterias: Record<string, EstadoMateria>
    gruposMaterias: Record<string, string>
    setDatos: (d: DatosPersonales) => void
    setEstadoMateria: (sigla: string, estado: EstadoMateria) => void
    setGrupoMateria: (sigla: string, grupo: string) => void
    resetAll: () => void
}

/* =========================
   DEFAULTS
========================= */

const defaultDatos: DatosPersonales = {
    universidad: "Universidad Autónoma Gabriel René Moreno",
    carrera: "Informática",
    nombre: "",
    registro: "",
    ci: "",
    celular: "",
    ppa: "",
    gestion: "01/2026",
    director: ""
}

/* =========================
   CONTEXT
========================= */

const CasoEspecialContext = createContext<CasoEspecialState | null>(null)

export function CasoEspecialProvider({ children }: { children: ReactNode }) {
    const [datos, setDatos] = useState<DatosPersonales>(defaultDatos)
    const [estadoMaterias, setEstadoMaterias] = useState<Record<string, EstadoMateria>>({})
    const [gruposMaterias, setGruposMaterias] = useState<Record<string, string>>({})

    const setEstadoMateria = (sigla: string, estado: EstadoMateria) => {
        setEstadoMaterias(prev => ({ ...prev, [sigla]: estado }))
    }

    const setGrupoMateria = (sigla: string, grupo: string) => {
        setGruposMaterias(prev => ({ ...prev, [sigla]: grupo }))
    }

    const resetAll = () => {
        setDatos(defaultDatos)
        setEstadoMaterias({})
        setGruposMaterias({})
    }

    return (
        <CasoEspecialContext.Provider value={{
            datos,
            estadoMaterias,
            gruposMaterias,
            setDatos,
            setEstadoMateria,
            setGrupoMateria,
            resetAll
        }}>
            {children}
        </CasoEspecialContext.Provider>
    )
}

export function useCasoEspecial() {
    const ctx = useContext(CasoEspecialContext)
    if (!ctx) throw new Error("useCasoEspecial must be used inside CasoEspecialProvider")
    return ctx
}