// deno-lint-ignore-file no-explicit-any
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier } from "./ast.ts"
import { tokenize, Token, TokenType } from "./lexer.ts"

export default class Parser {
    private tokens: Token[] = []

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF
    }

    private at() {
        return this.tokens[0] as Token // as Token means represent tokens[0] as value & type
    }

    private eat() {
        const prev = this.tokens.shift() as Token;
        return prev;
    } 

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, "Expecting: ", type)
            Deno.exit(1)
        }

        return prev
    }

    public produceAST (sourceCode: string): Program {
        this.tokens = tokenize(sourceCode)
        const program: Program = {
            kind: "Program",
            body: []
        }

        // Parse until EOF
        while (this.not_eof()) {
            program.body.push(this.parse_stmt())
        }

        return program
    }
    
    private parse_stmt(): Stmt {
        return this.parse_expr();
    } 

    private parse_expr(): Expr {
        return this.parse_additive_expr();
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicitive_expr(); // Parse left side

        while (this.at().value == "+" || this.at().value == "-") { // Check if the next operation is still +/-
            const operator = this.eat().value; // Get the current value (after the left --> operator)
            const right = this.parse_multiplicitive_expr(); // Parse right side
            left = {
                kind: "BinaryExpr",
                left, 
                right, 
                operator
            } as BinaryExpr
        }
        
        return left; // Return the Additive Expression
    }

    private parse_multiplicitive_expr(): Expr {
        let left = this.parse_primary_expr(); // Parse left side

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") { // Check if the next operation is still *//
            const operator = this.eat().value; // Get the current value (after the left --> operator)
            const right = this.parse_primary_expr(); // Parse right side
            left = {
                kind: "BinaryExpr",
                left, 
                right, 
                operator
            } as BinaryExpr
        }
        
        return left; // Return the Additive Expression
    }
    /* Order of Prescidence
    AssignmentExpr
    MemberExprr
    FunctionCall
    LogicalExpr
    ComparisonExpr
    AddictiveExpr
    MultiplicitaveExpr
    UnaryExpr
    PrimaryExpr
    */

    /* Order of Prescidence
    AddictiveExpr
    MultiplicitaveExpr
    PrimaryExpr
    */

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier: 
                return { kind: "Identifier", symbol: this.eat().value } as Identifier
            case TokenType.Number: 
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral
            case TokenType.OpenParen: {
                this.eat() // Eat OpenParen
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen, "Unexpected token found inside parenthesised expression. Expected closing parenthesis.") // closing paren
                return value
            }
            default: 
                console.error("Unexpected token found during parsing!", this.at());
                Deno.exit(1);
        }
    }
}

/*
KNOWLEDGE LEARNT:
1. Parse Stmt
2. Parse Expr
3. Parse Additive Expr & Multiplicative Expr
4. Error Handling
5. Check for EOF
*/
