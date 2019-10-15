import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [videoes, setVideoes] = useState([])
  const [ws, setWs] = useState(null)

  useEffect(() => {
    var ws = new WebSocket('ws://localhost:8999')
    setWs(ws)
    ws.onopen = function() {}
    return () => {
      setWs(null)
    }
  }, [])

  useEffect(() => {
    if (ws) {
      ws.onmessage = ({ data }) => {
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
  }, [ws, videoes])

  const playVideo = video => {
    if (ws) ws.send(video)
  }

  return (
    <div className="App">
      <header className="App-header">
        {videoes.map((e, i) => (
          <button key={i} onClick={() => playVideo(e.file)} title={e.desc}>
            Play{e.playing ? 'ing' : ''} {e.name}
          </button>
        ))}
      </header>
    </div>
  )
}

export default App
