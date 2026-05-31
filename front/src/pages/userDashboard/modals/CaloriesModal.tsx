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

const CaloriesModal: React.FC<CaloriesModalProps> = ({ foodLog, onClose, onAddFood, onResetFood, onDeleteFood }) => {
    const [search, setSearch] = useState("");
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [mealTime, setMealTime] = useState<MealTime>("Breakfast");
    const [grams, setGrams] = useState(100);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const dropRef = useRef<HTMLDivElement>(null);

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
                const mappedFoods: FoodItem[] = data.foods.map((f: any) => ({
                    id: f.fdcId,
                    name: f.description,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    vitaminC: 0,
                    fiber: 0,
                    unit: "100g"
                }));

                const uniqueFoods = mappedFoods.filter(
                    (food, index, self) =>
                        index === self.findIndex(
                            f => f.name.toLowerCase() === food.name.toLowerCase()
                        )
                );

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
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleAdd = async () => {
        if (!selectedFood || grams <= 0) return;

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
                    quantityGrams: grams
                })
            });

            if (!response.ok) {
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
                    <div className="db-modal-section">
                        <div className="db-flex-row" style={{ gap: 12, flexWrap: 'wrap' }}>
                            <div className="db-card-stub">
                                <div className="db-card-title">Search food</div>
                                <div className="search-input-wrap" ref={dropRef}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-prefix-icon" />
                                    <input
                                        type="text"
                                        className="db-input"
                                        placeholder="Search USDA foods..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        onFocus={() => setDropdownOpen(true)}
                                    />
                                    {dropdownOpen && foods.length > 0 && (
                                        <div className="search-dropdown animate-fup">
                                            {foods.map(food => (
                                                <button
                                                    key={food.id}
                                                    type="button"
                                                    className="search-item"
                                                    onClick={() => {
                                                        setSelectedFood(food);
                                                        setSearch(food.name);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {food.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="db-card-stub" style={{ flex: '1 1 260px' }}>
                                <div className="db-card-title">Selected food</div>
                                {selectedFood ? (
                                    <div className="food-summary-card">
                                        <div>{selectedFood.name}</div>
                                        <div className="food-summary-row">
                                            <div>{selectedFood.unit}</div>
                                            <div>{grams} g</div>
                                        </div>
                                        <div className="food-summary-row">
                                            <div>{selectedFood.calories ? macro(selectedFood.calories) : "—"} kcal</div>
                                            <div>{selectedFood.protein ? macro(selectedFood.protein) : "—"} g protein</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="food-summary-empty">Select a food item to add.</div>
                                )}
                            </div>

                            <div className="db-card-stub" style={{ width: 180 }}>
                                <div className="db-card-title">Meal time</div>
                                <div className="db-pill-list">
                                    {(["Breakfast", "Lunch", "Dinner", "Snack"] as MealTime[]).map(time => (
                                        <button
                                            key={time}
                                            className={`db-pill${mealTime === time ? ' active' : ''}`}
                                            onClick={() => setMealTime(time)}
                                            type="button"
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                                <div className="db-card-title" style={{ marginTop: 12 }}>Amount</div>
                                <input
                                    type="number"
                                    className="db-input"
                                    value={grams}
                                    min={1}
                                    onChange={e => setGrams(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="db-modal-section">
                        <div className="section-header-row">
                            <div className="db-modal-section-title">Today&apos;s Food Log</div>
                        </div>
                        <div className="log-grid">
                            {Object.entries(groupedLog).map(([group, entries]) => (
                                <div key={group} className="log-group-card">
                                    <div className="log-group-header">
                                        <span>{group}</span>
                                        <FontAwesomeIcon icon={mealIcons[group as MealTime]} />
                                    </div>
                                    {entries.length === 0 ? (
                                        <div className="log-empty">No items</div>
                                    ) : entries.map((item, idx) => (
                                        <div key={idx} className="log-entry-row">
                                            <div>
                                                <div className="log-entry-name">{item.food.name}</div>
                                                <div className="log-entry-meta">{item.grams} g</div>
                                            </div>
                                            <button className="icon-btn" onClick={() => item.id && onDeleteFood(item.id)}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="db-modal-section" style={{ marginTop: 10 }}>
                        <button className="db-btn-primary" onClick={handleAdd} disabled={!selectedFood || grams <= 0}>
                            <FontAwesomeIcon icon={faPlus} /> Add to Log
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaloriesModal;
