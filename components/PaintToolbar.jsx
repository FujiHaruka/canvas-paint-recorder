import Button from 'preact-material-components/Button'

const PaintToolbar = ({clearStart}) => (
  <div class='PaintToolbar'>
    <Button stroked onClick={clearStart}>CLEAR</Button>
  </div>
)

export default PaintToolbar
