const TaskList = ({ tasks = [], onTaskUpdate, onEditTask }) => {
  const handleTaskComplete = (taskId, completed) => {
    onTaskUpdate(taskId, {
      status: completed ? 'completed' : 'in-progress',
      progress: completed ? 100 : 0
    });
  };

  // ... rest of the component code ...
};