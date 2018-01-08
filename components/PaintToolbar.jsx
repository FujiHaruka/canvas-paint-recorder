import {pure} from 'recompose'
import Button from 'preact-material-components/Button'

const PaintToolbar = ({clearStart, recordStart, recordFinish, recording, isMediaRecorderSupported}) => (
  <div class='PaintToolbar'>
    <span class='PaintToolbar-button'>
      <Button raised ripple onClick={recording ? recordFinish : recordStart} disabled={!isMediaRecorderSupported}>
        {recording ? 'FINISH' : 'RECORD'}
      </Button>
    </span>
    <span class='PaintToolbar-button'>
      <Button stroked onClick={clearStart}>
        CLEAR
      </Button>
    </span>
    <span class='PaintToolbar-message'>
      <span class='PaintToolbar-message-inner'>
        {recording && 'Recording...'}
      </span>
    </span>
  </div>
)

export default pure(PaintToolbar)
