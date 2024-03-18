import '@fortawesome/fontawesome-free/css/all.min.css';
const AuthRoutes = {
  path: '/auth',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Login',
      path: '/auth/login',
      component: () => import('@/views/authentication/auth/LoginPage.vue')
    },
    {
      name: 'Register',
      path: '/auth/register',
      component: () => import('@/views/authentication/auth/RegisterPage.vue')
    },
    {
      name: 'Landing',
      path: '/landing',
      component: () => import('@/views/home/landing.vue')
    },
    {
      name: 'Error 404',
      path: '/pages/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
  ]
};

export default AuthRoutes;
