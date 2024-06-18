export interface BaseAstNode {
    type: string;
}

export type AstNode = BaseAstNode & Record<string, any>;

export type ProgramNode = AstNode & {
    type: 'program';
    body: AstNode;
}

export type SelectNode = AstNode & {
    type: 'select';
    columns: string[];
    from: string;
    where: WhereClause[];
}

export type WhereClause = {
    column: string;
    operator: string;
    value: string;
}

export const ERROR_NODE: AstNode = {
    type: 'error'
}