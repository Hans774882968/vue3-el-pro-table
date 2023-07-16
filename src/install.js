import HelloWorld from './components/HelloWorld.vue';
import Vue3ProTable from './components/Vue3ProTable.vue';

function install(app) {
  if (install.installed) return;
  install.installed = true;

  app.component('test-hello-world', HelloWorld);
  app.component('vue3-pro-table', Vue3ProTable);
}

Vue3ProTable.install = install;

export default { install };
