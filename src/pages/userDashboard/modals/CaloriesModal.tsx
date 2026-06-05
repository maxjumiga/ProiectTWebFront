import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAppleWhole,
    faBolt,
    faCoffee,
    faFire,
    faMoon,
    faPlus,
    faUtensils,
    faXmark,
    faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import { FoodItem, FoodLog, MealTime } from "./types";

interface CaloriesModalProps {
    foodLog: FoodLog[];
    onClose: () => void;
    onAddFood: (log: FoodLog) => void;
    onResetFood: () => void;
    onDeleteFood: (id: number) => void;
}

const getNutrientVal = (nutrients: any[], ids: number[], names: string[]): number => {
    if (!nutrients || !Array.isArray(nutrients)) return 0;
    
    // 1. Try finding by ID
    const byId = nutrients.find((n: any) => {
        const nId = n.nutrientId || n.id || (n.nutrient && (n.nutrient.id || n.nutrient.nutrientId));
        return nId && ids.includes(Number(nId));
    });
    if (byId) {
        const val = byId.value !== undefined ? byId.value : (byId.amount !== undefined ? byId.amount : byId.val);
        if (val !== undefined && val !== null && !isNaN(Number(val))) {
            return Number(val);
        }
    }
    
    // 2. Try finding by nutrientNumber
    const byNum = nutrients.find((n: any) => {
        const nNum = n.nutrientNumber || n.number || (n.nutrient && n.nutrient.number);
        return nNum && ids.map(String).includes(String(nNum));
    });
    if (byNum) {
        const val = byNum.value !== undefined ? byNum.value : (byNum.amount !== undefined ? byNum.amount : byNum.val);
        if (val !== undefined && val !== null && !isNaN(Number(val))) {
            return Number(val);
        }
    }
    
    // 3. Try finding by Name match
    const byName = nutrients.find((n: any) => {
        const nName = n.nutrientName || n.name || (n.nutrient && n.nutrient.name);
        return nName && names.some(name => String(nName).toLowerCase().includes(name.toLowerCase()));
    });
    if (byName) {
        const val = byName.value !== undefined ? byName.value : (byName.amount !== undefined ? byName.amount : byName.val);
        if (val !== undefined && val !== null && !isNaN(Number(val))) {
            return Number(val);
        }
    }
    
    return 0;
};

