import { preact, h, render, Component } from 'preact'
import '!style!css!sass!./index.scss'

class MyComp extends Component {
  constructor () {
    super()
    this.state = {
      clicked: 0
    }
  }
  render () {
    return (
      <div className='app'>
        <span>Hello, world! {this.state.clicked}</span>
        <button onClick={e => this.setState({clicked: this.state.clicked + 1})}>Click Me</button>
      </div>
    )
  }
}

render(<MyComp />, document.getElementById('preact-root'))
