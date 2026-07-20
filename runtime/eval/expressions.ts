import { BinaryExpr, Identifier } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { NumberVal, RuntimeVal, MK_NULL } from "../values.ts";

function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
    let result = 0;

    if (operator == "+") {
        result = lhs.value + rhs.value
    } else if (operator == "-") {
        result = lhs.value - rhs.value
    } else if (operator == "*") {
        result = lhs.value * rhs.value
    } else if (operator == "/") {
        // TODO: Division by zero checks
        result = lhs.value / rhs.value
    } else if (operator == "%") {
        result = lhs.value % rhs.value
    } 

    return { value: result, type: "number" };  
}

export function evaluate_binary_expr (binop: BinaryExpr, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env)
    const rhs = evaluate(binop.right, env)

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator)
    }

    // one or both are null
    return MK_NULL()
}

export function eval_identifier(ident: Identifier, env: Environment) {
    const val = env.lookupVar(ident.symbol); // ident.symbol is the value of variable
    return val
}