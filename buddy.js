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
    pool = await sql.connect(config.buddy)
    log('info', `Connected to ${config.inventarxl.server}/${config.inventarxl.database}`)
  } catch (error) {
    log('error', error)
    process.exit(1)
  }

  async function getUsers () {
    try {
      const { recordset } = await pool.request()
        .query(`SELECT o.Username, o.DisplayName, ISNULL(o.Department,'') 'Department', ISNULL(mv.ID,'') AS klasse, ISNULL(o.Street, '') 'Street', ISNULL(o.PostalCode, '') 'PostalCode', ISNULL(o.City,'') 'City', ISNULL(o.PrivateMobile,'') 'PrivateMobile', ISNULL(o.Mail,'') 'Mail', o.UserT$ FROM tblObjects o LEFT JOIN tblMultiValue mv ON o.ID = mv.StringValue AND mv.ID in (SELECT ID from tblObjects WHERE GroupType = 'Klassegruppe') AND mv.AttributeName in ('Member','owner') AND mv.ID LIKE o.Department + '%' WHERE o.Status = 'Active' AND o.Department in (SELECT id FROM tblObjects WHERE id IN (SELECT id FROM tblMultiValue WHERE AttributeName = 'Organisasjon' AND StringValue = '940192226') AND ObjectType = 'enhet') ORDER BY o.Lastname, o.Firstname, o.UserType`)
      return recordset
    } catch (error) {
      log('error', error)
      process.exit(1)
    }
  }

  const userInfo = await getUsers()
  console.log(userInfo)
  process.exit(0)
})()
