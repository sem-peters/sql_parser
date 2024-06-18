import type {Token} from "./types/token/Token";
import type {AstNode, ProgramNode, SelectNode, WhereClause} from "./types/ast/AstNode";
import {ERROR_NODE} from "./types/ast/AstNode";

export class Parser {

    private tokens: Token[]
    private tokenCursor = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private select(): SelectNode {

        let stage: 'COLUMNS' | 'FROM' | 'WHERE' = 'COLUMNS';
        const columns = [];
        let fromTableName = '';
        const whereClauses = [];
        for (let i = 1; i < this.tokens.length; i++) {
            const token = this.tokens[i];

            if (stage === 'COLUMNS') {
                if (token.type === 'FROM') {
                    stage = 'FROM';
                    continue;
                }

                if (token.type === 'LITERAL') {
                    let colValue;
                    if (token.value.endsWith(',')) {
                        colValue = token.value.substring(0, token.value.length - 1);
                    } else {
                        colValue = token.value;
                    }

                    columns.push(colValue);
                    continue;
                }

                throw new Error("Could not parse token type in 'COLUMNS' stage: " + token.type)
            } else if (stage === 'FROM') {
                if (token.type === 'WHERE') {
                    stage = 'WHERE';
                    continue;
                }

                if (token.type === 'LITERAL') {
                    if (fromTableName !== '') {
                        throw new Error("Multiple tables not supported.")
                    }
                    fromTableName = token.value;
                    continue;
                }

                throw new Error("Could not parse token type in 'FROM' stage: " + token.type);
            } else if (stage === 'WHERE') {
                if (token.type === 'AND') {
                    continue;
                }

                if (token.type === 'LITERAL') {
                    const column = token.value;
                    i++;
                    const operator = this.tokens[i].value
                    i++;
                    const value = this.tokens[i].value;
                    whereClauses.push({
                        column,
                        operator,
                        value,
                    } as WhereClause)

                    continue;
                }

                throw new Error("Could not parse token type in 'WHERE' stage: " + token.type)
            }

        }

        return {
            type: 'select',
            columns: columns,
            from: fromTableName,
            where: whereClauses
        }
    }

    parse(): AstNode {

        if (!this.tokens || this.tokens.length === 0) return ERROR_NODE;

        const queryType = this.tokens[0].type;

        if (queryType !== 'SELECT') {
            return ERROR_NODE
        }

        const pN: ProgramNode = {
            type: 'program',
            body: this.select()
        }

        return pN
    }


}