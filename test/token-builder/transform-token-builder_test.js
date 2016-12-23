var chai = require('chai')
var expect = chai.expect
var TransformTokenBuilder = require('../../src/token-builder/transform-token-builder')

describe('TransformTokenBuilder', function () {
    it('with callback that transform the key, it builds a token with this value transformed', function () {
        var transform = function (key) {
            return key + key
        }
        var type = 'TYPE'
        var transformTokenBuilder = new TransformTokenBuilder(transform, type)
        var key = '123'
        var column = 4
        var token = transformTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.deep.equal({
            value: transform(key),
            type: type,
            key: key,
            column: column
        })
    })

    it('with transform callback that throws an error, it builds undefined', function () {
        var transform = function (key) {
            throw Error(key)
        }
        var type = 'TYPE'
        var transformTokenBuilder = new TransformTokenBuilder(transform, type)
        var key = null
        var column = 2
        var token = transformTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })

    it('with null key, it builds undefined', function () {
        var transform = function (key) {
            throw Error(key)
        }
        var type = 'TYPE'
        var transformTokenBuilder = new TransformTokenBuilder(transform, type)
        var key = null
        var column = 2
        var token = transformTokenBuilder
            .withKey(key)
            .withColumn(column)
            .build()

        expect(token).to.be.equal(undefined)
    })
})
