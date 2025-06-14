// the page that shwos the todoList
import FilterBar from "../components/filterBar";
import TodoList from "../components/todoList";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTodosFromLocalStorage } from "../components/todoForm";

import React from "react";
import TodoForm from "../components/todoForm";

function TodosPage() {
  async function fetchTodos() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");

    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }

    const todoFromServer = await response.json();
    //fetching fails
    if (todoFromServer.response === "false") {
      console.log("Errorrr!!");
      return;
    }
    //get localstorage
    const localTodos = getTodosFromLocalStorage();
    console.log(localTodos);
    const deletedIds = JSON.parse(localStorage.getItem("deletedTodos") || "[]");
    const editedTodos = JSON.parse(localStorage.getItem("editedTodos")) || [];

    const merged = [
      ...localTodos, // include local todos

      // include edited todos (which override matching server todos)
      ...editedTodos.filter(
        (editedTodo) =>
          !deletedIds.includes(editedTodo.id) &&
          !localTodos.some((localTodo) => localTodo.id === editedTodo.id)
      ),

      // include remaining todos from server that haven't been edited or deleted
      ...todoFromServer.filter(
        (serverTodo) =>
          !deletedIds.includes(serverTodo.id) &&
          !localTodos.some((localTodo) => localTodo.id === serverTodo.id) &&
          !editedTodos.some((editedTodo) => editedTodo.id === serverTodo.id)
      ),
    ];

    return merged;
  }
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const [filteredstatus, setFilteredstatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  //to filter the search term and statusMatch
  const filteredTodos = data
    ? data.filter((todo) => {
        const statusmatch =
          filteredstatus === "all" ||
          (filteredstatus === "completed" && todo.completed) ||
          (filteredstatus === "uncompleted" && !todo.completed);

        const searchMatch = todo.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return statusmatch && searchMatch;
      })
    : [];

  return (
    <div>
      <FilterBar
        filteredstatus={filteredstatus}
        setFilteredstatus={setFilteredstatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <TodoForm data={data} />
      <TodoList data={filteredTodos} isLoading={isLoading} error={error} />
    </div>
  );
}

export default TodosPage;
