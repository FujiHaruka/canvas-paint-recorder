import {Component} from 'preact'

const enabledOf = (name) => (prev, next) => !prev[name] && next[name]
const disabledOf = (name) => (prev, next) => prev[name] && !next[name]
const enabledOfClearing = enabledOf('clearing')
const enabledOfRecording = enabledOf('recording')
const disabledOfRecording = disabledOf('recording')

const SKIP_FOR_SMOOTH = 4

class Canvas extends Component {
  render ({
    canvasWidth,
    canvasHeight
  }) {
    return (
      <div class='Canvas-wrap' onMouseUp={this.updateCanvasSize} style={{width: `${canvasWidth}px`, height: `${canvasHeight}px`}}>
        <canvas
          id='paint-canvas'
          width={canvasWidth - 8}
          height={canvasHeight - 8}
          ref={(c) => { this.canvas = c }}
          onMouseDown={this.startDrawing}
          onMouseUp={this.finishDrawing}
          onMouseMove={this.keepDrawing}
          onMouseLeave={this.finishDrawing}
        />
        <canvas
          id='paint-canvas-hidden'
          width={canvasWidth - 8}
          height={canvasHeight - 8}
          ref={(c) => { this.hiddenCanvas = c }}
        />
      </div>
    )
  }

  componentDidMount () {
    this.canvasCtx = this.canvas.getContext('2d')
    this.hiddenCanvasCtx = this.hiddenCanvas.getContext('2d')
    this.recordedBlobs = []
    this.clear()
  }

  componentDidUpdate (prevProps) {
    const {props} = this
    if (enabledOfClearing(prevProps, props)) {
      this.clear()
      this.props.clearDone()
    }
    if (enabledOfRecording(prevProps, props)) {
      this.startRecord()
    }
    if (disabledOfRecording(prevProps, props)) {
      this.stopRecordAndDownload()
    }
  }

  startDrawing = (e) => {
    const {toggleDrawing, setPrevCoord, clearCoords, pushCoords} = this.props
    const {top, left} = e.target.getBoundingClientRect()
    const coord = {
      x: e.clientX - left,
      y: e.clientY - top
    }
    setPrevCoord(coord)
    toggleDrawing(true)
    clearCoords()
    pushCoords(coord)
    this.saveCanvasState()
  }

  finishDrawing = (e) => {
    const {toggleDrawing, drawing, clearCoords} = this.props
    if (drawing) {
      toggleDrawing(false)
      this.replaceSmoothCurve()
      clearCoords()
    }
  }

  keepDrawing = (e) => {
    const {drawing, setPrevCoord, prevX, prevY, pushCoords} = this.props
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
    this.drawLine(prevCoord, coord)
    setPrevCoord(coord)
    pushCoords(coord)
  }

  updateCanvasSize = (e) => {
    const {width: w, height: h} = e.currentTarget.getBoundingClientRect()
    const {canvasWidth, canvasHeight} = this.props
    const shouldUpdate = Math.abs(w - canvasWidth) > 4 || Math.abs(h - canvasHeight) > 4
    if (shouldUpdate) {
      this.props.resizeCanvas({w, h})
    }
  }

  drawLine (from, to) {
    const ctx = this.canvasCtx
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.closePath()
  }

  clear () {
    const {width, height} = this.canvas
    const ctx = this.canvasCtx
    // fill white
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    this.saveCanvasState()
  }

  startRecord () {
    const stream = this.canvas.captureStream(30)
    const mediaRecorder = new window.MediaRecorder(stream, {mimeType: 'video/webm'})
    mediaRecorder.start(100) // 100ms
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedBlobs.push(e.data)
      }
    }
    this.mediaRecorder = mediaRecorder
  }

  stopRecordAndDownload () {
    const {mediaRecorder} = this
    if (!mediaRecorder) {
      return
    }
    mediaRecorder.onstop = () => {
      const {Blob, URL} = window
      const blob = new Blob(this.recordedBlobs, {type: 'video/webm'})
      const dataUrl = URL.createObjectURL(blob)
      // download
      const anchor = document.createElement('a')
      const now = new Date()
      anchor.href = dataUrl
      anchor.download = `canvas_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.webm`
      anchor.click()
      // clean up
      this.recordedBlobs = []
      this.mediaRecorder = null
    }
    mediaRecorder.stop()
  }

  saveCanvasState () {
    const {canvas, canvasCtx, hiddenCanvasCtx} = this
    const {width, height} = canvas
    const img = canvasCtx.getImageData(0, 0, width, height)
    hiddenCanvasCtx.putImageData(img, 0, 0)
  }

  replaceSmoothCurve () {
    const {canvas, canvasCtx, hiddenCanvasCtx: ctx} = this
    const {coords} = this.props
    const skip = SKIP_FOR_SMOOTH * 2
    const points = coords.filter((a, i, array) => i % skip === 0 || i % skip === 1 || i === array.length - 1 || i === array.length - 2)
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#222'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(coords[0], coords[1])
    ctx.curve(points, 0.5)
    ctx.stroke()
    ctx.closePath()
    const {width, height} = canvas
    const img = ctx.getImageData(0, 0, width, height)
    canvasCtx.putImageData(img, 0, 0)
  }
}

export default Canvas
