import React from "react"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"

import image0 from "../assets/image0.jpg"
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"

import ua_toggle from "../assets/ua.png"
import gb_toggle from "../assets/gb.png"

import * as texts from "../assets/texts"

const Home = () => {
  const [isUA, setIsUA] = React.useState(false)

  const Textblock = ({ text }) => {
    return (
      <Typography
        sx={{
          fontSize: { xs: 16, sm: 30 },
          textAlign: "justify",
          justifyContent: "center",
        }}
      >
        {text}
      </Typography>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 30, fontWeight: "bold" }}>
          {isUA ? "ОПИС ПРОЕКТУ" : "PROJECT DESCRIPTION"}
          <IconButton sx={{ ml: 4, mb: 1 }} value={isUA} onClick={() => setIsUA(!isUA)}>
            <img src={isUA ? gb_toggle : ua_toggle} alt="language" width="25px" />
          </IconButton>
        </Typography>
      </Box>

      <Box
        sx={{
          height: "88vh",
          overflow: "scroll",
          ml: { xs: 3, sm: 20 },
          mr: { xs: 3, sm: 20 },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Textblock text={isUA ? texts.TEXT_UA_0 : texts.TEXT_EN_0} />
        <img src={image0} alt="image0" width="100%" />
        <Textblock text={isUA ? texts.TEXT_UA_1 : texts.TEXT_EN_1} />
        <Textblock text={isUA ? texts.TEXT_UA_2 : texts.TEXT_EN_2} />
        <img src={image1} alt="image1" width="100%" />
        <Textblock text={isUA ? texts.TEXT_UA_3 : texts.TEXT_EN_3} />
        <img src={image2} alt="image2" width="100%" />
        <Textblock text={isUA ? texts.TEXT_UA_4 : texts.TEXT_EN_4} />

        <Link
          href="mailto:vsypko.dev@gmail.com?subject=Hockey Team Digital Training"
          sx={{ fontSize: { xs: 16, sm: 30 } }}
        >
          vsypko.dev@gmail.com
        </Link>

        <Typography variant="h4" textAlign="center">
          GOOD LUCK ON ICE
        </Typography>
        <Typography variant="body2" textAlign="center">
          Copyright © VS_DEV 2022
        </Typography>
      </Box>
    </Box>
  )
}
export default Home
