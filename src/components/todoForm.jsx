//to add new todos
import { FaPlus } from "react-icons/fa6";
import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

//handling persisence
export const local_todos_key = "addedTodos";

export function saveTodoToLocalStorage(todo) {
  const existing = JSON.parse(localStorage.getItem(local_todos_key)) || [];
  localStorage.setItem(local_todos_key, JSON.stringify([todo, ...existing]));
}

export function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem(local_todos_key)) || [];
}

function TodoForm() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");
  const [userID, setUserID] = useState("");

  const addtoMutation = useMutation({
    mutationFn: async (newTodoObject) => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(newTodoObject),
        }
      );

      if (!response.ok) {
        throw new Error("Faield to add new todo!");
      }
      return response.json();
    },

    onSuccess: (newTodo) => {
      const todoWithFakeId = { ...newTodo, id: Date.now() };

      saveTodoToLocalStorage(todoWithFakeId);
      // Update the cached todos list
      queryClient.setQueryData(["todos"], (oldTodos = []) => [
        todoWithFakeId,
        ...oldTodos,
      ]);

      // Reset form
      setNewTodo("");
      setUserID("");

      // Close modal
      const modal = document.getElementById("my_modal_2");
      if (modal) modal.close();
    },
  });

  //handles form submission
  function handleSubmit(e) {
    e.preventDefault();

    if (!newTodo.trim() || !userID) return;

    const todoObj = {
      userId: Number(userID),
      title: newTodo,
      completed: false,
    };

    addtoMutation.mutate(todoObj);
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <p className="inline text-center text-lg">Add new todo: </p>
        <button
          className="btn bg-[#37cdbe] cursor-pointer ml-2"
          onClick={() => document.getElementById("my_modal_2").showModal()}
          aria-label="Add new todo"
          aria-haspopup="dialog"
        >
          <FaPlus aria-hidden="true" />
        </button>
      </div>
      <dialog
        id="my_modal_2"
        className="modal"
        aria-labelledby="modal_title"
        aria-modal="true"
      >
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl mb-6 ">Add a new Task</h2>
            <label htmlFor="newTask" className="block mb-2">
              Enter new Todo:
            </label>

            <input
              type="text"
              id="newTask"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter new todo here..."
              className="input input-accent mb-2 w-[100%]"
              aria-required="true"
            />

            <label htmlFor="userId" className="block mb-2">
              Enter User-ID:
            </label>

            <input
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              id="userId"
              type="number"
              className="input input validator input-accent mb-2 w-[100%]"
              required
              placeholder="Enter your user ID"
              min="1"
              max="50"
              title="Must be between be 1 to 10"
              aria-invalid={userID < 1 || userID > 50 ? "true" : "false"}
              aria-describedby="userid_error"
            />
            <button className="btn btn-accent mt-4">Submit</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default TodoForm;
