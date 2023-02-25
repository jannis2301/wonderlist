import React, { useState, useEffect } from 'react'
import { CgDarkMode } from 'react-icons/cg'
import List from './List'
import Alert from './Alert'

const getStorageList = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return JSON.parse(list)
  } else {
    return []
  }
}

const getStorageTheme = () => {
  let theme = 'dark-theme'
  if (localStorage.getItem('theme')) {
    theme = localStorage.getItem('theme')
  }
  return theme
}

function App() {
  const [theme, setTheme] = useState(getStorageTheme())
  const [name, setName] = useState('')
  const [list, setList] = useState(getStorageList)
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(0)
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
  })

  const toggleTheme = () => {
    if (theme === 'light-theme') {
      setTheme('dark-theme')
    } else {
      setTheme('light-theme')
    }
  }

  useEffect(() => {
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
    localStorage.setItem('list', JSON.stringify(list))
  }, [list, theme])

  const handleChange = (e) => setName(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name) {
      // display alert
      showAlert(true, 'danger', 'please enter value')
    } else if (name && isEditing) {
      // deal with edit
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name }
          }
          return item
        })
      )
      setName('')
      setEditID(null)
      setIsEditing(false)
      showAlert(true, 'success', 'value changed')
    } else {
      //show alert
      showAlert(true, 'success', 'added the task to the list')
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem])
      setName('')
    }
  }

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }

  const clearList = () => {
    showAlert(true, 'danger', 'empty list')
    setList([])
  }

  const removeItem = (id) => {
    showAlert(true, 'danger', 'task removed')
    setList(list.filter((item) => item.id !== id))
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id)
    setIsEditing(true)
    setEditID(id)
    setName(specificItem.title)
  }

  return (
    <main className="main-container">
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <section className="section-center">
        <button className="btn theme-btn" onClick={toggleTheme}>
          <CgDarkMode />
        </button>
        <div className="todo-container">
          <form className="todo-form" onSubmit={handleSubmit}>
            <h3>WonderList</h3>
            <div className="form-control">
              <input
                type="text"
                className="todo"
                placeholder="e.g. take time for yourself"
                value={name}
                onChange={handleChange}
              />
              <button type="submit" className="btn submit-btn">
                {isEditing ? 'edit' : 'submit'}
              </button>
            </div>
          </form>
          {list.length > 0 && (
            <div className="todo-box">
              <List items={list} removeItem={removeItem} editItem={editItem} />
              <button className="btn clear-btn" onClick={clearList}>
                clear all
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
