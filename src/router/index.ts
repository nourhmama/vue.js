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
  const auth: AuthStore = useAuthStore();

  // Restauration des données d'authentification
  const user = localStorage.getItem('user');
  if (user) {
    auth.user = JSON.parse(user);
  }

  // Vérification si l'utilisateur est sur une page publique
  const isPublicPage = publicPages.includes(to.path);

  // Vérification si l'utilisateur est déjà authentifié
  const isAuthenticated = auth.user !== null;

  // Si la page nécessite une authentification et que l'utilisateur n'est pas authentifié,
  // ou si l'utilisateur est sur une page publique, redirigez-le vers la page de connexion
  if (!isAuthenticated && !isPublicPage) {
    auth.returnUrl = to.fullPath;
    next('/auth/login');
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
