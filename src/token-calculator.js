var toGlobal = require('./regexp-utils/to-global')
var exec = require('./regexp-utils/exec')

var ExpressionTokenBuilder = require('./token-builder/expression-token-builder.js')
var TransformTokenBuilder = require('./token-builder/transform-token-builder.js')
var SymbolTokenBuilder = require('./token-builder/symbol-token-builder.js')

function TokenCalculator (string, creators) {
    this.string = string
    this.creators = creators.map(function (creator) {
        var type = creator.type
        var transforms = creator.transform
        transforms = Array.isArray(transforms) ? transforms : [transforms]
        var builders = transforms.map(function (transform) {
            if (typeof transform === 'function') {
                return new TransformTokenBuilder(transform, type)
            } else if (transform) {
                return new ExpressionTokenBuilder(transform, type)
            } else {
                return new SymbolTokenBuilder()
            }
        })
        return {
            regexp: toGlobal(creator.regexp),
            builder: builders
        }
    })
}

TokenCalculator.prototype.calculate = function (column) {
    var creators = this.creators
    var string = this.string
    var regexp
    var memoize = {}
    for (var i = 0; i < creators.length; ++i) {
        var creator = creators[i]
        regexp = creator.regexp
        var source = regexp.source
        var builders = creator.builder
        var key = memoize[source]
        if (!key) {
            memoize[source] = key = exec(regexp, this.string, column - 1)
        }
        for (var j = 0; j < builders.length; ++j) {
            var token = builders[j]
                .withKey(key)
                .withColumn(column)
                .build()
            if (token) {
                return token
            }
        }
    }
    throw Error('Unexpected `' + string.slice(column - 1, string.length) + '` in column ' + column + '.')
}

module.exports = TokenCalculator
