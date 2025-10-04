// import { Variants } from "framer-motion";

// // This variant animates a border "snake" effect by animating a linear gradient background position
// export const movingBorderVariants: Variants = {
//     initial: {
//         background: "primary.main",
//         backgroundPosition: "0% 0%",
//     },
//     vibrate: {
//         background: [
//             "linear-gradient(90deg, primary.main 50%, transparent 50%)",
//             "linear-gradient(180deg, primary.main 50%, transparent 50%)",
//             "linear-gradient(270deg, primary.main 50%, transparent 50%)",
//             "linear-gradient(360deg, primary.main 50%, transparent 50%)",
//             "linear-gradient(90deg, primary.main 50%, transparent 50%)",
//         ],
//         backgroundPosition: [
//             "0% 0%",
//             "100% 0%",
//             "100% 100%",
//             "0% 100%",
//             "0% 0%",
//         ],
//         transition: {
//             background: {
//                 duration: 2,
//                 ease: "linear",
//                 repeat: Infinity,
//             },
//             backgroundPosition: {
//                 duration: 2,
//                 ease: "linear",
//                 repeat: Infinity,
//             },
//         },
//     },
// };
import { Variants } from "framer-motion";

export const movingBorderVariants: Variants = {
    initial: {
        background: "linear-gradient(270deg, primary.main, transparent, primary.main)",
        backgroundSize: "400% 400%",
        backgroundPosition: "0% 50%",
    },
    vibrate: {
        background: "linear-gradient(270deg, primary.main, transparent, primary.main)",
        backgroundSize: "400% 400%",
        backgroundPosition: ["0% 50%", "100% 50%"],
        transition: {
            backgroundPosition: {
                duration: 4,
                ease: "linear",
                repeat: Infinity,
            },
        },
    },
};

