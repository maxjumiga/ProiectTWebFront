import './App.css'
import LoginPage from "./autentificare/autentificare";

function App() {
    return (
        <LoginPage
            onBack={() => console.log("Înapoi")}
            onRegister={() => console.log("Înregistrare")}
            onForgotPassword={() => console.log("Ai uitat parola?")}
            onSubmit={(email, password) => {
                console.log("Login:", email, password);
            }}
        />
    );
}

export default App;