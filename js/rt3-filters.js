angular.module('rezTrip')
  .filter('isArray', [function () {
    return function (input) {
      return angular.isArray(input);
    };
  }]).filter('formatpolicydescription', function () {
    return function (text) {
      return text ? String(text).replace('["', '<p>').replace('"]', '</p>').replace(',', ' ') : '';
    }
  }).filter('renderHTMLCorrectly', function ($sce) {
    return function (stringToParse) {
      return $sce.trustAsHtml(stringToParse);
    }
  }).filter('formatNameForLink', function () {
    return function (value) {
        var retString = String(value).toLowerCase();
        retString = retString.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // replace leading and trailing spaces
        retString = retString.replace('%', 'percent');
        retString = retString.replace(/[^A-Z0-9]+/ig, "-");
        retString = retString.replace(/^--s*/, '').replace(/--*$/, ''); // replace leading and trailing hyphen
        return (!value) ? '' : retString;
    };
});