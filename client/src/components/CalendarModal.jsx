import { useState } from 'react';
import './CalendarModal.css';

export default function CalendarModal({ tasks, onClose, onDateSelect }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        onDateSelect(selected);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;
        const days = [];

        for (let i = 0; i < totalSlots; i++) {
            if (i < firstDay || i >= firstDay + daysInMonth) {
                days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
            } else {
                const day = i - firstDay + 1;
                const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                const todayStr = new Date().toDateString();
                const isToday = dateStr === todayStr;

                // Find tasks for this day
                const dayTasks = tasks.filter(task => {
                    const taskDate = new Date(task.deadline);
                    return taskDate.getDate() === day &&
                        taskDate.getMonth() === currentDate.getMonth() &&
                        taskDate.getFullYear() === currentDate.getFullYear();
                });

                days.push(
                    <div
                        key={day}
                        className={`calendar-day ${isToday ? 'today' : ''}`}
                        onClick={() => handleDateClick(day)}
                    >
                        <span className="day-number">{day}</span>
                        {dayTasks.length > 0 && (
                            <span className="task-count-badge">{dayTasks.length}</span>
                        )}
                        <div className="day-tasks">
                            {dayTasks.slice(0, 3).map(task => (
                                <div
                                    key={task.id}
                                    className={`task-dot ${task.priority.toLowerCase()}`}
                                    title={`${task.title} (${task.status})`}
                                ></div>
                            ))}
                            {dayTasks.length > 3 && (
                                <span className="day-task-count">+{dayTasks.length - 3} more</span>
                            )}
                        </div>
                    </div>
                );
            }
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal calendar-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="calendar-header">
                        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                        <div className="calendar-nav">
                            <button className="calendar-nav-btn" onClick={prevMonth}>&lt;</button>
                            <button className="calendar-nav-btn" onClick={nextMonth}>&gt;</button>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="calendar-grid-header">
                        <div className="calendar-weekday">Sun</div>
                        <div className="calendar-weekday">Mon</div>
                        <div className="calendar-weekday">Tue</div>
                        <div className="calendar-weekday">Wed</div>
                        <div className="calendar-weekday">Thu</div>
                        <div className="calendar-weekday">Fri</div>
                        <div className="calendar-weekday">Sat</div>
                    </div>
                    <div className="calendar-grid">
                        {renderCalendar()}
                    </div>
                </div>
            </div>
        </div>
    );
}
