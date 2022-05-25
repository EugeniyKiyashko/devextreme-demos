window.onload = function () {
  const viewModel = {
    boxOptions: {
      rows: [
        { ratio: 1 },
        { ratio: 2 },
        { ratio: 1 },
      ],
      cols: [
        { ratio: 1 },
        { ratio: 2, screen: 'lg' },
        { ratio: 1 },
      ],
      singleColumnScreen: 'sm',
      screenByWidth(width) {
        return (width < 700) ? 'sm' : 'lg';
      },
    },
  };
  ko.applyBindings(viewModel, document.getElementById('page'));
};
