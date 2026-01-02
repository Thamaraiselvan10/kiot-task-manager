import './DayDetailsModal.css';

export default function DayDetailsModal({ date, tasks, onClose, onAddTask }) {
    if (!date) return null;

    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Filter tasks for this specific date
    const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate.getDate() === date.getDate() &&
            taskDate.getMonth() === date.getMonth() &&
            taskDate.getFullYear() === date.getFullYear();
    });

    return (
        <div className="modal-overlay day-details-overlay" onClick={onClose}>
            <div className="modal day-details-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{formattedDate}</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {dayTasks.length === 0 ? (
                        <div className="no-tasks-message">
                            No tasks scheduled for this day.
                        </div>
                    ) : (
                        <div className="day-tasks-list">
                            {dayTasks.map(task => (
                                <div key={task.id} className="day-task-item">
                                    <div className="day-task-header">
                                        <span className="day-task-title">{task.title}</span>
                                        <div className="day-task-badges">
                                            <span className={`badge badge-${task.priority.toLowerCase()}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="day-task-meta">
                                        <span>
                                            Status: <span className={`status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                                        </span>
                                        <span>
                                            {task.assignees?.length > 0
                                                ? `Assigned to: ${task.assignees.map(a => a.name).join(', ')}`
                                                : 'Unassigned'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={onAddTask}>+ Add Task</button>
                </div>
            </div>
        </div>
    );
}
