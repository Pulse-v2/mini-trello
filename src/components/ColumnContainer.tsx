import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import SortIcon from "../icons/SortIcon";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
  setTasks: (array: Task[]) => void;
}

const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  setTasks,
  deleteTask,
  updateTask,
}: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-slate-500 w-[250px] h-fit rounded-md max-h-screen flex flex-col"></div>
    );
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  const sortTasks = (array: Task[], ascending: boolean) => {
    setIsOpen(false);
    const sortedTasks = array.sort((a, b) => {
          if (a.content < b.content) return ascending ? -1 : 1;
          if (a.content > b.content) return ascending ? 1 : -1;
          return 0;
    });
    setTasks([...sortedTasks]);
  };

  const sortTasksByDate = (array: Task[]) => {
    setIsOpen(false);

    const sortedTasks = array.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
    setTasks([...sortedTasks]);
  };
  


  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" bg-columnBackgroundColor w-[250px] h-fit max-h-screen overflow-y-auto border-box rounded-md flex flex-col shrink">
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        className=" bg-gradient-to-r from-gray-700 to-slate-800 text-md h-[60px] cursor-grab rounded-lg p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div className="flex gap-2">
          {!editMode && <div onClick={() => {
            setIsOpen(false);
            setEditMode(true);
          }}>{column.title}</div>}
          {editMode && (
            <input
              className="bg-black focus:border-slate-500 w-[120px] text-base border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <div className="flex flex-row">
          <button
            onClick={() => {
              deleteColumn(column.id);
            }}
            className="stroke-gray-500 hover:stroke-white rounded px-1 py-2">
            <TrashIcon />
          </button>
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className="stroke-gray-500 hover:stroke-white rounded px-1 py-2">
              <SortIcon />
            </button>
            {isOpen && (
            <div className="absolute z-50 right-0 w-56 mt-2 origin-top-right bg-slate-600 divide-y rounded-md shadow-lg ring-1 ring-gray-500 ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <div className="block px-4 py-2 text-sm bg-slate-600 text-gray-200 hover:bg-gray-500" onClick={() => sortTasks(tasks, true)}>Sort A-z</div>
                  <div className="block px-4 py-2 text-sm bg-slate-600 text-gray-200 hover:bg-gray-500" onClick={() => sortTasks(tasks, false)}>Sort Z-a</div>
                  <div className="block px-4 py-2 text-sm bg-slate-600 text-gray-200 hover:bg-gray-500" onClick={() => sortTasksByDate(tasks)}>Date created</div>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasks}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))
          }
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor  hover:text-slate-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}>
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
