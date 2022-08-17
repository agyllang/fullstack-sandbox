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

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import debounce from 'lodash/debounce'

const timeLeft = (time) => {
  var currentTime = Date.now()

  var timeDifference = time - currentTime

  return timeDifference
}

const convertTimeStamp = (t) => {
  var overdue = t < 0 //t is negative, it means that more time has passed since the todo was due
  var time = Math.abs(t) 

  var days = Math.floor(time / (1000 * 60 * 60 * 24))
  var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
  return { days: days, hours: hours, minutes: minutes, overdue: overdue }
}

const DueComponent = ({ time, completed }) => {

  var timeObj = convertTimeStamp(timeLeft(time))

  return (
    time !== undefined &&
    !completed && (
      <div
        style={{
          color: 'rgba(0, 0, 0, 0.6)',
          fontFamily: 'Arial',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '1.4375em',
          letterSpacing: '0.00938em',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{timeObj.overdue ? 'Overdue by:' : 'Due in:'}</div>
        <div>
          <span>
            Days:{timeObj.days} Hours:{timeObj.hours} Minutes:{timeObj.minutes}
          </span>
        </div>
      </div>
    )
  )
}

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)

  // Auto-saves once user has stopped interacting with the chosen input-component, Delay by 600ms
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

  // Removes todo's from state and saves to server
  const handleRemoveTodo = (index) => {
    var changedTodoList = [...todos.slice(0, index), ...todos.slice(index + 1)]

    setTodos(changedTodoList)

    delayedSave(changedTodoList)
  }

  
  const handleDateChange = (value, index) => {
    var todoObj = { ...todos[index] }
    todoObj.dueDate = value.getTime()

    var changedTodo = [...todos.slice(0, index), todoObj, ...todos.slice(index + 1)]

    setTodos(changedTodo)

    //delayed save to server
    delayedSave(changedTodo)
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos !== undefined &&
            todos.map((todo, index) => (
              <div
                key={index}
                style={{ display: 'flex', alignItems: 'flex-start', marginTop: '1rem' }}
              >
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1 }}
                  label='What to do?'
                  value={todo.text}
                  onChange={(event) => {
                    handleInputChange(event, index)
                  }}
                />
                <div>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label='Due date'
                      ampm={false}
                      value={todo.dueDate}
                      onChange={(value) => handleDateChange(value, index)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <DueComponent time={todo.dueDate} completed={todo.completed} />
                </div>
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
