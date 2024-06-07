import React from 'react'
import { observer } from 'mobx-react-lite'
import layerState from './store/layerState'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import teamState from './store/teamState'
import '../styles/canvas.scss'

const Canvases = observer(() => {
  const canvasScape = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  let width = canvasScape ? 387 : 787
  let height = canvasScape ? 787 : 387

  const lowlayer = React.useRef(null)
  const toplayer = React.useRef(null)

  React.useEffect(() => {
    if (lowlayer.current && toplayer.current) {
      layerState.setCanvasScape(canvasScape)
      layerState.setLowLayer(lowlayer.current)
      layerState.setTopLayer(toplayer.current)
      teamState.rinkInit()
    }
  }, [lowlayer, toplayer, canvasScape])

  return (
    <Box className="arena">
      <canvas
        ref={lowlayer}
        width={width}
        height={height}
        className="lowlayer"
      />
      <canvas
        ref={toplayer}
        width={width}
        height={height}
        className="toplayer"
      />
    </Box>
  )
})

export default Canvases
