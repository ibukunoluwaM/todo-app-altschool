//handles the display of todo details
import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function TodoDetailPage() {
  //   return <TodoDetail/>

  const location = useLocation();
  const todo = location.state?.todo;
  // const { id } = useParams();
  const navigate = useNavigate();

  // async function fetchSingleTodos() {
  //   const response = await fetch(
  //     `https://jsonplaceholder.typicode.com/todos/${id}`
  //   );
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch todos");
  //   }

  //   return response.json();
  // }

  // const {
  //   data: todo,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["todo", id],
  //   queryFn: fetchSingleTodos,
  // });

  // if (isLoading) {
  //  return <div className="flex w-full mx-auto flex-col gap-4">
  //     <div className="flex items-center gap-4">
  //       <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
  //       <div className="flex flex-col gap-4">
  //         <div className="skeleton h-4 w-20"></div>
  //         <div className="skeleton h-4 w-28"></div>
  //       </div>
  //     </div>
  //     <div className="skeleton h-32 w-full"></div>
  //   </div>;
  // }

  // if (error) {
  //  return <p>{error.message}</p>;
  // }

  return (
    <>
    <div className="p-4" role="region" aria-labelledby="todo-detail-heading">
  <h2 id="todo-detail-heading" className="text-xl font-bold mb-4">
    Todo Detail
  </h2>
  
  <div 
    className="bg-white shadow p-4 rounded-md space-y-2" 
    role="article" 
    aria-label="Todo item details"
  >
    {/* ID */}
    <p>
      <strong aria-hidden="true">ID:</strong> 
      <span aria-label={`Todo ID: ${todo.id}`}>{todo.id}</span>
    </p>
    
    {/* Title */}
    <p>
      <strong aria-hidden="true">Title:</strong> 
      <span aria-label={`Title: ${todo.title}`}>{todo.title}</span>
    </p>
    
    {/* Status (with emoji accessibility) */}
    <p>
      <strong aria-hidden="true">Status:</strong>{" "}
      <span aria-label={todo.completed ? "Completed" : "Not Completed"}>
        {todo.completed ? "✅ Completed" : "❌ Not Completed"}
      </span>
    </p>
    
    {/* User */}
    <p>
      <strong aria-hidden="true">User:</strong> 
      <span aria-label={`Assigned to User ${todo.userId}`}>
        User #{todo.userId}
      </span>
    </p>
  </div>
  
  {/* Button with navigation context */}
  <button 
    onClick={() => navigate(-1)} 
    className="btn btn-accent mt-4"
    aria-label="Go back to previous page"
  >
    Go Back
  </button>
</div>
    </>
  );
}

export default TodoDetailPage;
