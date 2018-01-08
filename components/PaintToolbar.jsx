import {pure} from 'recompose'
import Button from 'preact-material-components/Button'

const PaintToolbar = ({clearStart, recordStart, recordFinish, recording}) => (
  <div class='PaintToolbar'>
    <span class='PaintToolbar-button'>
      <Button raised ripple onClick={recording ? recordFinish : recordStart}>
        {recording ? 'FINISH' : 'RECORD'}
      </Button>
    </span>
    <span class='PaintToolbar-button'>
      <Button stroked onClick={clearStart}>
        CLEAR
      </Button>
    </span>
  </div>
)

export default pure(PaintToolbar)
