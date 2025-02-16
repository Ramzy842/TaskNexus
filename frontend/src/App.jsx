import { Route, Routes } from "react-router";
import EditTask from "./pages/EditTask";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./styles/globals.css";
import AuthLayout from "./layouts/AuthLayout";

function App() {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route index element={<Home />} />
            <Route path="tasks/:id/edit" element={<EditTask task={{ id: 1, title: "Random Task", description: "Do something", status: "In Progress", dueDate: "07-06-2000" }} />} />
            <Route path="*" element={<div className="text-2xl md:text-4xl lg:text-6xl font-bold flex items-center justify-center h-screen w-full bg-teal-500">Page not found - 404</div>} />
        </Routes>
    );
}

export default App;