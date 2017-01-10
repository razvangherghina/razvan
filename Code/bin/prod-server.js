const project = require('../config/project.config')
const server = require('../server/main')
const debug = require('debug')('app:bin:prod-server')

server.listen(project.server_port)
debug(`Server is now running in production at http://localhost:${project.server_port}.`)
