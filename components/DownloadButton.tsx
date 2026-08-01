// Componente cliente que envuelve un botón con un estado interno:
// idle → loading → success → idle. Animado con motion/react.
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

type Props = {
    onDownload: () => Promise<void>
    color: string        // color base del botón (hex)
    textColor?: string   // color de texto/idle
    icon: string
    label: string
}

export default function DownloadButton({ onDownload, color, textColor = "#fff", icon, label }: Props) {
    const [state, setState] = useState<"idle" | "loading" | "success">("idle")

    const trigger = async () => {
        if (state !== "idle") return
        setState("loading")
        try {
            await onDownload()
            setState("success")
            setTimeout(() => setState("idle"), 1800)
        } catch (err) {
            setState("idle")
            throw err
        }
    }

    const colorHover =
        color === "#1d4ed8" ? "#1e40af"
            : color === "#15803d" ? "#166534"
                : color

    return (
        <motion.button
            onClick={trigger}
            whileHover={state === "idle" ? { scale: 1.015, backgroundColor: colorHover } : {}}
            whileTap={state === "idle" ? { scale: 0.97 } : {}}
            disabled={state !== "idle"}
            style={{
                width: "100%", padding: "16px 0",
                borderRadius: 8, background: color,
                border: "none", color: textColor,
                fontWeight: 700, fontSize: 15,
                fontFamily: "sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                cursor: state === "idle" ? "pointer" : "default",
                opacity: state === "loading" ? 0.85 : 1,
            }}
        >
            <AnimatePresence mode="wait">
                {state === "success" ? (
                    <motion.span
                        key="ok"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 20 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, color: textColor }}
                    >
                        <motion.span
                            initial={{ rotate: -90, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            style={{ fontSize: 20 }}
                        >✓</motion.span>
                        ¡Descarga iniciada!
                    </motion.span>
                ) : state === "loading" ? (
                    <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, color: textColor }}
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{
                                display: "inline-block",
                                width: 16, height: 16,
                                border: `2.5px solid ${textColor}`,
                                borderTopColor: "transparent",
                                borderRadius: "50%",
                            }}
                        />
                        Generando PDF…
                    </motion.span>
                ) : (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, color: textColor }}
                    >
                        <span style={{ fontSize: 20 }}>{icon}</span>
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    )
}
