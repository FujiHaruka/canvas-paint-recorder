import {withStateHandlers, compose} from 'recompose'

const updater = name => state => value => ({[name]: value})

const Canvas = withStateHandlers(
  (props) => ({
    drawing: false,
    prevX: 0,
    prevY: 0
  }),
  {
    toggleDrawing: updater('drawing'),
    setPrevCoord: (state) => ({x, y}) => ({prevX: x, prevY: y})
  }
)

export default compose(
  Canvas
)
