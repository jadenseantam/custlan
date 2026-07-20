import Parser from "./frontend/parser.ts"
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL } from "./runtime/values.ts";

repl()

function repl() {
    const parser = new Parser();
    const env = new Environment()
    
    // declaring system variables
    env.declareVar("true", MK_BOOL(true), true)
    env.declareVar("false", MK_BOOL(false), true)
    env.declareVar("null", MK_NULL(), true)

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
1. Lexer
2. AST Types
3. Parser (using AST Types, produces AST)
4. Interpreter (Evaluate AST)
5. Environment Variables (true, false, null) 
6. User Declarable Variables 
*/ 