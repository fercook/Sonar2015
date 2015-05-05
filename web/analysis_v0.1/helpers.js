maxindex = function (array, f) {
    var i = -1,
        n = array.length,
        a, b, j = -1;
    if (arguments.length === 1) {
        while (++i < n)
            if ((b = array[i]) != null && b >= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = array[i]) != null && b > a) {
                a = b;
                j = i;
            }
    } else {
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b >= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b > a) {
                a = b;
                j = i;
            }
    }
    return j;
}

minindex = function (array, f) {
    var i = -1,
        n = array.length,
        a, b, j = -1;
    if (arguments.length === 1) {
        while (++i < n)
            if ((b = array[i]) != null && b <= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = array[i]) != null && b < a) {
                a = b;
                j = i;
            }
    } else {
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b <= b) {
                a = b;
                j = i;
                break;
            }
        while (++i < n)
            if ((b = f.call(array, array[i], i)) != null && b < a) {
                a = b;
                j = i;
            }
    }
    return j;
}
