import EditTask from "./pages/EditTask";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./styles/globals.css";
function App() {
    return (
        <>
            <EditTask task={{ id: 1, title: "Random Task", description: "Do something", status: "In Progress", dueDate: "07-06-2000" }} />
            {/* <Home /> */}
            {/* <Login /> */}
            {/* <Signup /> */}
        </>
    );
}

export default App;
