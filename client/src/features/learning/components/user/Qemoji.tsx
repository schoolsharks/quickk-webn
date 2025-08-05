import React from "react";
import Box from "@mui/material/Box";
import QemojiImg from "../../assets/QemojiImg.png";

interface QemojiImageProps {
    width: string;
    height: string;
    sx?: object;
}

const QemojiImage: React.FC<QemojiImageProps> = ({ width, height ,sx}) => (
        <Box
            component="img"
            sx={{
                ...sx,
                width,
                height,
                filter: "drop-shadow(0px 4px 4px rgba(235, 235, 245, 0.3))",
            }}
            alt="Q Image"
            src={QemojiImg}
        />
);

export default QemojiImage;