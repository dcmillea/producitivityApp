import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Circle, CheckCircle2, Plus } from 'lucide-react'
import { format } from 'date-fns'
import api from '../lib/api'

interface Subtask {
  id: string
  title: string
  completed: boolean
}

interface Task {
  id: string
  title: string
  completed: boolean
  color: string
  subtasks: Subtask[]
}

interface TaskStripProps {
  selectedDay: Date
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TaskItem({ task, onUpdate }: { task: Task; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [completed, setCompleted] = useState(task.completed)
  const [subtasks, setSubtasks] = useState(task.subtasks)

  const toggleTask = async () => {
    setCompleted(!completed)
    await api.patch(`/tasks/${task.id}`, { completed: !completed })
  }

  const toggleSubtask = async (id: string, current: boolean) => {
    setSubtasks(prev =>
      prev.map(s => s.id === id ? { ...s, completed: !current } : s)
    )
    await api.patch(`/tasks/subtasks/${id}`, { completed: !current })
  }

  const completedCount = subtasks.filter(s => s.completed).length

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 group rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <button onClick={toggleTask} className="shrink-0">
          {completed
            ? <CheckCircle2 size={16} className="text-zinc-500" />
            : <Circle size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          }
        </button>

        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.color}`} />

        <span className={`text-sm flex-1 ${completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
          {task.title}
        </span>

        {subtasks.length > 0 && (
          <span className="text-[10px] text-zinc-600 shrink-0">
            {completedCount}/{subtasks.length}
          </span>
        )}
      </div>

      {expanded && subtasks.length > 0 && (
        <div className="ml-8 mt-0.5 border-l border-white/10 pl-3">
          {subtasks.map(sub => (
            <div
              key={sub.id}
              className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-white/5 transition-colors group"
            >
              <button onClick={() => toggleSubtask(sub.id, sub.completed)} className="shrink-0">
                {sub.completed
                  ? <CheckCircle2 size={13} className="text-zinc-500" />
                  : <Circle size={13} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                }
              </button>
              <span className={`text-xs ${sub.completed ? 'line-through text-zinc-600' : 'text-zinc-400'}`}>
                {sub.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TaskStrip({ selectedDay }: TaskStripProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const date = format(selectedDay, 'yyyy-MM-dd')
      const { data } = await api.get(`/tasks?date=${date}`)
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  const loadTasks = async () => {
    setLoading(true)
    try {
      const date = format(selectedDay, 'yyyy-MM-dd')
      const { data } = await api.get(`/tasks?date=${date}`)
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }
  loadTasks()
}, [selectedDay])

  const addTask = async () => {
    if (!newTaskTitle.trim()) return
    try {
      await api.post('/tasks', {
        title: newTaskTitle.trim(),
        date: format(selectedDay, 'yyyy-MM-dd'),
      })
      setNewTaskTitle('')
      setAdding(false)
      fetchTasks()
    } catch (err) {
      console.error('Failed to add task', err)
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
          {format(selectedDay, 'EEEE, MMMM d')}
        </p>
        <button
          onClick={() => setAdding(true)}
          className="text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {adding && (
        <div className="mb-3 flex gap-2">
          <input
            autoFocus
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addTask()
              if (e.key === 'Escape') setAdding(false)
            }}
            placeholder="New task..."
            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/20"
          />
          <button
            onClick={addTask}
            className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md text-white transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-600 text-sm">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-zinc-600 text-sm">No tasks for this day.</p>
      ) : (
        <div className="flex flex-col overflow-y-auto">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>
      )}
    </div>
  )
}