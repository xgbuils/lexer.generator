function toGlobal (regexp) {
    var source = regexp instanceof RegExp ? regexp.source : regexp
    source = typeof source === 'string' ? source : ''
    var flags = regexp.flags || ''
    return new RegExp(source, flags.replace('g', '') + 'g')
}

module.exports = toGlobal
