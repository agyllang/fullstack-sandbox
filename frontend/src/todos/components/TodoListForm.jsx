import React, { useState, useCallback } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import debounce from 'lodash/debounce'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  console.log('todos state', todos)

  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   saveTodoList(todoList.id, { todos })
  // }

  // Auto-saves when user has stopped type in text-field, Delay by 600ms
  const delayedSave = useCallback(
    debounce((todos) => saveTodoList(todoList.id, { todos }), 600),
    []
  )
  const handleInputChange = (event, index) => {
    var changedTodo = [...todos.slice(0, index), event.target.value, ...todos.slice(index + 1)]
    
    setTodos(
      // [
      //   // immutable update
      //   ...todos.slice(0, index),
      //   event.target.value,
      //   ...todos.slice(index + 1),
      // ]
      changedTodo
    )
    delayedSave(changedTodo)
  }

  const handleRemoveTodo = (index) => {
    var changedTodoList = [...todos.slice(0, index), ...todos.slice(index + 1)]

    setTodos(changedTodoList)

    delayedSave(changedTodoList)
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          // onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos !== undefined &&
            todos.map((name, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1, marginTop: '1rem' }}
                  label='What to do?'
                  value={name}
                  onChange={(event) => {
                    handleInputChange(event, index)
                    // setTodos([
                    //   // immutable update
                    //   ...todos.slice(0, index),
                    //   event.target.value,
                    //   ...todos.slice(index + 1),
                    // ])
                  }}
                />
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={() => {
                    handleRemoveTodo(index)
                    // setTodos([
                    //   // immutable delete
                    //   ...todos.slice(0, index),
                    //   ...todos.slice(index + 1),
                    // ])
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, ''])
              }}
            >
              Add Todo <AddIcon />
            </Button>
            {/* <Button type='submit' variant='contained' color='primary'>
              Save
            </Button> */}
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
