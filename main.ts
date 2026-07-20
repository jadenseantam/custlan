import Parser from "./frontend/parser.ts"
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_NUMBER, MK_BOOL } from "./runtime/values.ts";

repl()

async function repl() {
    const parser = new Parser();
    const env = new Environment()
    
    // declaring system variables
    env.declareVar("x", MK_NUMBER(100))
    env.declareVar("true", MK_BOOL(true))
    env.declareVar("false", MK_BOOL(false))
    env.declareVar("null", MK_NULL())

    // main repl
    console.log("Repl v0.1")

    while (true) {
        const input = prompt(">");

        if (!input || input.includes("exit")) {
            Deno.exit(1);
        } 

        const program = parser.produceAST(input); // produceAST includes lexer
        const result = evaluate(program, env)
        console.log(result)        
    }
}

/* 
1. Lexing
2. Define AST Types
3. Build AST Logic
4. Declare system variables (i.e. True, False, etc)
*/