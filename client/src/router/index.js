import Vue from 'vue';
import Router from 'vue-router';
import Discovery from '@/components/Discovery';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Discovery',
      component: Discovery
    }
  ]
});
