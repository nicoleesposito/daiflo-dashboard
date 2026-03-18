import { useState } from 'react'
import { useStoredData } from '../../../hooks/useStoredData'
import './TodoList.css'

function TodoItem({ task, editMode, onToggle, onDelete, onUpdate }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') e.target.blur()
  }

  return (
    <div className="todo-item">
      {editMode ? (
        <button
          className="todo-item__delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          ×
        </button>
      ) : (
        <input
          className="todo-item__checkbox"
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label="Toggle task complete"
        />
      )}

      {editMode ? (
        <input
          className="todo-item__text-input"
          type="text"
          value={task.text}
          onChange={(e) => onUpdate(task.id, e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className={`todo-item__text${task.completed ? ' todo-item__text--done' : ''}`}>
          {task.text}
        </span>
      )}
    </div>
  )
}

function TodoList() {
  const [tasks, persistTasks] = useStoredData(
    'daiflo_todos', 'todos', [], JSON.parse, JSON.stringify
  )
  const [editMode,     setEditMode]     = useState(false)
  const [newTaskText,  setNewTaskText]  = useState('')

  function addTask(e) {
    e.preventDefault()
    const text = newTaskText.trim()
    if (!text) return
    persistTasks([...tasks, { id: Date.now(), text, completed: false }])
    setNewTaskText('')
  }

  function toggleTask(id) {
    persistTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTask(id) {
    persistTasks(tasks.filter((t) => t.id !== id))
  }

  function updateTask(id, text) {
    persistTasks(tasks.map((t) => (t.id === id ? { ...t, text } : t)))
  }

  return (
    <div className="todo">
      <div className="todo__header">
        <h2 className="todo__title">Tasks</h2>
        <button
          className={`todo__edit-btn${editMode ? ' todo__edit-btn--active' : ''}`}
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>

      <ul className="todo__list" role="list">
        {tasks.length === 0 && <li className="todo__empty">No tasks yet</li>}
        {tasks.map((task) => (
          <li key={task.id}>
            <TodoItem
              task={task}
              editMode={editMode}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </li>
        ))}
      </ul>

      {!editMode && (
        <form className="todo__add-form" onSubmit={addTask}>
          <input
            className="todo__add-input"
            type="text"
            placeholder="Add a task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <button className="todo__add-btn" type="submit" aria-label="Add task">+</button>
        </form>
      )}
    </div>
  )
}

export default TodoList
