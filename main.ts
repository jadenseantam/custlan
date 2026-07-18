import Parser from "./frontend/parser.ts"
import { evaluate } from "./runtime/interpreter.ts";

repl()

async function repl() {
    const parser = new Parser();

    console.log("Repl v0.1")

    while (true) {
        const input = prompt(">");

        if (!input || input.includes("exit")) {
            Deno.exit(1);
        } 

        const program = parser.produceAST(input); // produceAST includes lexer
        const result = evaluate(program)
        console.log(result)        
    }
}

/* 
1. Lexing
2. Define AST Types
3. Build AST Logic
*/