/**
 * Build widget configuration
 */
(function () {
    'use strict';
    angular
        .module(HygieiaConfig.module)
        .controller('AccessibilityWidgetConfigController', AccessibilityWidgetConfigController);
    AccessibilityWidgetConfigController.$inject = ['modalData', '$scope', 'collectorData', '$uibModalInstance'];
    function AccessibilityWidgetConfigController(modalData, $scope, collectorData, $uibModalInstance) {
        var ctrl = this,
        widgetConfig = modalData.widgetConfig;
        
        // public variables
        ctrl.buildDurationThreshold = 3;
        ctrl.buildConsecutiveFailureThreshold = 5;
        
        $scope.getJobs = function (filter) {
        	return collectorData.itemsByType('build/searchCollectorItem', {"search": "AChecker", "size": 20}).then(function (response){
        		return response;
        	});
        }
        
        loadSavedBuildJob();
        // set values from config
        if (widgetConfig) {
            if (widgetConfig.options.buildDurationThreshold) {
                ctrl.buildDurationThreshold = widgetConfig.options.buildDurationThreshold;
            }
            if (widgetConfig.options.consecutiveFailureThreshold) {
                ctrl.buildConsecutiveFailureThreshold = widgetConfig.options.consecutiveFailureThreshold;
            }
        }
        // public methods
        ctrl.submit = submitForm;

        // method implementations
        function loadSavedBuildJob(){
            ctrl.buildId ="";
        	var buildCollector = modalData.dashboard.application.components[0].collectorItems.Build,
            savedCollectorBuildJob = buildCollector ? buildCollector[0].description : null;

            if(savedCollectorBuildJob) {
                ctrl.buildId = buildCollector[0].id;
            	$scope.getJobs(savedCollectorBuildJob).then(getBuildsCallback) 
            }
        }
        
        function getBuildsCallback(data) {
            _(data).forEach(function (item) {
                if(item.id == ctrl.buildId){
                    ctrl.collectorItemId = item;
                }
            });
        }

        function submitForm(valid, collector) {
            if (valid) {
                var form = document.buildAccessibilityConfigForm;
                var postObj = {
                    name: 'accessibility',
                    baseUrl: 'teamdashboardwidget',
                    options: {
                    	id: widgetConfig.options.id,
                        buildDurationThreshold: parseFloat(form.buildDurationThreshold.value),
                        consecutiveFailureThreshold: parseFloat(form.buildConsecutiveFailureThreshold.value)
                    },
                    componentId: modalData.dashboard.application.components[0].id,
                    collectorItemId: collector.id,
                };
                // pass this new config to the modal closing so it's saved
                $uibModalInstance.close(postObj);
            }
        }
    }
})();
