import React from "react"
import { Paper, Typography, Grid, IconButton } from "@mui/material"
import { observer } from "mobx-react-lite"
import training from "../assets/Donbass_training.jpg"
import picture1 from "../assets/Diagram_3.png"
import picture2 from "../assets/Diagram_4.jpg"
import picture3 from "../assets/Diagram_6.png"
import picture4 from "../assets/Diagram_9.png"
import picture5 from "../assets/diagram_mob_1.jpg"
import ua_flag from "../assets/ua_flag.svg"
import ua_toggle from "../assets/ua.png"
import gb_toggle from "../assets/gb.png"

import * as textpart from "../utils/texts"

const Index = observer(() => {
  const [isUA, setIsUA] = React.useState(false)

  const TextBlock = (props) => {
    return (
      <Paper
        sx={{
          width: "95vw",
          margin: 1,
          marginBottom: 5,
          padding: 1,
          borderRadius: "10px",
          opacity: 0.95,
        }}
      >
        <Grid container justifySelf="center">
          {props.pic1 ? (
            <Grid
              item
              xs={12}
              sm={props.pic2 ? 4 : 6}
              sx={{
                padding: 2,
              }}
            >
              <img src={props.pic1} alt={toString(props.pic1)} width="100%" />
            </Grid>
          ) : null}
          <Grid
            item
            xs={12}
            sm={props.pic1 ? (props.pic2 ? 4 : 6) : props.pic2 ? 6 : 12}
            sx={{ textJustify: "center", textAlign: "justify" }}
          >
            <Typography
              sx={{
                m: 2,
                fontSize: { xs: "14px", sm: "24px" },
              }}
            >
              {props.text1}
            </Typography>
            <Typography
              sx={{
                m: 2,
                fontSize: { xs: "14px", sm: "24px" },
              }}
            >
              {props.text2}
            </Typography>
          </Grid>
          {props.pic2 ? (
            <Grid
              item
              xs={12}
              sm={props.pic1 ? 4 : 6}
              sx={{
                padding: 2,
              }}
            >
              <img
                src={props.pic2}
                alt={toString(props.pic2)}
                width={props.width}
                height={props.height}
              />
            </Grid>
          ) : null}
        </Grid>
      </Paper>
    )
  }
  //

  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        flexGrow: 1,
        marginTop: 2,
      }}
    >
      <Grid container>
        <Grid item xs={10} sx={{ textAlign: "center" }}>
          <Typography variant="h4">SITE DESCRIPTION</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            textAlign: "center",
          }}
        >
          <IconButton size="small" value={isUA} onClick={() => setIsUA(!isUA)}>
            <img
              src={isUA ? gb_toggle : ua_toggle}
              alt="language"
              width="24px"
            />
          </IconButton>
        </Grid>
      </Grid>

      <TextBlock
        pic1={training}
        text1={!isUA ? textpart.TEXT_EN_1 : textpart.TEXT_UA_1}
        text2={!isUA ? textpart.TEXT_EN_2 : textpart.TEXT_UA_2}
        width="100%"
      />
      <TextBlock
        text1={!isUA ? textpart.TEXT_EN_3 : textpart.TEXT_UA_3}
        text2={!isUA ? textpart.TEXT_EN_4 : textpart.TEXT_UA_4}
        pic2={picture1}
        width="100%"
      />
      <TextBlock
        pic1={picture2}
        text1={!isUA ? textpart.TEXT_EN_5 : textpart.TEXT_UA_5}
        text2={!isUA ? textpart.TEXT_EN_6 : textpart.TEXT_UA_6}
        pic2={picture3}
        width="100%"
      />
      <TextBlock
        pic1={picture4}
        text1={!isUA ? textpart.TEXT_EN_7 : textpart.TEXT_UA_7}
        text2={!isUA ? textpart.TEXT_EN_8 : textpart.TEXT_UA_8}
        pic2={picture5}
        height="700px"
        width="inherit"
      />
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h4">GOOD LUCK ON ICE</Typography>
          <Typography variant="h4">
            GLORY TO UKRAINE
            <img src={ua_flag} alt="ua_glag" width="45px" />
          </Typography>

          <Typography variant="h7">Copyright © VS_DEV 2022</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
})

export default Index
