function stringEndWith(string, key) {
    return string.indexOf(key, string.length - key.length) != -1;
}

function generateLeadingZero(originalNumber, size) {
    var result = originalNumber.toString();
    while (result.length < size) {
        result = "0" + result;
    }
    return result;
}