var Iterum = require('iterum')
var Value = Iterum.Value

var TokenCalculator = require('./token-calculator')
var exec = require('./regexp-utils/exec')
var toGlobal = require('./regexp-utils/to-global')

function lexerGenerator (string, config) {
    var endToken = {
        type: 'end'
    }
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
    .concat(Value(endToken))
    .build()()
}

module.exports = lexerGenerator
