import "./App.css";
import UsersListPage from "./components/UsersListPage";
import ErrorBoundary from "./ErrorHandling/ErrorBoundary";

export default function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <UsersListPage />
      </ErrorBoundary>
    </div>
  );
}
