import {Component} from 'preact'

class Canvas extends Component {
  render (props) {
    return (
      <canvas
        id='paint-canvas'
        width={500}
        height={500}
        ref={(c) => { this.canvas = c }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      />
    )
  }

  onMouseDown = (e) => {
    const {toggleDrawing, setPrevCoord} = this.props
    const {top, left} = e.target.getBoundingClientRect()
    const coord = {
      x: e.clientX - left,
      y: e.clientY - top
    }
    setPrevCoord(coord)
    toggleDrawing(true)
  }

  onMouseUp = () => {
    const {toggleDrawing} = this.props
    toggleDrawing(false)
  }

  onMouseMove = (e) => {
    const {drawing, setPrevCoord} = this.props
    if (!drawing) {
      return
    }
    const {top, left} = e.target.getBoundingClientRect()
    const coord = {
      x: e.clientX - left,
      y: e.clientY - top
    }
    this.draw(coord)
    setPrevCoord(coord)
  }

  draw = ({x, y}) => {
    const {canvas} = this
    const ctx = canvas.getContext('2d')
    const {prevX, prevY} = this.props
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = '10px'
    ctx.beginPath()
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.closePath()
  }
}

export default Canvas
