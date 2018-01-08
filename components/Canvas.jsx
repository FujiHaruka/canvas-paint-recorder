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

  componentDidMount () {
    this.canvasCtx = this.canvas.getContext('2d')
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.clearStarted && this.props.clearStarted) {
      Canvas.clear(this.canvas)
      this.props.clearDone()
    }
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
    const {drawing, setPrevCoord, prevX, prevY} = this.props
    if (!drawing) {
      return
    }
    const {top, left} = e.target.getBoundingClientRect()
    const prevCoord = {
      x: prevX,
      y: prevY
    }
    const coord = {
      x: e.clientX - left,
      y: e.clientY - top
    }
    Canvas.drawLine(this.canvasCtx, prevCoord, coord)
    setPrevCoord(coord)
  }

  static drawLine (ctx, from, to) {
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.closePath()
  }

  static clear (canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export default Canvas
