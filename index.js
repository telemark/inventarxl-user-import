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
      const exists = recordset.length !== 0
      log('info', `${id} ${!exists ? 'does not' : ''} exist in database ${config.inventarxl.database}`)
      return exists
    } catch (error) {
      log('error', error)
      process.exit(1)
    }
  }

  async function updateUser (user) {
    try {
      await pool.request()
        .input('id', sql.VarChar(50), user.id)
        .input('navn', sql.VarChar(100), user.navn)
        .input('adresse', sql.VarChar(250), user.adresse)
        .input('postnr', sql.VarChar(50), user.postnr)
        .input('land', sql.VarChar(50), user.land)
        .input('tlf', sql.VarChar(50), user.tlf)
        .input('mob', sql.VarChar(50), user.mob)
        .input('epost', sql.VarChar(50), user.epost)
        .input('info', sql.VarChar(50), user.info)
        .input('ref_kost', sql.VarChar(50), user.ref_kost)
        .input('ref_avd', sql.VarChar(50), user.ref_avd)
        .input('ref_rom', sql.VarChar(50), user.ref_rom)
        .query(`UPDATE personer SET navn=@navn, adresse=@adresse, postnr=@postnr, land=@land, tlf=@tlf, mob=@mob, epost=@epost, info=@info, ref_kost=@ref_kost, ref_avd=@ref_avd, ref_rom=@ref_rom WHERE id = @id`)
      log('info', `Updated user ${id} in database ${config.inventarxl.database}`)
      return
    } catch (error) {
      log('error', error)
      process.exit(1)
    }
  }

  async function insertUser (user) {
    try {
      await pool.request()
        .input('id', sql.VarChar(50), user.id)
        .input('navn', sql.VarChar(100), user.navn)
        .input('adresse', sql.VarChar(250), user.adresse)
        .input('postnr', sql.VarChar(50), user.postnr)
        .input('land', sql.VarChar(50), user.land)
        .input('tlf', sql.VarChar(50), user.tlf)
        .input('mob', sql.VarChar(50), user.mob)
        .input('epost', sql.VarChar(50), user.epost)
        .input('info', sql.VarChar(50), user.info)
        .input('ref_kost', sql.VarChar(50), user.ref_kost)
        .input('ref_avd', sql.VarChar(50), user.ref_avd)
        .input('ref_rom', sql.VarChar(50), user.ref_rom)
        .query(`INSERT INTO personer (id, navn, adresse, postnr, land, tlf, mob, epost, info, ref_kost, ref_avd, ref_rom) VALUES (@id, @navn, @adresse, @postnr, @land, @tlf, @mob, @epost, @info, @ref_kost, @ref_avd, @ref_rom)`)
      return
    } catch (error) {
      log('error', error)
      process.exit(1)
    }
  }

  async function getUser (id) {
    try {
      const { recordset } = await pool.request()
        .input('id', sql.VarChar(50), id)
        .query(`SELECT TOP 1 id, navn, adresse, postnr, land, tlf, mob, epost, info, ref_kost, ref_avd, ref_rom, sted = (SELECT sted FROM postadr PO WHERE P.postnr = PO.Postnr), avd = (SELECT navn FROM avdelinger A WHERE P.ref_avd = A.id), kost = (SELECT navn FROM koststeder K WHERE P.ref_kost = K.id) FROM personer P WHERE P.id = @id`)
      return recordset
    } catch (error) {
      log('error', error)
      process.exit(1)
    }
  }

  const userExists = await checkUserExist('engj')
  const userInfo = await getUser('engj')
  console.log(userInfo)
  process.exit(0)
})()
