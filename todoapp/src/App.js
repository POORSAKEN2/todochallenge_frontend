import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./UserRegistration/registrationuser";
import UserLogin from "./UserLogin/userlogin";
import TodoApp from "./TodoApp/todoappscreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/todoapp" element={<TodoApp />} />
      </Routes>
    </Router>
  );
}

export default App;
