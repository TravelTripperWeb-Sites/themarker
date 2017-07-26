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
  });