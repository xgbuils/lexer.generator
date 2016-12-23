function exec (regexp, string, column) {
    regexp.lastIndex = column
    var matches = regexp.exec(string)
    var match = matches && matches[0]
    return match && regexp.lastIndex - column === match.length ? match : null
}

module.exports = exec
