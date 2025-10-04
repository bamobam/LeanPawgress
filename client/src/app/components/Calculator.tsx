"use client";

import { useState } from "react";
import { fetchApi } from "../utils/api";

interface LogEntry {
    operation: string;
    a: number;
    b: number;
    result: number;
    timestamp: string;
}

export default function Calculator() {
    const [a, setA] = useState<string>("");
    const [b, setB] = useState<string>("");
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Static test data for calculation log
    const [log, setLog] = useState<LogEntry[]>([{ operation: "add", a: 5, b: 3, result: 8, timestamp: "2025-10-04T10:30:00.000Z" }]);

    const handleCalculate = async (operation: string) => {
        if (!a || !b) {
            setError("Please enter both numbers");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await fetchApi("/calculate", {
                method: "POST",
                body: {
                    operation,
                    a: parseFloat(a),
                    b: parseFloat(b)
                }
            });
            if (data.success) {
                setResult(data.result);
            } else {
                setError(data.error || "Calculation failed");
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setA("");
        setB("");
        setResult(null);
        setError("");
    };

    const refreshLog = async () => {
        try {
            // TODO
            console.log("TODO!");
        } catch (err) {
            console.error("Failed to fetch log:", err);
        }
    };

    return (
        <div className='max-w-md mx-auto mt-8 p-6 bg-slate-800 rounded-lg shadow-xl border border-slate-700'>
            <h2 className='text-2xl font-bold text-center mb-6 text-white'>Calculator</h2>

            <div className='space-y-4'>
                <div>
                    <input
                        type='number'
                        value={a}
                        onChange={(e) => setA(e.target.value)}
                        className='w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='First number'
                    />
                </div>

                <div>
                    <input
                        type='number'
                        value={b}
                        onChange={(e) => setB(e.target.value)}
                        className='w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Second number'
                    />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                    <button
                        onClick={() => handleCalculate("add")}
                        disabled={loading}
                        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium'
                    >
                        +
                    </button>
                    <button
                        onClick={() => handleCalculate("subtract")}
                        disabled={loading}
                        className='px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 font-medium'
                    >
                        -
                    </button>
                    <button
                        onClick={() => handleCalculate("multiply")}
                        disabled={loading}
                        className='px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 font-medium'
                    >
                        ×
                    </button>
                    <button
                        onClick={() => handleCalculate("divide")}
                        disabled={loading}
                        className='px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 disabled:opacity-50 font-medium'
                    >
                        ÷
                    </button>
                </div>

                <button onClick={clearAll} className='w-full px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 font-medium'>
                    Clear
                </button>

                {result !== null && (
                    <div className='p-3 bg-emerald-900/30 border border-emerald-500/30 rounded'>
                        <p className='text-emerald-300 font-semibold'>Result: {result}</p>
                    </div>
                )}

                {error && (
                    <div className='p-3 bg-rose-900/30 border border-rose-500/30 rounded'>
                        <p className='text-rose-300 font-semibold'>{error}</p>
                    </div>
                )}

                {log && (
                    <div className='mt-6'>
                        <div className='flex justify-between items-center mb-3'>
                            <h3 className='text-lg font-semibold text-white'>Calculation History</h3>
                            <button
                                onClick={refreshLog}
                                className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium'
                            >
                                Refresh
                            </button>
                        </div>
                        <div className='space-y-2 max-h-64 overflow-y-auto'>
                            {log.map((entry, index) => (
                                <div key={index} className='p-3 bg-slate-700/50 border border-slate-600 rounded text-sm'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-slate-200'>
                                            {entry.a} {getOperationSymbol(entry.operation)} {entry.b} ={" "}
                                            <span className='font-semibold text-emerald-400'>{entry.result}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getOperationSymbol(operation: string): string {
    switch (operation) {
        case "add":
            return "+";
        case "subtract":
            return "-";
        case "multiply":
            return "×";
        case "divide":
            return "÷";
        default:
            return operation;
    }
}
