import React, { useState, useCallback } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import debounce from 'lodash/debounce'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  console.log('todos state', todos)

  // Auto-saves when user has stopped type in text-field, Delay by 600ms
  const delayedSave = useCallback(
    debounce((todos) => saveTodoList(todoList.id, { todos }), 600),
    []
  )

  // Updates the todo's state from textfield changes, these changes are automatically saved to server.
  const handleInputChange = (event, index) => {
    var todoObj = { ...todos[index] }
    todoObj.text = event.target.value

    var changedTodo = [...todos.slice(0, index), todoObj, ...todos.slice(index + 1)]

    setTodos(changedTodo)

    //delayed save to server
    delayedSave(changedTodo)
  }

  // Updates the todo's completed state from checkbox changes, these changes are automatically saved to server.
  const handleCheckbox = (event, index) => {
    var todoObj = { ...todos[index] }
    todoObj.completed = event.target.checked

    var changedTodo = [...todos.slice(0, index), todoObj, ...todos.slice(index + 1)]

    setTodos(changedTodo)

    //delayed save to server
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
            todos.map((todo, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1, marginTop: '1rem' }}
                  label='What to do?'
                  value={todo.text}
                  onChange={(event) => {
                    handleInputChange(event, index)
                  }}
                />
                <FormGroup style={{ marginLeft: '1rem' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(event) => {
                          handleCheckbox(event, index)
                        }}
                        checked={todo.completed}
                        color={'success'}
                      />
                    }
                    label='Completed'
                  />
                </FormGroup>
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={() => {
                    handleRemoveTodo(index)
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
                setTodos([...todos, { text: '', completed: false }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
