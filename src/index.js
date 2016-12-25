var Iterum = require('iterum')
var Value = Iterum.Value

var TokenCalculator = require('./token-calculator')
var exec = require('./regexp-utils/exec')
var toGlobal = require('./regexp-utils/to-global')

function lexerGenerator (string, config) {
    return Iterum(function () {
        var tokenCalculator = new TokenCalculator(string, config.creators)
        var ignore = toGlobal(config.ignore)
        var column = 0

        return {
            next: function () {
                var ignoreMatch = exec(ignore, string, column)
                var start = ignoreMatch ? ignore.lastIndex : column
                var done = start === string.length
                var token
                if (!done) {
                    token = tokenCalculator.calculate(start + 1)
                    column = start + token.key.length
                }
                return {
                    value: token,
                    done: done
                }
            }
        }
    })
    .concat(Value(endToken(string.length + 1)))
    .build()()
}

function endToken (column) {
    return {
        type: 'end',
        key: '<<END OF LINE>>',
        column: column
    }
}

module.exports = lexerGenerator
