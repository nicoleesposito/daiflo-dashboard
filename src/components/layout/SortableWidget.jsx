import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function DragIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <circle cx="3.5" cy="2" r="1.2" />
      <circle cx="8.5" cy="2" r="1.2" />
      <circle cx="3.5" cy="6" r="1.2" />
      <circle cx="8.5" cy="6" r="1.2" />
      <circle cx="3.5" cy="10" r="1.2" />
      <circle cx="8.5" cy="10" r="1.2" />
    </svg>
  )
}

function SortableWidget({ id, slotIndex, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`widget widget--slot-${slotIndex}${isDragging ? ' widget--dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      <button className="widget__drag-handle" {...listeners} aria-label="Drag to reposition widget">
        <DragIcon />
      </button>
      {children}
    </div>
  )
}

export default SortableWidget
