import { useOnboarding } from "../../context/OnboardingContext";

export default function HeightStep() {
    const { data, updateField, step, setStep } = useOnboarding();

    const valid = data.height !== null && data.height > 50;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">How tall are you?</h2>

            <input
                type="number"
                value={data.height ?? ""}
                onChange={(e) => updateField("height", Number(e.target.value))}
                className="w-full border p-3 rounded-lg mb-6"
                placeholder="Height in cm"
            />

            <button
                disabled={!valid}
                onClick={() => setStep(step + 1)}
                className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-30"
            >
                Continue
            </button>
        </div>
    );
}