/*
INPUT: LEXER OUTPUT
OUTPUT: 
{
  "kind": "Program",
  "body": [
    {
      "kind": "BinaryExpr",
      "operator": "=",
      "left": { "kind": "Identifier", "symbol": "x" },
      "right": { "kind": "NumericLiteral", "value": 10 }
    }
  ]
}
*/

// Defines the structure of the language AST

export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "NullLiteral"
  | "Identifier"
  | "BinaryExpr";

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program",
  body: Stmt[]
}

export interface Expr extends Stmt {}
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr"
  left: Expr, 
  right: Expr, 
  operator: string
}

export interface Identifier extends Expr {
  kind: "Identifier", 
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral", 
  value: number
}

export interface NullLiteral extends Expr {
  kind: "NullLiteral",
  value: "null"
}

/*
KNOWLEDGE LEARNT
1. NodeType
2. Stmt
3. Program
4. Expr
5. BinaryExpr, Identifier, NumericLiteral...
*/