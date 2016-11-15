/// <reference path="../node.d.ts" />
import * as fs from "fs";
import {isNullOrUndefined} from "util";
const path_to_tokens = "./apixml/tokens.json";
namespace CBFramework {
    class Token {
        private static tokens: Array<Token> = [];

        id: number;
        token: string;
        expires: Date;

        constructor(public userId: number, public tokenString: string) {
            this.id = userId;
            this.token = tokenString;
            this.expires = new Date();
        }

        public static isActive(token: Token): boolean {
            let data = fs.readFileSync(path_to_tokens, 'utf8');
            return false;
        }

        public static addToken(token: Token): boolean {
            if (this.tokens.indexOf(token) > -1) {
                return false;
            }
            this.tokens.push(token)

        }
    }
}

