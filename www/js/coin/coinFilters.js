app.filter('coin', function () {
  // filter a coin widget based on the search text
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    for (key in input) {
        if ((input[key].name.toLowerCase().indexOf(expected) !== -1) || (input[key].symbol.toLowerCase().indexOf(expected) !== -1)) {
            result[key] = input[key];
        }
    } 

    return result;
  }
});

app.filter('coinamount', function () {
    // Strip any trailing zeros after the decimal point of a value
    // e.g. 12.4934000000 becomes 12.4934
    // 12.000 becomes 12
    return function (input) {
        var result;   
        if (!input) return input;
        if (input.indexOf(".") == -1) return input; // If there's no decimal point we don't need to do anything

        // Replace any trialing zeros at the end of the string 0*$ with a blank, in addition if there is a 
        // decimal point directly before the zeros remove that too
        var result = input.replace(/[.]?0*$/, "");
        return result;
  }
});
