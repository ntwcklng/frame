import React from 'react'
import Head from 'next/head'

export default class extends React.Component {
  constructor() {
    super()
    this.state = {
      clicked: 0
    }
  }
  render() {
    return (
      <div>
        <Head>
          <title>{{name}} ❤  Next.js</title>
          <meta name='viewport' content='initial-scale=1.0, maximum-scale=1, width=device-width' />
        </Head>
        <div className='foo'>
          <span>Hello, world! {this.state.clicked}</span>
          <button onClick={e => this.setState({clicked: this.state.clicked + 1})}>Click Me</button>
        </div>
        <style jsx global>{`
          * {
           box-sizing: border-box;
           text-rendering: geometricPrecision;
           font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
         }
         html {
           background: #f5f5f5;
         }
         body {
           color: #b800e3;
           margin: 0;
         }
         .foo {
           width: 100%;
           margin: 100px auto;
           text-align: center;
         }
         button {
           display: block;
           margin: 10px auto;
           border: 1px solid #b800e3;
           padding: 5px 20px;
           background: #fff;
           color: #585858;
           font-size: 16px;
         }
        `}</style>
      </div>
    )
  }
}
