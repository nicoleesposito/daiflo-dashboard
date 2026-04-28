import { useState, useCallback } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import Weather from '../widgets/Weather/Weather'
import TodoList from '../widgets/TodoList/TodoList'
import NewsFeed from '../widgets/NewsFeed/NewsFeed'
import Notepad from '../widgets/Notepad/Notepad'
import SortableWidget from './SortableWidget'
import './Dashboard.css'

const DEFAULT_ORDER = ['weather', 'todo', 'news', 'notepad']

function getInitialOrder() {
  try {
    const saved = localStorage.getItem('daiflo-widget-order')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length === 4 &&
          DEFAULT_ORDER.every(id => parsed.includes(id))) return parsed
    }
  } catch {}
  return DEFAULT_ORDER
}

function renderWidget(id) {
  switch (id) {
    case 'weather':  return <Weather />
    case 'todo':     return <TodoList />
    case 'news':     return <NewsFeed />
    case 'notepad':  return <Notepad />
  }
}

function Dashboard() {
  const [order, setOrder] = useState(getInitialOrder)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return
    setOrder(prev => {
      const next = [...prev]
      const from = next.indexOf(active.id)
      const to   = next.indexOf(over.id)
      ;[next[from], next[to]] = [next[to], next[from]]
      localStorage.setItem('daiflo-widget-order', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={rectSwappingStrategy}>
        <div className="dashboard">
          {order.map((id, index) => (
            <SortableWidget key={id} id={id} slotIndex={index}>
              {renderWidget(id)}
            </SortableWidget>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default Dashboard
