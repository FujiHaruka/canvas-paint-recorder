import {pure} from 'recompose'

const NotSupportedMessage = ({enabled}) =>
 enabled
 ? (
   <div class='NotSupportedMessage'>
     MediaStream Recording API is not supported on this browser.<br />
     Recording is not available.<br />
     See <a href='https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder' target='_blank'>MediaRecorder - Web APIs | MDN</a> for detail.
   </div>
 )
 : null

export default pure(NotSupportedMessage)
