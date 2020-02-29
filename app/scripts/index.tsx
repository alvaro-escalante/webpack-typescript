import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { getId } from './components/functions'
import About from './components/about'

const App = () => {
  const type = 'Typescript'
  const [author, setAuthor] = useState('')

  const list: string[] = [
    'Typescript',
    'Scss with Sourcemaps for dev',
    'Scss Grid generator',
    'Image Optimization',
    'React CSS Transitions',
    'React Hooks'
  ]

  useEffect(() => {
    setTimeout(() => setAuthor('By Alvaro Fernandez-Escalante Naves'), 1000)
  }, [])

  return (
    <main>
      <div className='row align-center'>
        <div className='col-xs-12'>
          <h1>React Webpack Boilerplate</h1>

          <CSSTransition in={true} timeout={2000} classNames='logo' appear>
            <div className='image'></div>
          </CSSTransition>

          <About type={type} />
          <p>A boilerplate for React using:</p>

          <ul className='list'>
            {list.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h6>
            <a href='https://github.com/alvaro-escalante/webpack-typescript'>
              <span className='social icon-github'></span>
            </a>
            {author}
          </h6>
        </div>
      </div>
    </main>
  )
}

export default App

ReactDOM.render(<App />, getId('root'))

if (module.hot) {
  module.hot.accept()
}
