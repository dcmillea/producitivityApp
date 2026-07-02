import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  onSelectDay: (date: Date) => void;
  selectedDay: Date
}

// Mock task dots per day — we'll replace this with real data later
const mockTaskDays: Record<string, { color: string }[]> = {
  [format(new Date(), 'yyyy-MM-dd')]: [
    { color: 'bg-blue-400' },
    { color: 'bg-amber-400' },
  ],
  [format(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd')]: [
    { color: 'bg-blue-400' },
  ],
  [format(new Date(new Date().setDate(new Date().getDate() + 5)), 'yyyy-MM-dd')]: [
    { color: 'bg-blue-400' },
    { color: 'bg-amber-400' },
    { color: 'bg-rose-400' },
  ],
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarView({ onSelectDay, selectedDay }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  return (
    <div className="flex flex-col h-full p-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-xs rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_HEADERS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-zinc-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 flex-1 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
        {days.map((day: Date) => {
          const key = format(day, 'yyyy-MM-dd')
          const dots = mockTaskDays[key] || []
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = isSameDay(day, selectedDay)
          const isTodayDate = isToday(day)
          const isPast = day < new Date() && !isToday(day)

          return (
            <div
              key={key}
              onClick={() => onSelectDay(day)}
              className={`
                relative flex flex-col items-center pt-2 pb-1 gap-1 cursor-pointer bg-zinc-950 transition-colors group
                ${!isCurrentMonth ? 'opacity-25' : ''}
                ${isPast && isCurrentMonth ? 'opacity-50' : ''}
                ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
              `}
            >
              {/* Day number */}
              <span
                className={`
                  text-sm w-7 h-7 flex items-center justify-center rounded-full font-medium transition-colors
                  ${isTodayDate ? 'bg-amber-400 text-zinc-950 font-semibold' : 'text-zinc-300'}
                  ${isSelected && !isTodayDate ? 'bg-white/15 text-white' : ''}
                `}
              >
                {format(day, 'd')}
              </span>

              {/* Task dots */}
              {dots.length > 0 && (
                <div className="flex gap-0.5">
                  {dots.slice(0, 3).map((dot, i) => (
                    <span key={i} className={`w-1 h-1 rounded-full ${dot.color}`} />
                  ))}
                  {dots.length > 3 && (
                    <span className="text-zinc-500 text-[9px] leading-none">+{dots.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}