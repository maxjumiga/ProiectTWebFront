import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { OnboardingData } from "../types/onboarding";

interface ContextType {
    data: OnboardingData;
    updateField: <K extends keyof OnboardingData>(
        field: K,
        value: OnboardingData[K]
    ) => void;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const initialState: OnboardingData = {
    height: null,
    weight: null,
    gender: "",
    age: null,
    activityLevel: "",
    goal: "",
    goalDetail: "",
    targetWeight: null,
    bmr: null,
    calorieTarget: null,
    proteinTarget: null,
    onboardingCompleted: false,
};

const OnboardingContext = createContext<ContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<OnboardingData>(() => {
        const saved = localStorage.getItem("onboarding");
        return saved ? JSON.parse(saved) : initialState;
    });

    const [step, setStep] = useState<number>(0);

    useEffect(() => {
        localStorage.setItem("onboarding", JSON.stringify(data));
    }, [data]);

    const updateField = <K extends keyof OnboardingData>(
        field: K,
        value: OnboardingData[K]
    ) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <OnboardingContext.Provider
            value={{ data, updateField, step, setStep, setData }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within OnboardingProvider");
    }
    return context;
}