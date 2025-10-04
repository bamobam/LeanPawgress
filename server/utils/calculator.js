class Calculator {
    static add(a, b) {
        return a + b;
    }

    static subtract(a, b) {
        return a - b;
    }

    static multiply(a, b) {
        return a * b;
    }

    static divide(a, b) {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        return a / b;
    }

    static power(a, b) {
        return Math.pow(a, b);
    }

    static squareRoot(a) {
        if (a < 0) {
            throw new Error("Cannot calculate square root of negative number");
        }
        return Math.sqrt(a);
    }

    static calculate(operation, a, b = null) {
        const numA = parseFloat(a);
        const numB = b !== null ? parseFloat(b) : null;

        if (isNaN(numA) || (b !== null && isNaN(numB))) {
            throw new Error("Invalid number provided");
        }

        switch (operation.toLowerCase()) {
            case "add":
            case "+":
                return this.add(numA, numB);
            case "subtract":
            case "-":
                return this.subtract(numA, numB);
            case "multiply":
            case "*":
                return this.multiply(numA, numB);
            case "divide":
            case "/":
                return this.divide(numA, numB);
            case "power":
            case "^":
                return this.power(numA, numB);
            case "sqrt":
                return this.squareRoot(numA);
            default:
                throw new Error("Invalid operation");
        }
    }
}

export default Calculator;
