import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Shopping from './views/Shopping.vue'
import auth from './auth'
import moment from 'moment';

Vue.use(Router)

// eslint-disable-next-line
function requireAuth (to, from, next) {
  if (!auth.LoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/shopping/:id',
      name: 'shopping',
      component: Shopping
      //beforeEnter: requireAuth
    },
    { 
      path: '/login',
      name: 'login',
      component: Login 
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    { 
      path: '/logout',
      beforeEnter(to, from, next) {
        auth.logout();
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("expiresIn");
        next('/');
      }
    }
  ]
});

// eslint-disable-next-line
//before each route check if session expired
router.beforeEach((to, from, next) => {
  const remember = localStorage.getItem("rememberMe");
  if( auth.LoggedIn() && 
      remember !== null &&
      JSON.parse(remember) && 
      localStorage.expiresIn && 
      moment(localStorage.expiresIn).isBefore(moment()) )
  {
    console.log("session expired");
    auth.logout();
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("expiresIn");
}
  next();
})

export default router;
