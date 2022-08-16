import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'

// Simulate network
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// const fetchTodoLists = () => {
//   return sleep(1000).then(() =>
//     Promise.resolve({
//       '0000000001': {
//         id: '0000000001',
//         title: 'First List',
//         todos: ['First todo of first list!'],
//       },
//       '0000000002': {
//         id: '0000000002',
//         title: 'Second List',
//         todos: ['First todo of second list!'],
//       },
//     })
//   )
// }

const fetchTodoLists = async () => {
  const response = await fetch('http://localhost:3001/api')
  return await response.json()
}
const saveTodosToLocalServer = (id, todos) => {
  console.log("saveTodosToLocalServer todos:",todos)
  console.log("id:",id)
  fetch('http://localhost:3001/api/save', {
    method: 'POST',
    body: JSON.stringify({ id: id, todos: todos }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  // .then((response) =>
  //   response.json().then((data) => {
  //     console.log('saved data:', data)
  //   })
  // )
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {

    fetchTodoLists().then(setTodoLists)
  }, [])

  if (!Object.keys(todoLists).length) return null
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoLists).map((key) => (
              <ListItem key={key} button onClick={() => setActiveList(key)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoLists[key].title} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={(id, { todos }) => {
            console.log("todos prop",todos)
            const listToUpdate = todoLists[id]
            setTodoLists({
              ...todoLists,
              [id]: { ...listToUpdate, todos },
            })
            saveTodosToLocalServer(id, todos)
          }}
        />
      )}
    </Fragment>
  )
}
