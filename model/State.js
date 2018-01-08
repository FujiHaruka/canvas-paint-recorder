import {withStateHandlers, compose} from 'recompose'

const updater = name => state => value => ({[name]: value})

const Canvas = withStateHandlers(
  (props) => ({
    drawing: false,
    canvasWidth: 500,
    canvasHeight: 300,
    prevX: 0,
    prevY: 0,
    clearing: false,
    recording: false
  }),
  {
    toggleDrawing: updater('drawing'),
    setPrevCoord: (state) => ({x, y}) => ({prevX: x, prevY: y}),
    resizeCanvas: (state) => ({w, h}) => ({canvasWidth: w, canvasHeight: h}),
    clearStart: (state) => () => ({clearing: true}),
    clearDone: (state) => () => ({clearing: false}),
    recordStart: (state) => () => ({recording: true}),
    recordFinish: (state) => () => ({recording: false})
  }
)

export default compose(
  Canvas
)
