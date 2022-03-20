import { makeAutoObservable } from 'mobx'

class LayerState {
  topLayer = null
  lowLayer = null

  constructor() {
    makeAutoObservable(this)
  }

  setTopLayer(topLayer) {
    this.topLayer = topLayer
  }
  setLowLayer(lowLayer) {
    this.lowLayer = lowLayer
  }
  setCanvasScape(canvasScape) {
    this.canvasScape = canvasScape
  }
}
export default new LayerState()
