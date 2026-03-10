"use client";
import { useState } from "react";
import { TaskItem } from "../types";

const emptyTask = (): TaskItem => ({
  id: Date.now(),
  catId: "",
  price: "",
  employeeIds: [],
});

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([{ id: 1, catId: "", price: "", employeeIds: [] }]);

  const addTask = () => setTasks((prev) => [...prev, emptyTask()]);

  const removeTask = (id: number) => {
    if (tasks.length > 1) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleTaskChange = (id: number, field: string, value: string | string[]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleEmployeeToggle = (taskId: number, employeeId: string) => {
    const toggle = (task: TaskItem) => {
      if (task.id !== taskId) return task;
      const already = task.employeeIds.includes(employeeId);
      return {
        ...task,
        employeeIds: already
          ? task.employeeIds.filter((id) => id !== employeeId)
          : [...task.employeeIds, employeeId],
      };
    };
    setTasks((prev) => prev.map(toggle));
  };

  const getTotalPrice = () =>
    tasks.reduce((sum, t) => sum + (Number.parseFloat(t.price) || 0), 0);

  const resetTasks = () => setTasks([emptyTask()]);

  return { tasks, addTask, removeTask, handleTaskChange, handleEmployeeToggle, getTotalPrice, resetTasks };
}
