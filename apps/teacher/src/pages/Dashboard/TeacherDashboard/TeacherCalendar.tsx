import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { axiosInstance as api } from '@elearning/shared';
import "@elearning/shared/styles/TeacherDashboard/TeacherCalendar.css";

type EventType = "live" | "assignment" | "deadline";

interface CalEvent {
  day: number; month: number; year: number;
  title: string; type: EventType;
  date: string; time: string;
}

const DOT_COLOR: Record<EventType, string> = {
  live: "var(--teacher-primary)", assignment: "#7c3aed", deadline: "#ef4444",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const TeacherCalendar = () => {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/teacher/calendar-events");
        if (res.data?.length) setEvents(res.data);
      } catch (err) {
        console.error("fetchEvents error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const year  = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells: { day: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, isCurrentMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, isCurrentMonth: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, isCurrentMonth: false });

  const eventsForDay = (day: number) => events.filter(e => e.day === day && e.month === month && e.year === year);

  const isToday = (day: number, isCurrent: boolean) =>
    isCurrent && year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

  return (
    <div className="tcal-layout">
      <div>
        {/* Header */}
        <div className="tcal-header">
          <div className="tcal-nav">
            <button className="tcal-nav-btn" onClick={() => setCurrent(new Date(year, month - 1, 1))}>
              <ChevronLeft size={16} />
            </button>
            <span className="tcal-month">{MONTH_NAMES[month]} {year}</span>
            <button className="tcal-nav-btn" onClick={() => setCurrent(new Date(year, month + 1, 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="tcal-legend">
            <div className="tcal-legend-item"><div className="tcal-dot live" /> Live Class</div>
            <div className="tcal-legend-item"><div className="tcal-dot assignment" /> Assignment</div>
            <div className="tcal-legend-item"><div className="tcal-dot deadline" /> Deadline</div>
          </div>
        </div>

        {/* Calendar Grid */}
        {loading && <div className="td-loading"><div className="td-spinner" /></div>}
        <div className="tcal-grid">
          <div className="tcal-weekdays">
            {WEEKDAYS.map(d => <div key={d} className="tcal-weekday">{d}</div>)}
          </div>
          <div className="tcal-days">
            {cells.map((cell, i) => (
              <div
                key={i}
                className={`tcal-day${!cell.isCurrentMonth ? " other-month" : ""}${isToday(cell.day, cell.isCurrentMonth) ? " today" : ""}`}
              >
                <div className="tcal-day-num">{cell.day}</div>
                {cell.isCurrentMonth && (
                  <div className="tcal-events">
                    {eventsForDay(cell.day).map((e, ei) => (
                      <div key={ei} className={`tcal-event ${e.type}`}>{e.title}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="td-card">
        <div className="td-card-header"><span className="td-card-title">📌 Upcoming Events</span></div>
        <div className="td-card-body" style={{ padding: "1rem" }}>
          <div className="tcal-upcoming-list">
            {events.slice(0, 5).map((e, i) => (
              <div key={i} className="tcal-upcoming-item">
                <div className="tcal-upcoming-dot" style={{ background: DOT_COLOR[e.type] || "var(--teacher-primary)" }} />
                <div className="tcal-upcoming-body">
                  <strong>{e.title}</strong>
                  <span>{e.date} · {e.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCalendar;
