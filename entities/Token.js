"use strict";
/// <reference path="../node.d.ts" />
var fs = require("fs");
var path_to_tokens = "./apixml/tokens.json";
var CBFramework;
(function (CBFramework) {
    var Token = (function () {
        function Token(userId, tokenString) {
            this.userId = userId;
            this.tokenString = tokenString;
            this.id = userId;
            this.token = tokenString;
            this.expires = new Date();
        }
        Token.isActive = function (token) {
            var data = fs.readFileSync(path_to_tokens, 'utf8');
            return false;
        };
        Token.addToken = function (token) {
            if (this.tokens.indexOf(token) > -1) {
                return false;
            }
            this.tokens.push(token);
        };
        Token.tokens = [];
        return Token;
    }());
})(CBFramework || (CBFramework = {}));
//# sourceMappingURL=Token.js.map