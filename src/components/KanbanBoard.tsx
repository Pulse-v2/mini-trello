import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { useMutation } from '@apollo/client';
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION, DELETE_TASK_MUTATION } from '../graphql/mutations';


interface CreateTaskData {
  createTask: Task;
}

interface CreateTaskVariables {
  columnId: string;
  content: string;
}
interface UpdateTaskData {
  updateTask: Task;
}

interface UpdateTaskVariables {
  id: string;
  columnId: string;
  content: string;
}
interface DeleteTaskData {
  deleteTask: Task;
}

interface DeleteTaskVariables {
  id: string;
}
const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Doing",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
    createdDate: new Date().toLocaleString()
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
    createdDate: new Date().toLocaleString()

  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
    createdDate: new Date().toLocaleString()
  },
];

const KanbanBoard = () => {
    const [createTaskMutation, {  }] = useMutation<CreateTaskData, CreateTaskVariables>(CREATE_TASK_MUTATION);
    const [updateTaskMutation, {  }] = useMutation<UpdateTaskData, UpdateTaskVariables>(UPDATE_TASK_MUTATION);
    const [deleteTaskMutation, {  }] = useMutation<DeleteTaskData, DeleteTaskVariables>(DELETE_TASK_MUTATION);

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  
const generateId = () => {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 100001);
}

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
      createdDate: new Date().toLocaleString()
    };
    setTasks([...tasks, newTask]);
  }

  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === activeId);

          tasks[activeIndex].columnId = overId;
          return arrayMove(tasks, activeIndex, activeIndex);
        });
    }
  }
    
  const createTask_GraphQL = async (columnId: string, content: string) => {
    try {
      const { data } = await createTaskMutation({
        variables: { columnId, content },
      });
      console.log('Task created:', data?.createTask);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask_GraphQL = async (id: string, columnId: string, content: string) => {
    try {
      const { data } = await updateTaskMutation({
        variables: { id, columnId, content },
      });
      console.log('Task updated:', data?.updateTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask_GraphQL = async (id: string) => {
    try {
      const { data } = await deleteTaskMutation({
        variables: { id },
      });
      console.log('Task deleted:', data?.deleteTask);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const handleUpdateTasks = (columnId: string, updatedTasks: Task[]) => {
    setTasks((prevTasks) => {
      const otherTasks = prevTasks.filter((task) => task.columnId.toString() !== columnId);
      return [...otherTasks, ...updatedTasks];
    });
  }

  return (
    <div
      className="flex h-screen w-full items-start overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex flex-row justify-start gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  setTasks={(updatedTasks) => handleUpdateTasks(col.id.toString(), updatedTasks)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="h-[60px] w-[250px] min-w-[250px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-slate-500 hover:ring-2 flex gap-2">
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                  setTasks={(updatedTasks) => handleUpdateTasks(activeColumn.id.toString(), updatedTasks)}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
