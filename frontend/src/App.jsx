import { Route, Routes, useNavigate } from "react-router";
import EditTask from "./pages/EditTask";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./styles/globals.css";

import ProtectedRoute from "./components/ProtectedRoute";
import CreateTask from "./pages/CreateTask";
import AuthCallback from "./pages/AuthCallback";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";


function App() {
    const task = { id: 1, title: "Random Task", description: "Do something", status: "In Progress", dueDate: "07-06-2000" }
    return (
        <Routes>
            <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute element={<Home />} />} index />
            <Route element={<ProtectedRoute element={<CreateTask />} />} path="create" />
            <Route path="tasks/:id/edit" element={<ProtectedRoute element={<EditTask task={task} />} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;