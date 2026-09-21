import DashboardLayout from "./layouts/DashboardLayout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import Expenses from "./pages/Expenses";
import Assistant from "./pages/Assistant";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="notes" element={<Notes />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="assistant" element={<Assistant />} />
      </Route>
    </Routes>
  );
}

export default App;
