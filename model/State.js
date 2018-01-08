import {withStateHandlers, compose} from 'recompose'

const updater = name => state => value => ({[name]: value})

const Canvas = withStateHandlers(
  (props) => ({
    drawing: false,
    prevX: 0,
    prevY: 0,
    clearStarted: false
  }),
  {
    toggleDrawing: updater('drawing'),
    setPrevCoord: (state) => ({x, y}) => ({prevX: x, prevY: y}),
    clearStart: (state) => () => ({clearStarted: true}),
    clearDone: (state) => () => ({clearStarted: false})
  }
)

export default compose(
  Canvas
)
