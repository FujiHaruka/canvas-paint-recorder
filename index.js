import './style'
import './curve.min.js'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Toolbar/style.css'
import {Component} from 'preact'
import State from './model/State'
import {
  Header,
  PaintToolbar,
  Canvas,
  NotSupportedMessage
} from './components'

@State
export default class App extends Component {
  render ({
    drawing,
    prevX,
    prevY,
    canvasWidth,
    canvasHeight,
    clearing,
    recording,
    isMediaRecorderSupported,
    coords,
    // -- handlers --
    toggleDrawing,
    setPrevCoord,
    resizeCanvas,
    clearStart,
    clearDone,
    recordStart,
    recordFinish,
    pushCoords,
    clearCoords
  }) {
    return (
      <div class='App'>
        <Header />
        <div class='App-main'>
          <NotSupportedMessage enabled={!isMediaRecorderSupported} />
          <PaintToolbar {...{
            clearStart,
            recordStart,
            recording,
            isMediaRecorderSupported,
            recordFinish
          }} />
          <Canvas {...{
            drawing,
            prevX,
            prevY,
            canvasWidth,
            canvasHeight,
            resizeCanvas,
            toggleDrawing,
            setPrevCoord,
            clearing,
            clearDone,
            coords,
            pushCoords,
            clearCoords,
            recording}}
          />
        </div>
      </div>
    )
  }

  componentDidMount () {
    if (!window.MediaRecorder) {
      this.props.falseMediaRecorderSupported()
    }
  }
}
