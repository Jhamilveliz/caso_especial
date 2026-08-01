// Variantes compartidas para mantener consistencia de motion en todo el proyecto.
import type { Variants, Transition } from "motion/react";

export const containerStagger: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.04 },
    },
};

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 280, damping: 24 } satisfies Transition,
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4 } },
};
