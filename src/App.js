import React, { useState, useEffect } from 'react'
import './App.css'

const IS_LOCAL = process.env.REACT_APP_IS_LOCAL !== 'false'
const WS_URL_CLOUD = process.env.REACT_APP_CLOUD
const WS_URL_LOCAL = process.env.REACT_APP_LOCAL

function App() {
  const [videoes, setVideoes] = useState([])
  const [wsLocal, setWsLocal] = useState(null)
  const [wsCloud, setWsCloud] = useState(null)

  useEffect(() => {
    setWsCloud(new WebSocket(WS_URL_CLOUD))
    if (IS_LOCAL) setWsLocal(new WebSocket(WS_URL_LOCAL))
    return () => {
      setWsCloud(null)
      if (IS_LOCAL) setWsLocal(null)
    }
  }, [])

  useEffect(() => {
    if (wsCloud) {
      wsCloud.onmessage = ({ data }) => {
        if (IS_LOCAL) {
          try {
            const { status, ...result } = JSON.parse(data)
            switch (status) {
              case 'play':
                if (wsLocal) wsLocal.send(result.file)
                break
              default:
                break
            }
          } catch (e) {}
        } else {
          try {
            const { status, ...result } = JSON.parse(data)
            switch (status) {
              case 'init':
                setVideoes(result.videoes)
                break
              case 'play':
                const videoesCpy1 = videoes.map(e => ({
                  ...e,
                  playing: e.file === result.file,
                }))
                setVideoes(videoesCpy1)
                break
              case 'done':
                const videoesCpy2 = videoes.map(e => ({
                  ...e,
                  playing: e.file === result.file ? false : !!e.playing,
                }))
                setVideoes(videoesCpy2)
                break
              default:
                break
            }
          } catch (e) {}
        }
      }
    }
  }, [wsCloud, wsLocal, videoes])

  const playVideo = video => {
    if (wsCloud) wsCloud.send(`broadcast:${video}`)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>{IS_LOCAL ? 'Local' : 'Cloud'}</h1>
        {IS_LOCAL
          ? null
          : videoes.map((e, i) => (
              <button key={i} onClick={() => playVideo(e.file)} title={e.desc}>
                Play{e.playing ? 'ing' : ''} {e.name}
              </button>
            ))}
      </header>
    </div>
  )
}

export default App
