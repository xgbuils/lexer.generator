var LexerTokenBuilder = require('./lexer-token-builder')

function SymbolTokenBuilder () {
    LexerTokenBuilder.call(this, function (key, create) {
        return create(key, key)
    })
}

SymbolTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
SymbolTokenBuilder.prototype.constructor = SymbolTokenBuilder

module.exports = SymbolTokenBuilder
