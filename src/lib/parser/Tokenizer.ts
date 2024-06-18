import type {Token} from "./types/token/Token";

export class Tokenizer {

    private sqlQuery: string;
    private tokens: Token[]
    private cursor: number;

    constructor(sqlQuery: string) {
        this.sqlQuery = sqlQuery;
        this.tokens = [];
        this.cursor = 0;
    }

    private handlePreviousWord(word: string) {
        if (!word || word.trim().length === 0) {
            return;
        }

        let beginIndex = this.cursor - word.length;
        let endIndex = this.cursor;

        const token: object = {
            type: null,
            beginIndex,
            endIndex,
            value: word
        }

        if (word.toUpperCase() === 'SELECT') {
            token.type = "SELECT"
        } else if (word === '*') {
            token.type = "LITERAL"
        } else if (word.toUpperCase() === 'FROM') {
            token.type = "FROM"
        } else if (word.toUpperCase() === 'WHERE') {
            token.type = "WHERE"
        } else if (word.toUpperCase() === 'AND') {
            token.type = "AND"
        } else if (word === '=') {
            token.type = "OPERATOR"
            token.value = 'EQUALS'
        } else if (word === '==') {
            token.type = "OPERATOR"
            token.value = "EQUALS"
        } else if (word === '!=') {
            token.type = "OPERATOR"
            token.value = "NOT_EQUALS"
        } else if (word === '>') {
            token.type = "OPERATOR"
            token.value = "GREATER_THAN"
        } else if (word === '<') {
            token.type = 'OPERATOR'
            token.value = 'LESSER_THAN'
        } else {
            token.type = "LITERAL"
        }

        this.tokens.push(token as Token)
    }

    private handleStringToken(openingChar: string) {

        let beginIndex = this.cursor;
        let chars = [];
        let previousChar = null;
        while (this.cursor <= this.sqlQuery.length) {
            const currentChar = this.sqlQuery[this.cursor];
            if (currentChar === openingChar && previousChar !== '\\') {
                this.cursor++;
                this.tokens.push({
                    type: 'LITERAL',
                    beginIndex: beginIndex,
                    endIndex: this.cursor,
                    value: chars.join('')
                })
                return;
            }

            previousChar = currentChar;
            chars.push(currentChar);
            this.cursor++;
        }

    }

    tokenize(): Token[] {
        let currentWord = '';
        while (this.cursor <= this.sqlQuery.length) {
            const currentChar = this.sqlQuery[this.cursor];
            this.cursor++;

            if (currentChar === '\'' || currentChar === '"') {
                this.handleStringToken(currentChar);
                currentWord = '';
            } else if (currentChar === ' ' || this.cursor === this.sqlQuery.length + 1) {
                this.handlePreviousWord(currentWord);
                currentWord = '';
            } else {
                currentWord += currentChar;
            }
        }


        return this.tokens;
    }

}