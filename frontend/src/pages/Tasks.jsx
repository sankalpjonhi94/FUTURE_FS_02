import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import Loader from '../components/Loader';
import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/leadApi';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const priorityColor = {
  high: 'text-red-600 bg-red-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50',
};

const statusIcon = {
  pending: <FiCircle className="text-gray-400" size={18} />,
  in_progress: <FiClock className="text-blue-500" size={18} />,
  completed: <FiCheckCircle className="text-green-500" size={18} />,
  cancelled: <FiCircle className="text-red-400" size={18} />,
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await getTasksApi({ status: statusFilter, limit: 50 });
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [statusFilter]);

  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await createTaskApi(form);
      setTasks([data, ...tasks]);
      setShowForm(false);
      toast.success('Task created!');
    } catch {
      toast.error('Error creating task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await updateTaskApi(editTask._id, form);
      setTasks(tasks.map(t => t._id === data._id ? data : t));
      setEditTask(null);
      setShowForm(false);
      toast.success('Task updated!');
    } catch {
      toast.error('Error updating task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTaskApi(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Error deleting task');
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const { data } = await updateTaskApi(task._id, { status: newStatus });
      setTasks(tasks.map(t => t._id === data._id ? data : t));
    } catch {
      toast.error('Error updating task');
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTask(null);
  };

  const isOverdue = (task) =>
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Tasks" />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {['', 'pending', 'in_progress', 'completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border hover:bg-gray-50'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus size={16} /> Add Task
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : tasks.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-gray-400">No tasks found. Create your first task!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`card flex items-start gap-4 hover:shadow-md transition-shadow ${
                    isOverdue(task) ? 'border-l-4 border-red-400' : ''
                  }`}
                >
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {statusIcon[task.status]}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleEdit(task)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(task._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${priorityColor[task.priority]}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className={`text-xs ${isOverdue(task) ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                          📅 {new Date(task.dueDate).toLocaleDateString()} {isOverdue(task) && '(Overdue)'}
                        </span>
                      )}
                      {task.assignedTo && (
                        <span className="text-xs text-gray-400">👤 {task.assignedTo.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showForm && (
        <TaskForm
          task={editTask}
          onSubmit={editTask ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default Tasks;
