import Vue from 'vue';
import Router from 'vue-router';
import Splash from './views/Splash.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'splash',
      component: Splash
    },
    {
      path: '/status',
      name: 'status',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: 'status' */ './views/Status.vue')
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: () => import(/* webpackChunkName: 'tutorial' */ './views/Tutorial.vue')
    },
    {
      path: '/training',
      name: "training",
      component: () => import(/* webpackChunkName: 'training' */ './views/Training.vue')
    },
    {
      path: '/sparring',
      name: 'sparring',
      component: () => import(/* webpackChunkName: 'sparring' */ './views/Sparring.vue')
    },
    {
      path: '/coming-soon',
      name: 'coming-soon',
      component: () => import(/* webpackChunkName: 'coming-soon' */ './views/ComingSoon.vue')
    }

  ]
});
