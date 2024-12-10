import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <AppRouter />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