const CaloriesModal: React.FC<CaloriesModalProps> = ({ foodLog, onClose, onAddFood, onResetFood, onDeleteFood }) => {
    const [search, setSearch] = useState("");
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [mealTime, setMealTime] = useState<MealTime>("Breakfast");
    const [grams, setGrams] = useState(100);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mealDropdownOpen, setMealDropdownOpen] = useState(false);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    
    const dropRef = useRef<HTMLDivElement>(null);
    const mealDropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (search.trim().length < 2) {
            setFoods([]);
            return;
        }

        const fetchFoods = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5004/api/UsdaFood/search-usda?query=${encodeURIComponent(search)}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch foods");
                }

                const data = await response.json();
                console.log("Raw USDA search response:", data);

                const mappedFoods: FoodItem[] = (data.foods || []).map((f: any) => ({
                    id: f.fdcId,
                    name: f.description,
                    calories: f.calories ?? 0,
                    protein: f.protein ?? 0,
                    carbs: f.carbohydrates ?? 0,
                    fat: f.fat ?? 0,
                    vitaminC: f.vitaminC ?? 0,
                    fiber: f.fiber ?? 0,
                    unit: "100g"
                }));

                const uniqueFoods = mappedFoods.filter(
                    (food, index, self) =>
                        index === self.findIndex(
                            f => f.name.toLowerCase() === food.name.toLowerCase()
                        )
                );

                console.log("Mapped food items:", uniqueFoods);
                setFoods(uniqueFoods);
            } catch (err) {
                console.error(err);
            }
        };

        const timeout = setTimeout(() => {
            fetchFoods();
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
            if (mealDropRef.current && !mealDropRef.current.contains(e.target as Node)) {
                setMealDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleAdd = async () => {
        if (!selectedFood || grams <= 0) return;

        // Persist the selected meal time as the most recent log selection
        localStorage.setItem("last_added_meal_time", mealTime);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5004/api/FoodLog/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    fdcId: selectedFood.id,
                    quantityGrams: grams,
                    mealTime: mealTime,
                    mealType: mealTime,
                    meal: mealTime
                })
            });

            if (response.ok) {
                const createdLog = await response.json().catch(() => null);
                if (createdLog && createdLog.id) {
                    const saved = JSON.parse(localStorage.getItem("food_meal_times") || "{}");
                    saved[createdLog.id] = mealTime;
                    localStorage.setItem("food_meal_times", JSON.stringify(saved));
                }
            } else {
                const text = await response.text();
                console.log(text);
            }

            onAddFood({
                food: selectedFood,
                mealTime,
                grams
            });

            setSelectedFood(null);
            setSearch("");
            setGrams(100);
        } catch (err) {
            console.error(err);
        }
    };

    const macro = (val: number) => ((val * grams) / 100).toFixed(1);

    const groupedLog: Record<MealTime, FoodLog[]> = {
        Breakfast: foodLog.filter(l => l.mealTime === "Breakfast"),
        Lunch: foodLog.filter(l => l.mealTime === "Lunch"),
        Dinner: foodLog.filter(l => l.mealTime === "Dinner"),
        Snack: foodLog.filter(l => l.mealTime === "Snack"),
    };

    const mealIcons: Record<MealTime, any> = {
        Breakfast: faCoffee,
        Lunch: faUtensils,
        Dinner: faMoon,
        Snack: faAppleWhole,
    };

    return (
        <div className="db-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="db-modal-card db-modal-wide">
                <div className="db-modal-header">
                    <div className="db-modal-title">
                        <span className="db-modal-icon cal-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faFire} style={{ color: "#ea580c" }} />
                        </span>
                        Calories Consumed Today
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="db-btn-secondary" onClick={onResetFood} style={{ padding: '6px 12px', fontSize: '11px', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}>
                            Reset All
                        </button>
                        <button className="db-modal-close" onClick={onClose} type="button">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>

                <div className="db-modal-body">
                    {/* Add Food Form */}
                    <div className="db-modal-section">
                        <div className="db-modal-section-title">
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 6 }} /> Add Food Item
                        </div>
                        <div className="add-food-grid">
                            {/* Search Bar */}
                            <div className="add-food-field">
                                <label className="db-field-label">Search Food</label>
                                <div className="add-food-search-wrap" ref={dropRef}>
                                    <div className="add-food-input-row">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-prefix-icon" />
                                        <input
                                            type="text"
                                            className="db-input"
                                            placeholder="Search USDA foods (e.g. apple, chicken, rice)..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            onFocus={() => setDropdownOpen(true)}
                                        />
                                    </div>
                                    {dropdownOpen && foods.length > 0 && (
                                        <div className="food-dropdown">
                                            {foods.map(food => (
                                                <div
                                                    key={food.id}
                                                    className="food-dropdown-item"
                                                    onClick={() => {
                                                        setSelectedFood(food);
                                                        setSearch(food.name);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className="food-dropdown-name">{food.name}</span>
                                                    {food.calories > 0 && (
                                                        <span className="food-dropdown-cal">{food.calories.toFixed(0)} kcal/100g</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Meal Time & Amount inputs */}
                            <div className="add-food-sub-row">
                                <div className="add-food-field" style={{ position: 'relative' }} ref={mealDropRef}>
                                    <label className="db-field-label">Meal Time</label>
                                    <button
                                        type="button"
                                        className="db-select"
                                        onClick={() => setMealDropdownOpen(!mealDropdownOpen)}
                                        style={{ textAlign: 'left', cursor: 'pointer' }}
                                    >
                                        {mealTime}
                                    </button>
                                    {mealDropdownOpen && (
                                        <div className="food-dropdown" style={{ top: 'calc(100% + 4px)', zIndex: 110 }}>
                                            {(["Breakfast", "Lunch", "Dinner", "Snack"] as MealTime[]).map(time => (
                                                <div
                                                    key={time}
                                                    className="food-dropdown-item"
                                                    style={{ 
                                                        fontWeight: mealTime === time ? '700' : 'normal',
                                                        background: mealTime === time ? 'var(--color-blue-soft)' : 'transparent'
                                                    }}
                                                    onClick={() => {
                                                        setMealTime(time);
                                                        setMealDropdownOpen(false);
                                                    }}
                                                >
                                                    <span className="food-dropdown-name">{time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="add-food-field">
                                    <label className="db-field-label">Amount (grams)</label>
                                    <input
                                        type="number"
                                        className="db-input"
                                        value={grams}
                                        min={1}
                                        onChange={e => setGrams(Math.max(1, Number(e.target.value)))}
                                    />
                                </div>
                            </div>

                            {/* Selected Food Macro Preview */}
                            {selectedFood ? (
                                <div className="macro-preview">
                                    <div className="macro-preview-title">Nutrient Preview (for {grams}g)</div>
                                    <div className="macro-grid">
                                        <div className="macro-chip cal-chip">
                                            <span className="macro-val">{macro(selectedFood.calories)}</span>
                                            <span className="macro-lbl">Calories (kcal)</span>
                                        </div>
                                        <div className="macro-chip prot-chip">
                                            <span className="macro-val">{macro(selectedFood.protein)}g</span>
                                            <span className="macro-lbl">Protein</span>
                                        </div>
                                        <div className="macro-chip carb-chip">
                                            <span className="macro-val">{macro(selectedFood.carbs)}g</span>
                                            <span className="macro-lbl">Carbs</span>
                                        </div>
                                        <div className="macro-chip fat-chip">
                                            <span className="macro-val">{macro(selectedFood.fat)}g</span>
                                            <span className="macro-lbl">Fat</span>
                                        </div>
                                        <div className="macro-chip fiber-chip">
                                            <span className="macro-val">{macro(selectedFood.fiber)}g</span>
                                            <span className="macro-lbl">Fiber</span>
                                        </div>
                                        <div className="macro-chip vitc-chip">
                                            <span className="macro-val">{macro(selectedFood.vitaminC)}mg</span>
                                            <span className="macro-lbl">Vitamin C</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '16px', background: '#f8fafc', border: '1px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Select a food item to preview nutrition and add to log.
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                className="db-btn-primary"
                                style={{ marginTop: 6 }}
                                onClick={handleAdd}
                                disabled={!selectedFood || grams <= 0}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add to Log
                            </button>
                        </div>
                    </div>

                    {/* Today's Food Log */}
                    <div className="db-modal-section">
                        <div className="db-modal-section-title">
                            Today's Food Log
                        </div>
                        <div className="food-log-list">
                            {Object.entries(groupedLog).map(([group, entries]) => (
                                <div key={group} className="meal-group">
                                    <div className="meal-group-label">
                                        <FontAwesomeIcon icon={mealIcons[group as MealTime]} style={{ marginRight: 6 }} />
                                        {group}
                                    </div>
                                    {entries.length === 0 ? (
                                        <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                            No items logged
                                        </div>
                                    ) : (
                                        entries.map((item, idx) => {
                                            const itemKcal = item.food.calories ? ((item.food.calories * item.grams) / 100).toFixed(0) : "0";
                                            return (
                                                <div key={idx} className="food-log-item">
                                                    <span className="food-log-name" title={item.food.name}>
                                                        {item.food.name}
                                                    </span>
                                                    <div className="food-log-meta">
                                                        <span className="food-log-grams">{item.grams} g</span>
                                                        <span className="food-log-kcal">{itemKcal} kcal</span>
                                                        <button 
                                                            className="db-modal-close" 
                                                            style={{ width: 22, height: 22, fontSize: 10, borderRadius: 6, border: 'none', background: 'rgba(239, 68, 68, 0.08)', color: '#dc2626', cursor: 'pointer' }} 
                                                            onClick={() => item.id && onDeleteFood(item.id)}
                                                            title="Delete entry"
                                                        >
                                                            <FontAwesomeIcon icon={faXmark} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaloriesModal;
