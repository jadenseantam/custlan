import { NumberVal, NullVal, RuntimeVal } from "./values.ts";
import { Program, BinaryExpr, NumericLiteral, Stmt } from "../frontend/ast.ts";

function eval_program(program: Program): RuntimeVal {
    let lastEvaluated: RuntimeVal = {type: "null", value: "null"} as NullVal;
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement)
    }
    return lastEvaluated
}

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

function evaluate_binary_expr (binop: BinaryExpr): RuntimeVal {
    const lhs = evaluate(binop.left)
    const rhs = evaluate(binop.right)

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator)
    }

    // one or both are null
    return {type: "null", value: "null" } as NullVal
}

export function evaluate(astNode: Stmt): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: (astNode as NumericLiteral).value,
                type: "number"
            } as NumberVal;
        case "NullLiteral": 
            return {
                value: "null",
                type: "null"
            } as NullVal
        case "BinaryExpr": 
            return evaluate_binary_expr(astNode as BinaryExpr)
        case "Program": 
            return eval_program(astNode as Program)
        default:
            console.error("This AST Node has not yet been set up for interpretation.", astNode)
            Deno.exit(1)
    }
}

/*
1. Evaluate 


evaluate node (from parser)
iterating through all children, return the last evaluated statement, if there is no children, it returns null
Eval numeric literal, null literal, binary expr, program
binary expression: get lhs & rhs, make sure they are a number ==> evaluate
*/