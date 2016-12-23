var LexerTokenBuilder = require('./lexer-token-builder')

function ExpresionTokenBuilder (expressions, type) {
    LexerTokenBuilder.call(this, function (key, create) {
        var value = expressions[key]
        if (value) {
            return create(value, type)
        }
    })
}

ExpresionTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
ExpresionTokenBuilder.prototype.constructor = ExpresionTokenBuilder

module.exports = ExpresionTokenBuilder
