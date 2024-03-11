import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Placez la route vers la page de connexion en premier
    AuthRoutes,
    MainRoutes,
    // Redirection vers la page de connexion si l'URL ne correspond à aucune route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/auth/login'
    }
  ]
});

// Code de navigation de garde
router.beforeEach(async (to, from, next) => {
  const publicPages = ['/auth/login'];
  const authRequired = !publicPages.includes(to.path);
  const auth: AuthStore = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return next('/auth/login');
    } else next();
  } else {
    next();
  }
});

// Middleware pour l'affichage de la barre de chargement
router.beforeEach(() => {
  const uiStore = useUIStore();
  uiStore.isLoading = true;
});

router.afterEach(() => {
  const uiStore = useUIStore();
  uiStore.isLoading = false;
});
