var LexerTokenBuilder = require('./lexer-token-builder')

function TransformTokenBuilder (transform, type) {
    LexerTokenBuilder.call(this, function (key, create) {
        return create(transform(key), type)
    })
}

TransformTokenBuilder.prototype = Object.create(LexerTokenBuilder.prototype)
TransformTokenBuilder.prototype.constructor = TransformTokenBuilder

module.exports = TransformTokenBuilder
