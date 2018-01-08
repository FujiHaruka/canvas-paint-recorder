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
    clearStarted,
    // -- handlers --
    toggleDrawing,
    setPrevCoord,
    clearStart,
    clearDone
  }) {
    return (
      <div class='App'>
        <PaintToolbar {...{clearStart}} />
        <Canvas {...{drawing, prevX, prevY, toggleDrawing, setPrevCoord, clearStarted, clearDone}} />
      </div>
    )
  }
}
