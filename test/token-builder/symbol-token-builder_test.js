var chai = require('chai')
var expect = chai.expect
var SymbolTokenBuilder = require('../../src/token-builder/symbol-token-builder')

describe('SymbolTokenBuilder', function () {
    it('given a key, it builds a token with the same value and type as key', function () {
        var symbolTokenBuilder = new SymbolTokenBuilder()
        var key = ','
        var column = 11
        var token = symbolTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: key,
            type: key,
            key: key,
            column: column
        })
    })

    it('with null key, it builds undefined', function () {
        var setTokenBuilder = new SymbolTokenBuilder()
        var column = 6
        var key = null
        var token = setTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
