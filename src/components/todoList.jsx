// like shows 10 todos per page
import React from "react";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import Pagination from "./pagination";
import { CiEdit } from "react-icons/ci";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { local_todos_key } from "./todoForm";

function TodoList({ data, isLoading, error }) {
  const queryClient = useQueryClient();
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editinput, setEditInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;
  const lastTodo = currentPage * todosPerPage;
  const firstTodo = lastTodo - todosPerPage;
  // const [todosState, setTodosState] = useState([]);

  const currentTodos = data?.slice(firstTodo, lastTodo);

  const checkedTodoMutation = useMutation({
    mutationFn: async (updatedtodo) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${updatedtodo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ completed: updatedtodo.completed }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update todo status");
      }

      return updatedtodo;
    },

    onSuccess: (updatedTodo, todo) => {
      // completedTodos(todo)
      //handles local storage todos
      const localTodos =
        JSON.parse(localStorage.getItem(local_todos_key)) || [];

      const updatedTodos = localTodos.map((task) => {
        return todo.id === task.id
          ? { ...task, completed: !task.completed }
          : task;
      });
      localStorage.setItem(local_todos_key, JSON.stringify(updatedTodos));

      //handles todos from the server
      queryClient.setQueryData(["todos"], (oldTodos = []) =>
        oldTodos.map((oldTodo) => {
          return oldTodo.id === todo.id
            ? { ...oldTodo, completed: !oldTodo.completed }
            : oldTodo;
        })
      );

      queryClient.setQueryData(["todo", updatedTodo.id], updatedTodo);
    },
  });

  function deletedTodoList(id) {
    const deletedId = JSON.parse(localStorage.getItem("deletedTodos") || "[]");
    if (!deletedId.includes(id)) {
      deletedId.push(id);
      localStorage.setItem("deletedTodos", JSON.stringify(deletedId));
    }
  }

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete todos");
      }

      return id;
    },

    onSuccess: (_, todoId) => {
      //mark as deleted in localstorage
      deletedTodoList(todoId);

      // localStorage.removeItem(local_todos_key, todoId)
      // Also remove from localStorage immediately
      const localTodos =
        JSON.parse(localStorage.getItem(local_todos_key)) || [];
      const updatedTodos = localTodos.filter((todo) => {
        return String(todo.id) !== String(todoId);
      });
      localStorage.setItem(local_todos_key, JSON.stringify(updatedTodos));
      //update cache
      queryClient.setQueryData(["todos"], (oldTodos = []) => {
        return oldTodos.filter((todo) => {
          return todo.id !== todoId;
        });
      });

      const modal = document.getElementById("delete-success");
      if (modal) modal.showModal();
    },
  });

  const editTodoMutation = useMutation({
    mutationFn: async (updatedTodo) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ title: updatedTodo.title }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit todo");
      }

      return updatedTodo;
    },

    onSuccess: (updatedTodo) => {
      // Update cache
      queryClient.setQueryData(["todos"], (oldTodos = []) =>
        oldTodos.map((todo) => (todo.id == updatedTodo.id ? updatedTodo : todo))
      );

      // Try to update localStorage
      const storedTodos = JSON.parse(
        localStorage.getItem(local_todos_key) || "[]"
      );

      // updated edited todos
      const updatedLocalTodos = storedTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );

      localStorage.setItem(local_todos_key, JSON.stringify(updatedLocalTodos));

      //editing fetched todos
      const editedTodos = JSON.parse(localStorage.getItem("editedTodos")) || [];
      const updatedEdits = [
        ...editedTodos.filter((todo) => todo.id !== updatedTodo.id),
        updatedTodo,
      ];
      localStorage.setItem("editedTodos", JSON.stringify(updatedEdits));

      // UI reset
      setEditingTodoId(null);
      setEditInput("");
    },
  });

  if (isLoading) {
    return (
      <div
        className="p-4 max-w-xl h-[100px] mx-auto space-y-4"
        aria-live="polite"
        aria-busy="true"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex w-full mx-auto flex-col gap-4"
            role="status"
            aria-label="Loading content..."
          >
            <div className="flex items-center gap-4">
              {/* Profile image placeholder */}
              <div
                className="skeleton h-16 w-16 shrink-0 rounded-full"
                aria-hidden="true"
              />

              {/* Text placeholders */}
              <div className="flex flex-col gap-4" aria-hidden="true">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>

            {/* Content placeholder */}
            <div className="skeleton h-32 w-full" aria-hidden="true"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" aria-live="assertive" className="text-center">
        {error.message}
      </p>
    );
  }

  //checkbox onchange
  // function onChangeCheckbox(todo) {
  //   const updatedTodo = { ...todo, completed: !todo.completed };
  // }

  return (
    <>
      <ul aria-live="polite" className="space-y-4">
        {currentTodos.map((todo, index) => (
          <li
            key={todo.id} // Always use stable ID instead of index
            className="max-w-[500px] mx-auto px-6 py-6 font-sans"
            aria-labelledby={`todo-${todo.id}-title`}
          >
            <article className="mb-4 shadow-[#37cdbe] shadow-lg/30 p-4 rounded-lg mx-auto">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`todo-${todo.id}-checkbox`}
                  className="checkbox checkbox-accent"
                  checked={todo.completed}
                  onChange={() => checkedTodoMutation.mutate(todo)}
                  aria-label={
                    todo.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                />

                {editingTodoId === index ? (
                  <input
                    type="text"
                    aria-label="Edit todo text"
                    className="input border-accent w-full ml-2"
                    value={editinput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const updatedTodo = { ...todo, title: editinput };
                        editTodoMutation.mutate(updatedTodo);
                      }
                    }}
                  />
                ) : (
                  <p
                    id={`todo-${todo.id}-title`}
                    className={`ml-2 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                    aria-live="polite"
                  >
                    {todo.title}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                {editingTodoId === index ? (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      aria-label="Save changes"
                      onClick={() => {
                        const updatedTodo = { ...todo, title: editinput };
                        editTodoMutation.mutate(updatedTodo);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      aria-label="Cancel editing"
                      onClick={() => {
                        setEditingTodoId(null);
                        setEditInput("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline btn-accent"
                      aria-label={`Edit todo: ${todo.title}`}
                      onClick={() => {
                        setEditingTodoId(index);
                        setEditInput(todo.title);
                      }}
                    >
                      <CiEdit aria-hidden="true" />
                    </button>
                    <button
                      className="btn btn-outline btn-accent"
                      aria-label={`Delete todo: ${todo.title}`}
                      onClick={() => deleteMutation.mutate(todo.id)}
                    >
                      <MdDeleteOutline aria-hidden="true" />
                    </button>
                    <Link
                      to={`/todos/${todo.id}`}
                      state={{ todo }}
                      className="btn btn-outline btn-accent"
                      aria-label={`View details for todo: ${todo.title}`}
                    >
                      See More
                    </Link>
                  </>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* Delete confirmation modal */}
      <dialog
        id="delete-success"
        className="modal"
        aria-labelledby="delete-success-heading"
      >
        <div className="modal-box">
          <h3 id="delete-success-heading" className="font-bold text-lg">
            Todo successfully deleted!
          </h3>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" aria-label="Close deletion confirmation">
                Close
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-hidden="true">close</button>
        </form>
      </dialog>

      <Pagination
        totaltodos={data.length}
        totalPerPage={todosPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default TodoList;
