(async () => {
  require('dotenv').config()
  const sql = require('mssql')
  const pkg = require('./package.json')

  const config = {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || '',
    database: process.env.DB_DATABASE || '',
    debug: true
  }

  function log (level, message) {
    if (config.debug) {
      const formatedMessage = typeof message === 'object' ? JSON.stringify(message) : message
      console.log(`[${level.toUpperCase()}] ${new Date().toUTCString()} ${pkg.name} - ${pkg.version}: ${formatedMessage}`)
    }
  }

  let pool
  try {
    pool = await sql.connect(config)
    log('info', `Connected to ${config.server}/${config.database}`)
  } catch (error) {
    throw error
  }

  async function getUser (id) {
    try {
      const { recordset } = await pool.query`select * from personer where id = ${id}`
      return recordset
    } catch (error) {
      console.log(error)
    }
  }

  const user = await getUser('0411grfr')
  console.log(user)
})()
