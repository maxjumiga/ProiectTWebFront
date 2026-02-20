import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props { value: number | null; onChange: (cm: number) => void; onNext: () => void; onBack: () => void; }

export default function HeightStep({ value, onChange, onNext, onBack }: Props) {
    const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
    const [ft, setFt] = useState(value ? String(Math.floor(value / 2.54 / 12)) : '5');
    const [inches, setInches] = useState(value ? String(Math.round((value / 2.54) % 12)) : '8');
    const [cm, setCm] = useState(value ? String(Math.round(value)) : '173');

    const handleCmChange = (raw: string) => { setCm(raw); const n = parseInt(raw); if (!isNaN(n) && n >= 100 && n <= 250) onChange(n); };
    const handleFtChange = (nFt: string, nIn: string) => { setFt(nFt); setInches(nIn); const total = Math.round((parseInt(nFt) || 0) * 12 + (parseInt(nIn) || 0)) * 2.54 | 0; if (total >= 100 && total <= 250) onChange(total); };

    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }} className="flex flex-col px-8 py-10 h-full">
            <div className="mb-6">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Step 3 of 6</span>
                <h2 className="text-3xl font-extrabold text-white mt-2">How tall are you?</h2>
            </div>

            <div className="flex bg-[#1a1d2e] rounded-xl p-1 mb-8 w-fit">
                {(['cm', 'ft'] as const).map((u) => (
                    <button key={u} onClick={() => setUnit(u)}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${unit === u ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-white'}`}>
                        {u === 'cm' ? 'CM' : 'FT / IN'}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex items-center justify-center">
                {unit === 'cm' ? (
                    <div className="text-center">
                        <div className="flex items-end justify-center gap-2">
                            <input type="number" value={cm} onChange={(e) => handleCmChange(e.target.value)} min={100} max={250}
                                className="bg-transparent text-white text-8xl font-extrabold text-center w-52 outline-none border-b-2 border-violet-500 pb-2" />
                            <span className="text-zinc-500 text-2xl mb-4">cm</span>
                        </div>
                        <p className="text-zinc-600 text-xs mt-4">Range: 100 – 250 cm</p>
                    </div>
                ) : (
                    <div className="flex items-end gap-8">
                        {[{ val: ft, set: (v: string) => handleFtChange(v, inches), unit: 'ft', min: 3, max: 8 },
                        { val: inches, set: (v: string) => handleFtChange(ft, v), unit: 'in', min: 0, max: 11 }].map((f) => (
                            <div key={f.unit} className="text-center">
                                <input type="number" value={f.val} onChange={(e) => f.set(e.target.value)} min={f.min} max={f.max}
                                    className="bg-transparent text-white text-8xl font-extrabold text-center w-36 outline-none border-b-2 border-violet-500 pb-2" />
                                <p className="text-zinc-500 mt-2">{f.unit}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-2xl border border-[#252840] text-zinc-400 font-semibold hover:border-[#363a5a] transition-colors text-sm">← Back</button>
                <button onClick={onNext} disabled={value === null} className="flex-[2] py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">Continue →</button>
            </div>
        </motion.div>
    );
}