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

export type NodeType =
  | "Program"
  | "NumericLiteral"
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

/*
KNOWLEDGE LEARNT
1. NodeType
2. Stmt
3. Program
4. Expr
5. BinaryExpr, Identifier, NumericLiteral...
*/