import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./context/authContext";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <>
            <AuthProvider>
                <ToastContainer />
                <Navigation />
                <main className="py-3">
                    <Outlet />
                </main>
            </AuthProvider>
        </>
    );
};

export default App;
