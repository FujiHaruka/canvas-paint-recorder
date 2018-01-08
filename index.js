import './style'
import 'preact-material-components/Button/style.css'
import 'preact-material-components/Toolbar/style.css'
import { Component } from 'preact'
import State from './model/State'
import {
  Header,
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
        <Header />
        <div class='App-main'>
          <PaintToolbar {...{clearStart, recordStart, recording, recordFinish}} />
          <Canvas {...{drawing, prevX, prevY, toggleDrawing, setPrevCoord, clearing, clearDone, recording}} />
        </div>
      </div>
    )
  }
}
