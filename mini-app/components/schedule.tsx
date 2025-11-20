"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "./ui/alert-dialog";

interface Task {
  id: number;
  title: string;
  due: Date;
  completed: boolean;
}

export default function Schedule() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Morning meeting with team",
      due: new Date(new Date().setHours(9, 0, 0, 0)),
      completed: false,
    },
    {
      id: 2,
      title: "Submit project report",
      due: new Date(new Date().setHours(14, 0, 0, 0)),
      completed: false,
    },
    {
      id: 3,
      title: "Call with client",
      due: new Date(new Date().setHours(16, 30, 0, 0)),
      completed: false,
    },
  ]);

  const [rescheduleTask, setRescheduleTask] = useState<Task | null>(null);
  const [newDue, setNewDue] = useState<string>("");

  const now = new Date();

  const overdueTasks = tasks.filter(
    (t) => !t.completed && t.due < now
  );
  const dueSoonTasks = tasks.filter(
    (t) => !t.completed && t.due >= now && t.due <= new Date(now.getTime() + 60 * 60 * 1000)
  );

  const markComplete = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
  };

  const openReschedule = (task: Task) => {
    setRescheduleTask(task);
    setNewDue(task.due.toISOString().slice(0, 16));
  };

  const confirmReschedule = () => {
    if (rescheduleTask && newDue) {
      const updated = new Date(newDue);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === rescheduleTask.id ? { ...t, due: updated } : t
        )
      );
    }
    setRescheduleTask(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Daily Schedule</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 rounded-md border ${
              task.completed
                ? "bg-green-100 border-green-200"
                : task.due < now
                ? "bg-red-100 border-red-200"
                : task.due <= new Date(now.getTime() + 60 * 60 * 1000)
                ? "bg-yellow-100 border-yellow-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Due: {task.due.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex gap-2">
                {!task.completed && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openReschedule(task)}
                  >
                    Reschedule
                  </Button>
                )}
                {!task.completed && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markComplete(task.id)}
                  >
                    Done
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium">Summary</h3>
        <p>Total tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter((t) => t.completed).length}</p>
        <p>Overdue: {overdueTasks.length}</p>
      </div>

      {rescheduleTask && (
        <AlertDialog open={true} onOpenChange={() => setRescheduleTask(null)}>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Open</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reschedule Task</AlertDialogTitle>
              <AlertDialogDescription>
                Change the due time for `${rescheduleTask.title}`
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4">
              <input
                type="datetime-local"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
            <AlertDialogFooter className="mt-4 flex justify-end gap-2">
              <AlertDialogCancel onClick={() => setRescheduleTask(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmReschedule}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
