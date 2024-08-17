#!/usr/bin/env node

import 'dotenv/config'
import { createServer, IncomingMessage, ServerResponse } from 'http'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import  path  from 'path'
import { fileURLToPath } from 'url'
import { Config } from './config.js'

const nodePath = resolve(process.argv[1])
const modulePath = resolve(fileURLToPath(import.meta.url))
const isCLI = nodePath === modulePath
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
export default function main(port: number = Config.port) {
  const requestListener = async (request: IncomingMessage, response: ServerResponse) => {
    try {
      // Set the content type to text/html
      response.setHeader('Content-Type', 'text/html;charset=utf8')
      
      // Read the HTML file
      const filePath = resolve(__dirname, 'index.html')
      const html = await readFile(filePath, 'utf8')
      
      response.writeHead(200, 'OK')
      response.end(html)
    } catch (error) {
      console.error('Error reading HTML file:', error)
      response.writeHead(500, 'Internal Server Error')
      response.end('An error occurred')
    }
  }

  const server = createServer(requestListener)

  if (isCLI) {
    server.listen(port)
    // eslint-disable-next-line no-console
    console.log(`Listening on port: ${port}`)
  }

  return server
}

if (isCLI) {
  main()
}
