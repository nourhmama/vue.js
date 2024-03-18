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
      name: 'Error 404',
      path: '/pages/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    {
      path: '/auth/forgot-password', // Ajout de la route pour Forgot Password
      name: 'forgot-password',
      component: () => import('@/views/authentication/authForms/ForgotPassword.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/auth/reset-password',
      name: 'reset-password',
      component: () => import('@/views/authentication/authForms/ResetPassword.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/auth/verify-email',
      name: 'verify-email',
      component: () => import('@/views/authentication/authForms/VerifyEmail.vue'),
      meta: {
        requiresAuth: false,
      },
      props: (route: { query: { email: any; }; }) => ({ email: route.query.email }) // Permet de passer l'e-mail en tant que prop
    },
    {
      path: '/auth/reset-password-confirmation',
      name: 'reset-password-confirmation',
      component: () => import('@/views/authentication/authForms/ResetPasswordConfirmation.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ]
};

export default AuthRoutes;
