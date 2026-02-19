import { useState } from 'react'
import './App.css'
import LoginPage from "./autentificare/autentificare";
import RegisterPage from "./inregistrare/inregistrare";
import { ForgotPasswordPage, VerifyCodePage } from "./recuperarecont/recuperare-parola";

type Page = "login" | "register" | "forgot" | "verify";

function App() {
    const [page, setPage] = useState<Page>("login");
    const [recoveryEmail, setRecoveryEmail] = useState("");

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

    if (page === "forgot") return (
        <ForgotPasswordPage
            onBack={() => setPage("login")}
            onSubmit={(email) => { setRecoveryEmail(email); setPage("verify"); }}
        />
    );

    if (page === "verify") return (
        <VerifyCodePage
            email={recoveryEmail}
            onBack={() => setPage("forgot")}
            onSubmit={(code) => console.log("Cod introdus:", code)}
            onResend={() => console.log("Cod retrimis")}
        />
    );
    return (
        <LoginPage
            onBack={() => console.log("Înapoi")}
            onRegister={() => setPage("register")}
            onForgotPassword={() => setPage("forgot")}
            onSubmit={(email, password) => {
                console.log("Login:", email, password);
            }}
        />
    );
}

export default App;