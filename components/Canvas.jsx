import {Component} from 'preact'

const enabledOf = (name) => (prev, next) => !prev[name] && next[name]
const disabledOf = (name) => (prev, next) => prev[name] && !next[name]
const enabledOfClearing = enabledOf('clearing')
const enabledOfRecording = enabledOf('recording')
const disabledOfRecording = disabledOf('recording')

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
    this.drawLine(prevCoord, coord)
    setPrevCoord(coord)
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
