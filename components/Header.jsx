import {pure} from 'recompose'
import Toolbar from 'preact-material-components/Toolbar'

const {Title, Row} = Toolbar

const Header = () => (
  <Toolbar>
    <Row>
      <Title>Canvas Paint Recorder</Title>
    </Row>
  </Toolbar>
)

export default pure(Header)
