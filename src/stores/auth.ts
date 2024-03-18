import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = 'http://dev.back-end.localhost/api'; // URL de base

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    returnUrl: null
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetchWrapper.post(`${baseUrl}/login`, { email, password });
        const responseData = response.data;

        // Vérifier si le champ 'role' est disponible dans la réponse
        if (responseData.user && responseData.token) {
          // Stocker à la fois l'utilisateur et le token dans le localStorage
          localStorage.setItem('user', JSON.stringify(responseData.user));
          localStorage.setItem('token', responseData.token);

          if (responseData.user.role === 'admin') {
            this.user = responseData.user;
            router.push('/dashboard'); // Redirection vers le tableau de bord pour les administrateurs
          } else {
            this.user = responseData.user;
            router.push('/landing'); // Redirection vers la page d'accueil pour les utilisateurs réguliers
          }
        } else {
          console.error('User or token not found in server response');
          // Gérer l'erreur de connexion ici
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion :", error);
        // Gérer l'erreur de connexion ici
      }
    },

    async logout() {
      try {
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }
        // Effectuer une requête DELETE vers l'URL de déconnexion
        const response = await fetch(`${baseUrl}/logout`, {
          method: 'DELETE', // Assurez-vous que la méthode HTTP est correcte
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        // Vérifier si la déconnexion s'est bien passée
        if (response.ok) {
          // Supprimer le token du localStorage après la déconnexion
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          // Supprimer les données de l'utilisateur de l'état Pinia
          this.user = null;
          // Rediriger l'utilisateur vers la page de connexion
          router.push('/auth/login');
          console.log('Logout successful');
        } else {
          // Si la déconnexion échoue, afficher un message d'erreur
          throw new Error('Failed to logout');
        }
      } catch (error) {
        console.error('Failed to logout:', error);
        // Gérer l'erreur de déconnexion ici
      }
    }
  }
});
