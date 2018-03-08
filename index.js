(async () => {
  require('dotenv').config()
  const sql = require('mssql')
  const config = require('./config')
  const pkg = require('./package.json')

  function log (level, message) {
    if (config.debug) {
      const formatedMessage = typeof message === 'object' ? JSON.stringify(message) : message
      console.log(`[${level.toUpperCase()}] ${new Date().toUTCString()} ${pkg.name} - ${pkg.version}: ${formatedMessage}`)
    }
  }

  let pool
  try {
    pool = await sql.connect(config.inventarxl)
    log('info', `Connected to ${config.inventarxl.server}/${config.inventarxl.database}`)
  } catch (error) {
    log('error', error)
    process.exit(1)
  }

  async function checkUserExist (id) {
    try {
      const { recordset } = await pool.request()
        .input('id', sql.VarChar(50), id)
        .query(`SELECT TOP 1 id FROM personer WHERE id = @id`)
      return recordset.length !== 0
    } catch (error) {
      log('error', error)
      process.exit(1)
    }
  }

  async function getUser (id) {
    try {
      const { recordset } = await pool.request()
        .input('id', sql.VarChar(50), id)
        .query(`SELECT TOP 1 id, navn, adresse, postnr, land, tlf, epost, info, ref_kost, ref_avd, ref_rom, sted = (SELECT sted FROM postadr PO WHERE P.postnr = PO.Postnr), avd = (SELECT navn FROM avdelinger A WHERE P.ref_avd = A.id), kost = (SELECT navn FROM koststeder K WHERE P.ref_kost = K.id) FROM personer P WHERE P.id = @id`)
      return recordset
    } catch (error) {
      log('error', error)
      process.exit(1)
    }
  }

  const userExist = await checkUserExist('0411grfr')
  const user = await getUser('0411grfr')
  console.log(user)
  process.exit(0)
})()
