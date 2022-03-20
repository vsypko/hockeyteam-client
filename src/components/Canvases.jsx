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

  const lowLayerRef = React.useRef()
  const topLayerRef = React.useRef()

  React.useEffect(() => {
    layerState.setCanvasScape(canvasScape)
    layerState.setLowLayer(lowLayerRef.current)
    layerState.setTopLayer(topLayerRef.current)
    teamState.rinkInit()
  }, [canvasScape])

  return (
    <Box className="arena">
      <canvas ref={lowLayerRef} width={width} height={height} className="lowlayer"></canvas>
      <canvas ref={topLayerRef} width={width} height={height} className="toplayer"></canvas>
    </Box>
  )
})

export default Canvases
