// deno-lint-ignore-file no-explicit-any
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral } from "./ast.ts"
import { tokenize, Token, TokenType } from "./lexer.ts"

export default class Parser {
    private tokens: Token[] = []

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF
    } // check if the next token is not EOF

    private at() {
        return this.tokens[0] as Token // as Token means represent tokens[0] as value & type
    } // get current token

    private eat() {
        const prev = this.tokens.shift() as Token;
        return prev;
    } // remove and return current token

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, "Expecting: ", type)
            Deno.exit(1)
        }

        return prev
    } // remove and return current token, with optional argument for error handling

    public produceAST(sourceCode: string): Program {
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
    } // the main function for the parser 

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

        return left;
    } // parse additive expr, get current value (left) --> get operator --> get right value --> return left (which is now a binary expr) 

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

        return left;
    } // parse multiplicitive expr, get current value (left) --> get operator --> get right value --> return left (which is now a binary expr)

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) { // this is the core logic for the ast in the body array
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
            case TokenType.Null: {
                this.eat()
                return { kind: "NullLiteral", value: "null" } as NullLiteral
            }
            default:
                console.error("Unexpected token found during parsing!", this.at());
                Deno.exit(1);
        }
    } // parse primary expr, check if the current token is an identifier, number, or open paren. If it's an identifier or number, return the corresponding AST node. If it's an open paren, parse the expression inside the parentheses and expect a closing paren. If none of these cases match, log an error and exit.
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

Order of Prescidence
AddictiveExpr
MultiplicitaveExpr
PrimaryExpr

KNOWLEDGE LEARNT:
1. Parse Stmt
2. Parse Expr
3. Parse Additive Expr & Multiplicative Expr
4. Error Handling
5. Check for EOF
*/
