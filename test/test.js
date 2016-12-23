var chai = require('chai')
var expect = chai.expect
var lexer = require('../src/')
var numToInterval = require('math.interval-utils').numToInterval
var MSet = require('math.set')

function toArray (it) {
    var a = it.next()
    var values = []
    while (!a.done) {
        values.push(a.value)
        a = it.next()
    }
    return values
}

describe('lexer of mathematic expression', function () {
    describe('(sum(a, b), mul(sum(c, a), c)', function () {
        it('returns an iterum instance with correct values', function () {
            var string = '(sum(a, b), mul(sum(c, 8), c)'
            var sum = 'sumFn'
            var mul = 'mulFn'
            var a = '{1}'
            var b = '{2}'
            var c = '{3}'
            var functions = {
                sum: sum,
                mul: mul
            }
            var sets = {
                a: a,
                b: b,
                c: c
            }
            var config = {
                ignore: /\s+/,
                creators: [{
                    regexp: /\w+/,
                    transform: functions,
                    type: 'function'
                }, {
                    regexp: /\w+/,
                    transform: sets,
                    type: 'set'
                }, {
                    regexp: /\d+(\.\w*)?/,
                    transform: function (key) {
                        return MSet(numToInterval(Number(key)))
                    },
                    type: 'set'
                }, {
                    regexp: /[,()]/
                }]
            }
            var result = toArray(lexer(string, config))
            expect(result).to.be.deep.equal([{
                value: '(',
                key: '(',
                type: '(',
                column: 1
            }, {
                value: sum,
                key: 'sum',
                type: 'function',
                column: 2
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 5
            }, {
                value: a,
                key: 'a',
                type: 'set',
                column: 6
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 7
            }, {
                value: b,
                key: 'b',
                type: 'set',
                column: 9
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 10
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 11
            }, {
                value: mul,
                key: 'mul',
                type: 'function',
                column: 13
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 16
            }, {
                value: sum,
                key: 'sum',
                type: 'function',
                column: 17
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 20
            }, {
                value: c,
                key: 'c',
                type: 'set',
                column: 21
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 22
            }, {
                value: new MSet(numToInterval(8)),
                key: '8',
                type: 'set',
                column: 24
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 25
            }, {
                value: ',',
                key: ',',
                type: ',',
                column: 26
            }, {
                value: c,
                key: 'c',
                type: 'set',
                column: 28
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 29
            }, {
                type: 'end'
            }])
        })
    })
})

describe('lexer of set expression', function () {
    describe('(R^3 x ((2, 4) U {5})^2) x S_5', function () {
        it('returns an iterum instance with correct values', function () {
            var string = '(R^3 x ((2, 4) U {5})^2) x S_5'
            var R = 'R'
            var S_5 = '{1, 2, 3, 4, 5}'
            var sets = {
                R: R,
                S_5: S_5
            }
            var config = {
                ignore: /\s+/,
                creators: [{
                    regexp: /\w+/,
                    transform: sets,
                    type: 'set'
                }, {
                    regexp: /[\(\[\{][\w.,\s]+[\)\]\}](\s*U\s*[\(\[\{][\w.,\s]+[\)\]\}])*/,
                    transform: function (key) {
                        return new MSet(key)
                    },
                    type: 'set'
                }, {
                    regexp: /\d+/,
                    transform: parseInt,
                    type: 'integer'
                }, {
                    regexp: /[x()^]/
                }]
            }
            var result = toArray(lexer(string, config))
            expect(result).to.be.deep.equal([{
                value: '(',
                key: '(',
                type: '(',
                column: 1
            }, {
                value: R,
                key: 'R',
                type: 'set',
                column: 2
            }, {
                value: '^',
                key: '^',
                type: '^',
                column: 3
            }, {
                value: 3,
                key: '3',
                type: 'integer',
                column: 4
            }, {
                value: 'x',
                key: 'x',
                type: 'x',
                column: 6
            }, {
                value: '(',
                key: '(',
                type: '(',
                column: 8
            }, {
                value: new MSet('(2, 4) U {5}'),
                key: '(2, 4) U {5}',
                type: 'set',
                column: 9
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 21
            }, {
                value: '^',
                key: '^',
                type: '^',
                column: 22
            }, {
                value: 2,
                key: '2',
                type: 'integer',
                column: 23
            }, {
                value: ')',
                key: ')',
                type: ')',
                column: 24
            }, {
                value: 'x',
                key: 'x',
                type: 'x',
                column: 26
            }, {
                value: S_5,
                key: 'S_5',
                type: 'set',
                column: 28
            }, {
                type: 'end'
            }])
        })
    })
})
