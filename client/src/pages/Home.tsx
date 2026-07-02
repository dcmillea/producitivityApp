import { useState } from 'react'
import CalendarView from '../components/CalendarView'
import TaskStrip from '../components/TaskStrip'

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(new Date())

  return (
    <div className="flex h-full">
      <div className="w-3/4 h-full">
        <CalendarView selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </div>
      <div className="w-1/4 border-l border-white/10 h-full">
        <TaskStrip selectedDay={selectedDay} />
      </div>
    </div>
  )
}