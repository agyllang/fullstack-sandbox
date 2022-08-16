const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(express.json())

const PORT = 3001

let todoLists = {
  '0000000001': {
    id: '0000000001',
    title: 'First List',
    todos: ['First todo of first list!'],
  },
  '0000000002': {
    id: '0000000002',
    title: 'Second List',
    todos: ['First todo of second list!'],
  },
}

app.get('/', (req, res) => res.send('Hello World!'))



//client GET-calls, returns the todo lists.
app.get('/api', (req, res) => res.json(todoLists))



//Saving Todo lists on server from client POST calls.
app.post('/api/save', (req, res) => {
  const id = req.body.id
  const todos = req.body.todos

  //return message
  res.send("Todo's saved on server")

  //printing for server terminal
  console.log('req.body id', id)
  console.log('req.body.todos', todos)

  todoLists[id].todos = todos

  console.log("todoList server state:,",todoLists)

})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
