import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = 'http://dev.back-end.localhost/api'; // URL de base

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null, // Ne récupère pas les données de l'utilisateur du localStorage
    returnUrl: null
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetchWrapper.post(`${baseUrl}/login`, { email, password });
        const user = response.data; // Supposons que votre backend renvoie les données de l'utilisateur sous forme d'objet

        // Afficher les données de l'utilisateur renvoyées par le backend dans la console
        console.log("Données de l'utilisateur :", user);

        // Mettre à jour l'état de Pinia
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user)); // Facultatif : stocker les données dans le localStorage si nécessaire
        router.push(this.returnUrl || '/dashboard');
      } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion :", error);
        // Gérer l'erreur de connexion ici
      }
    },
    async logout() {
      try {
        // Récupérer le token depuis le localStorage
        const localStorageData = localStorage.getItem('user');
        if (!localStorageData) {
          throw new Error('User data not found in localStorage');
        }
        // Parser les données en tant qu'objet JavaScript
        const userData = JSON.parse(localStorageData);
        // Extraire le token de l'objet userData
        const token = userData.token;
        if (!token) {
          throw new Error('Token not found in localStorage');
        }
        // Effectuer une requête DELETE vers l'URL de déconnexion
        const response = await fetch(`${baseUrl}/logout`, {
          method: 'DELETE', // Assurez-vous que la méthode HTTP est correcte
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // Vérifier si la déconnexion s'est bien passée
        if (response.ok) {
          // Supprimer le token du localStorage après la déconnexion
          localStorage.removeItem('user');
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
