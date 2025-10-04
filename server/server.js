import express from "express";
import cors from "cors";
import Calculator from "./utils/calculator.js";

const app = express();
const PORT = process.env.PORT || 4000;

const calculationLog = {};

app.use(cors());
app.use(express.json());

app.post("/calculate", (req, res) => {
    try {
        const { operation, a, b } = req.body;
        const result = Calculator.calculate(operation, a, b);

        // const logEntry = {
        //     operation,
        //     a,
        //     b,
        //     result,
        //     timestamp: new Date().toISOString()
        // };

        res.json({
            success: true,
            operation,
            a,
            b,
            result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get calculation log (GET)
// TODO

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
