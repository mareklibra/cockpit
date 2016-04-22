require([
  "react",
  "redux",
  "vms/store",
  "vms/app"
], function (React, { Provider }, store, App) {

  React.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'));
});
