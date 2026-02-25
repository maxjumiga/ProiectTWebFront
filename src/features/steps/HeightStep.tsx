import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { value: number | null; onChange: (cm: number) => void; onNext: () => void; onBack: () => void; }

export default function HeightStep({ value, onChange, onNext, onBack }: Props) {
    const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
    const [cmInput, setCmInput] = useState(value ? String(Math.round(value)) : '170');

    // Derived values for feet/inches based on cm internal or local state
    const currentCm = value || 170;
    const initialFt = Math.floor(currentCm / 2.54 / 12);
    const initialIn = Math.round((currentCm / 2.54) % 12);

    const [ftInput, setFtInput] = useState(String(initialFt));
    const [inInput, setInInput] = useState(String(initialIn));

    const [isFocused, setIsFocused] = useState(false);

    // Sync input when `value` changes from outside (e.g. from slider)
    useEffect(() => {
        if (value) {
            if (unit === 'cm') {
                setCmInput(String(Math.round(value)));
            } else {
                setFtInput(String(Math.floor(value / 2.54 / 12)));
                setInInput(String(Math.round((value / 2.54) % 12)));
            }
        }
    }, [value, unit]);

    // Format switches
    const handleUnitSwitch = (u: 'cm' | 'ft') => {
        setUnit(u);
        if (u === 'ft') {
            const cmVal = parseInt(cmInput);
            if (!isNaN(cmVal)) {
                setFtInput(String(Math.floor(cmVal / 2.54 / 12)));
                setInInput(String(Math.round((cmVal / 2.54) % 12)));
            }
        } else {
            const f = parseInt(ftInput) || 0;
            const i = parseInt(inInput) || 0;
            const cmVal = Math.round((f * 12 + i) * 2.54);
            setCmInput(String(cmVal));
            if (cmVal >= 100 && cmVal <= 250) {
                onChange(cmVal);
            }
        }
    };

    // CM Handle
    const handleCmChange = (raw: string) => {
        if (raw.length > 3) return; // limit to 3 digits
        setCmInput(raw);
        const n = parseInt(raw);
        if (!isNaN(n) && n >= 100 && n <= 250) {
            onChange(n);
        }
    };

    const jumpCm = (delta: number) => {
        const n = parseInt(cmInput) || 170;
        const bounded = Math.max(100, Math.min(250, n + delta));
        handleCmChange(String(bounded));
    };

    // FT Handle
    const handleFtChange = (nFt: string, nIn: string) => {
        if (nFt.length > 1) return; // prevent extra digits
        if (nIn.length > 2) return;
        setFtInput(nFt);
        setInInput(nIn);
        const total = Math.round((parseInt(nFt) || 0) * 12 + (parseInt(nIn) || 0)) * 2.54 | 0;
        if (total >= 100 && total <= 250) onChange(total);
    };

    const jumpFt = (delta: number, type: 'ft' | 'in') => {
        let f = parseInt(ftInput) || 0;
        let i = parseInt(inInput) || 0;
        if (type === 'ft') f += delta;
        if (type === 'in') i += delta;

        // Wrap inches
        if (i >= 12) { f += 1; i -= 12; }
        if (i < 0) { f -= 1; i += 12; }

        // Bounds checking approx
        const cmVal = (f * 12 + i) * 2.54;
        if (cmVal < 100 || cmVal > 250) return;

        handleFtChange(String(f), String(i));
    };

    const sliderValue = value || 170;

    // Bounds Check for validation
    const isValid = value !== null && value >= 100 && value <= 250;
    const isError = (unit === 'cm' && cmInput.length > 0 && (parseInt(cmInput) < 100 || parseInt(cmInput) > 250)) ||
        (unit === 'ft' && ftInput.length > 0 && ((parseInt(ftInput) * 12 + parseInt(inInput)) * 2.54 < 100 || (parseInt(ftInput) * 12 + parseInt(inInput)) * 2.54 > 250));

    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }} className="flex flex-col px-8 py-10 h-full">
            <div className="mb-6">
                <span className="text-xs font-semibold text-[#42448A] uppercase tracking-widest">Step 3 of 6</span>
                <h2 className="text-3xl font-extrabold text-[#1E1F35] mt-2">How tall are you?</h2>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-12 w-fit">
                {(['cm', 'ft'] as const).map((u) => (
                    <button key={u} onClick={() => handleUnitSwitch(u)}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${unit === u ? 'bg-white text-[#42448A] shadow-sm' : 'text-slate-500 hover:text-[#1E1F35]'}`}>
                        {u === 'cm' ? 'CM' : 'FT / IN'}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                {/* Numeric Input & Buttons */}
                {unit === 'cm' ? (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => jumpCm(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-xl font-bold">−</button>
                            <div className={`flex items-end border-b-2 transition-colors pb-1 ${isFocused ? 'border-[#42448A]' : isError ? 'border-red-500' : 'border-slate-300'} ${isFocused ? 'shadow-[0_4px_10px_-4px_rgba(66,68,138,0.4)]' : ''}`}>
                                <input type="number" value={cmInput}
                                    onChange={(e) => handleCmChange(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="bg-transparent text-[#1E1F35] text-6xl font-extrabold text-center w-36 outline-none" />
                                <span className="text-slate-500 text-xl font-semibold mb-2 ml-1">cm</span>
                            </div>
                            <button onClick={() => jumpCm(1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-xl font-bold">+</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-6 mb-8">
                        {/* FT */}
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <button onClick={() => jumpFt(-1, 'ft')} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 text-lg font-bold">−</button>
                                <div className={`flex items-end border-b-2 transition-colors pb-1 ${isFocused ? 'border-[#42448A]' : isError ? 'border-red-500' : 'border-slate-300'}`}>
                                    <input type="number" value={ftInput}
                                        onChange={(e) => handleFtChange(e.target.value, inInput)}
                                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                                        className="bg-transparent text-[#1E1F35] text-5xl font-extrabold text-center w-20 outline-none" />
                                    <span className="text-slate-500 font-semibold mb-1 ml-1">ft</span>
                                </div>
                                <button onClick={() => jumpFt(1, 'ft')} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 text-lg font-bold">+</button>
                            </div>
                        </div>
                        {/* IN */}
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <button onClick={() => jumpFt(-1, 'in')} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 text-lg font-bold">−</button>
                                <div className={`flex items-end border-b-2 transition-colors pb-1 ${isFocused ? 'border-[#42448A]' : isError ? 'border-red-500' : 'border-slate-300'}`}>
                                    <input type="number" value={inInput}
                                        onChange={(e) => handleFtChange(ftInput, e.target.value)}
                                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                                        className="bg-transparent text-[#1E1F35] text-5xl font-extrabold text-center w-20 outline-none" />
                                    <span className="text-slate-500 font-semibold mb-1 ml-1">in</span>
                                </div>
                                <button onClick={() => jumpFt(1, 'in')} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 text-lg font-bold">+</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Range Slider for Both */}
                <div className="w-full mt-4">
                    <input
                        type="range"
                        min="100"
                        max="250"
                        value={sliderValue}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            onChange(val);
                        }}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#42448A]"
                        style={{ boxShadow: isFocused ? '0 0 0 4px rgba(66,68,138,0.1)' : 'none' }}
                    />
                    <div className="flex justify-between text-xs text-slate-400 font-medium mt-3 px-1">
                        <span>{unit === 'cm' ? '100 cm' : '3 ft 3 in'}</span>
                        <span>{unit === 'cm' ? '250 cm' : '8 ft 2 in'}</span>
                    </div>
                </div>

                {/* Error message */}
                <div className="h-4 mt-4">
                    {isError && <p className="text-red-500 text-xs font-semibold">Please enter a valid height.</p>}
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-semibold hover:border-[#42448A] transition-colors text-sm">← Back</button>
                <button onClick={onNext} disabled={!isValid} className="flex-[2] py-3.5 rounded-2xl bg-[#42448A] hover:opacity-90 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">Continue →</button>
            </div>
        </motion.div>
    );
}