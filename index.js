const express = require('express')
const cors =require("cors")
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
app.use(cors())
const path = require('path')

const dbPath = path.join(__dirname, 'cricket.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//creating table

app.post('/login/', async (request, response) => {
  const addquery = `
CREATE TABLE registration(
  username VARCHAR(250),
  password  CHAR(60)
)`

  const dbresponse = await db.all(addquery)
  response.send(dbresponse)
})

app.post('/player/', async (request, response) => {
  const playerDetails = request.body
  const {username, password} = playerDetails
  const getBooksQuery = `
    INSERT INTO
  registration(username,password)
VALUES(
    "${username}",
    ${password})`
  const dbResponse = await db.run(getBooksQuery)
  const bookId = dbResponse.lastID
  response.send({bookId: bookId})
})
