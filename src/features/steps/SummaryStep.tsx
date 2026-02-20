import { useOnboarding } from "../../context/OnboardingContext";
import {
    calculateBMR,
    calculateCalories,
    calculateProtein,
} from "../../utils/calculations";
import { useNavigate } from "react-router-dom";

export default function SummaryStep() {
    const { data, setData } = useOnboarding();
    const navigate = useNavigate();

    const bmr = calculateBMR(data);
    const calories = calculateCalories(bmr, data.activityLevel, data.goal);
    const protein =
        data.weight !== null ? calculateProtein(data.weight, data.goal) : 0;

    const finish = () => {
        setData((prev) => ({
            ...prev,
            bmr,
            calorieTarget: calories,
            proteinTarget: protein,
            onboardingCompleted: true,
        }));
        navigate("/dashboard");
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Your Personalized Plan</h2>

            <div className="space-y-3 mb-6">
                <p>BMR: {Math.round(bmr)} kcal</p>
                <p>Daily Calories: {calories} kcal</p>
                <p>Protein Target: {protein} g</p>
            </div>

            <button
                onClick={finish}
                className="w-full bg-black text-white py-3 rounded-lg"
            >
                Go to Dashboard
            </button>
        </div>
    );
}