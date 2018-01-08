import {Component} from 'preact'

const enabledOf = (name) => (prev, next) => !prev[name] && next[name]
const disabledOf = (name) => (prev, next) => prev[name] && !next[name]
const enabledOfClearing = enabledOf('clearing')
const enabledOfRecording = enabledOf('recording')
const disabledOfRecording = disabledOf('recording')

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
      </div>
    )
  }

  componentDidMount () {
    this.canvasCtx = this.canvas.getContext('2d')
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
    const {toggleDrawing, setPrevCoord} = this.props
    const {top, left} = e.target.getBoundingClientRect()
    const coord = {
      x: e.clientX - left,
      y: e.clientY - top
    }
    setPrevCoord(coord)
    toggleDrawing(true)
  }

  finishDrawing = (e) => {
    // e.stopPropagation()
    const {toggleDrawing, drawing} = this.props
    if (drawing) {
      toggleDrawing(false)
    }
  }

  keepDrawing = (e) => {
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
    this.drawLine(prevCoord, coord)
    setPrevCoord(coord)
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
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 3
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
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
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
      anchor.href = dataUrl
      anchor.download = 'canvas.webm'
      anchor.click()
      // clean up
      this.recordedBlobs = []
      this.mediaRecorder = null
    }
    mediaRecorder.stop()
  }
}

export default Canvas
