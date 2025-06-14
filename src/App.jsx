import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodosPage from "./pages/todosPage";
import ErrorPage from "./pages/notFoundPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import TodoDetailPage from "./pages/todoDetailPage";
import { useNavigate, useLocation } from "react-router-dom";
import TestErrorPage from "./components/errorBoundarydemo";

function ErrorFallBack({ error }) {
  const navigate = useNavigate();

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full h-[100vh] flex justify-center items-center"
    >
      <div>
        <div className="skeleton h-64 w-64" aria-hidden="true" />
        <p id="error-heading" className="mt-6">Ooops my bad!</p>
        <p id="error-heading">It's not even about you, there's an Error:</p>
        <pre aria-labelledby="error-heading">{error.message}</pre>
        <button
          className="btn btn-accent mt-4"
          onClick={() => navigate("/")}
          aria-label="Try again: Return to homepage"
        >
          Let's try fixing it again
        </button>
      </div>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallBack} key={location.pathname}>
        <Routes>
          <Route path="/" element={<TodosPage />} />
          <Route path="/todos/:id" element={<TodoDetailPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/test-error" element={<TestErrorPage />} />
        </Routes>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
