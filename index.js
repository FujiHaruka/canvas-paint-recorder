import './style'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Theme/style.css'
import { Component } from 'preact'
import State from './model/State'
import {
  PaintToolbar,
  Canvas
} from './components'

@State
export default class App extends Component {
  render ({
    drawing,
    prevX,
    prevY,
    clearing,
    recording,
    // -- handlers --
    toggleDrawing,
    setPrevCoord,
    clearStart,
    clearDone,
    recordStart,
    recordFinish
  }) {
    return (
      <div class='App'>
        <PaintToolbar {...{clearStart, recordStart, recording, recordFinish}} />
        <Canvas {...{drawing, prevX, prevY, toggleDrawing, setPrevCoord, clearing, clearDone, recording}} />
      </div>
    )
  }
}
