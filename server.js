const fs = require('fs')
const net = require('net')
const axios = require('axios').default
const express = require('express')
const SocketServer = require('ws').Server
const alias = require('./alias')

async function createServer() {
  const app = express()
  const port = await findFreePort(2233)
  const upstream_alias = await fetchUpstreamAlias()

  app.get('/', (req, res) => {
    let html = fs.readFileSync('markup.html', { encoding: 'utf-8' })
    html = html.replace('ALIAS', JSON.stringify(Object.assign(upstream_alias, alias)))
    res.send(html)
  })

  const server = app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })

  const wss = new SocketServer({ server })

  wss.on('connection', ws => {
    console.log('Client connected')

    ws.on('message', data => {
      data = data.toString()
      console.log(data)

      const clients = wss.clients
      clients.forEach(client => {
        client.send(data)
      })
    })

    ws.on('close', () => {
      console.log('Close connected')
    })
  })
}

createServer()

function fetchUpstreamAlias() {
  return new Promise(resolve => {
    axios.get('https://raw.githubusercontent.com/wang48372162/obs-animes-markup/main/upstream/alias.json')
      .then(({ data }) => {
        resolve(data)
      })
      .catch(() => {
        resolve({})
      })
  })
}

function isPortFree(port) {
  return new Promise(resolve => {
    const server = net.createServer(socket => {
      socket.write('Echo server\r\n')
      socket.pipe(socket)
    })

    server.listen(port, '127.0.0.1')
    server.on('error', () => {
      resolve(false)
    })
    server.on('listening', () => {
      server.close()
      resolve(true)
    })
  })
}

async function findFreePort(start) {
  if (await isPortFree(start)) {
    return start
  }
  return await findFreePort(start + 1)
}
