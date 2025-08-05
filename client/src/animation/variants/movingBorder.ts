// import { Variants } from "framer-motion";

// // This variant animates a border "snake" effect by animating a linear gradient background position
// export const movingBorderVariants: Variants = {
//     initial: {
//         background: "#96FF43",
//         backgroundPosition: "0% 0%",
//     },
//     vibrate: {
//         background: [
//             "linear-gradient(90deg, #96FF43 50%, transparent 50%)",
//             "linear-gradient(180deg, #96FF43 50%, transparent 50%)",
//             "linear-gradient(270deg, #96FF43 50%, transparent 50%)",
//             "linear-gradient(360deg, #96FF43 50%, transparent 50%)",
//             "linear-gradient(90deg, #96FF43 50%, transparent 50%)",
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
        background: "linear-gradient(270deg, #96FF43, transparent, #96FF43)",
        backgroundSize: "400% 400%",
        backgroundPosition: "0% 50%",
    },
    vibrate: {
        background: "linear-gradient(270deg, #96FF43, transparent, #96FF43)",
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

