/*       
  Fix Google Chrome(chinese version) set minimum font-size as 12px by default,
  if you are using '1rem=10px',this Chrome issue will cause error computation，
  we should modify stylesheet using javascript
   --Jodylai
*/
(function () {
    var root = document.documentElement;
    var rootFS = parseFloat(getComputedStyle(root)["font-size"].replace('px', ''));
    if (rootFS !== 10) {
        root.style.setProperty('font-size', rootFS + 'px', 'important');
        var scale = 10.0 / rootFS;
        var len = document.styleSheets.length;
        for (var i = 0; i < len; i++) {
            var css = document.styleSheets[i].cssRules;
            var ruleLen = css.length;
            for (var j = 0; j < ruleLen; j++) {
                var rule = css[j].style;
                if (rule) {
                    var ilen = rule.length;
                    for (var k = 0; k < ilen; k++) {
                        var cssName = rule[k];
                        var isImportant = rule.getPropertyPriority(cssName);
                        var cssVal = rule[cssName];
                        var pattern = /[+-]?([0-9]*[.])?[0-9]+rem/gi;
                        var matches = cssVal.match(pattern);
                        if (matches) {
                            var mlen = matches.length;
                            for (var m = 0; m < mlen; m++) {
                                var mVal = matches[m];
                                var newVal = (parseFloat(mVal.replace(/rem/i, '')) * scale).toFixed(6);
                                rule.setProperty(cssName, cssVal.replace(mVal, newVal + 'rem'), isImportant);
                            }
                        }
                    }
                }
            }
        }
    }
}());