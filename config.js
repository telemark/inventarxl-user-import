module.exports = {
  inventarxl: {
    user: process.env.INVENTAR_DB_USER || '',
    password: process.env.INVENTAR_DB_PASSWORD || '',
    server: process.env.INVENTAR_DB_SERVER || '',
    database: process.env.INVENTAR_DB_DATABASE || ''
  },
  buddy: {
    user: process.env.BUDDY_DB_USER || '',
    password: process.env.BUDDY_DB_PASSWORD || '',
    server: process.env.BUDDY_DB_SERVER || '',
    database: process.env.BUDDY_DB_DATABASE || ''
  },
  debug: true
}
