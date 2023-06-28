const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope) => {
  $scope.selectedItemKeys = [];
  $scope.selectionMode = 'all';
  $scope.selectAllMode = 'page';

  $scope.listOptions = {
    dataSource: new DevExpress.data.DataSource({
      store: new DevExpress.data.ArrayStore({
        key: 'id',
        data: tasks,
      }),
    }),
    height: 400,
    showSelectionControls: true,
    bindingOptions: {
      selectedItemKeys: 'selectedItemKeys',
      selectionMode: 'selectionMode',
      selectAllMode: 'selectAllMode',
    },
  };

  $scope.selectAllModeOptions = {
    items: ['page', 'allPages'],
    inputAttr: { 'aria-label': 'Selection All' },
    bindingOptions: {
      disabled: "selectionMode !== 'all'",
      value: 'selectAllMode',
    },
  };

  $scope.selectionModeOptions = {
    items: ['none', 'single', 'multiple', 'all'],
    elementAttr: { 'aria-label': 'Selection By Click' },
    bindingOptions: {
      value: 'selectionMode',
    },
  };
});
