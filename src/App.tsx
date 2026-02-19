import { useState } from 'react'
import './App.css'
import LoginPage from "./autentificare/autentificare";
import RegisterPage from "./inregistrare/inregistrare";

type Page = "login" | "register";

function App() {
    const [page, setPage] = useState<Page>("login");

    if (page === "register") {
        return (
            <RegisterPage
                onBack={() => setPage("login")}
                onLogin={() => setPage("login")}
                onSubmit={(nickname, email, password) => {
                    console.log("Register:", nickname, email, password);
                }}
            />
        );
    }

    return (
        <LoginPage
            onBack={() => console.log("Înapoi")}
            onRegister={() => setPage("register")}
            onForgotPassword={() => console.log("Ai uitat parola?")}
            onSubmit={(email, password) => {
                console.log("Login:", email, password);
            }}
        />
    );
}

export default App;