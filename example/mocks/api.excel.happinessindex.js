angular.module('app')
  .run(function ($httpBackend) {

    $httpBackend.whenGET('/api/excel/happinessindex').respond({
      "maturityLevel": "4",
      "labels": ["03/04/18", "21/03/18", "15/05/18", "17/04/18", "01/05/18"],
      "data": [3.8, 3.5, 3.3, 3.1, 3.0]
    });

  });
