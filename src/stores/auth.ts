import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = 'http://dev.back-end.localhost/api'; // URL de base

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null, // Ne récupère pas les données de l'utilisateur du localStorage
    returnUrl: null as string | null // Mettre à jour le type de returnUrl
  }),
  
  actions: {

    async checkEmailExists(email: string): Promise<{ exists: boolean }> {
      try {
        const response = await fetchWrapper.post(`${baseUrl}/check-email-exists`, { email });
        console.log('Response from API:', response); // Ajoutez cette ligne pour afficher la réponse de l'API dans la console
        // Vérifiez ensuite la structure de la réponse dans la console pour vous assurer qu'elle contient la propriété 'exists'
        if (response.exists) {
          return { exists: response.exists };
        } else {
          throw new Error('Property "exists" not found in response');
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la vérification de l'e-mail :", error);
        return { exists: false };
      }
    }
    
    
    ,

    async login(email: string, password: string) {
      try {
        const response = await fetchWrapper.post(`${baseUrl}/login`, { email, password });
        const user = response.data; // Supposons que votre backend renvoie les données de l'utilisateur sous forme d'objet

        // Afficher les données de l'utilisateur renvoyées par le backend dans la console
        console.log("Données de l'utilisateur :", user);

        // Mettre à jour l'état de Pinia
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user)); // Facultatif : stocker les données dans le localStorage si nécessaire
        const router = useRouter();
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
          const router = useRouter();
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
    },
    async forgotPassword(email: string) {
      try {
        // Appel à l'API de réinitialisation de mot de passe avec la méthode POST
        const response = await fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
        
        // Vérifier si la requête a réussi avec un code 200
        if (response.status === 200) {
          console.log('Password reset initiated successfully');
          // Si la méthode ne lance pas d'erreur, cela signifie que le processus de réinitialisation a été initié avec succès
          // Vous pouvez rediriger l'utilisateur vers la page de vérification d'e-mail ou afficher un message de succès
          const router = useRouter();
          router.push('/auth/verify-email');
        } else {
          // Gérer les cas où la réponse n'est pas un succès (par exemple, 404 pour email non trouvé)
          throw new Error('Email not found');
        }
      } catch (error) {
        // Gérer les erreurs ici
        console.error("Une erreur s'est produite lors de la réinitialisation du mot de passe :", error);
        // Afficher un message d'erreur à l'utilisateur, par exemple avec une notification ou dans le formulaire
      }
    }, // Point-virgule ajouté ici
    async resetPassword(password: string, confirmPassword: string, token: string) {
      try {
        const response = await fetchWrapper.post(`${baseUrl}/reset-password`, {
          password,
          password_confirmation: confirmPassword,
          token
        });

        if (response.ok) {
          console.log('Password reset successful');
          // Rediriger l'utilisateur vers la page de confirmation de réinitialisation de mot de passe
          const router = useRouter();
          router.push('/auth/reset-password-confirmation');
        } else {
          // Gérer les cas où la réinitialisation de mot de passe a échoué
          throw new Error('Failed to reset password');
        }
      } catch (error) {
        // Gérer les erreurs ici
        console.error("Une erreur s'est produite lors de la réinitialisation du mot de passe :", error);
        // Afficher un message d'erreur à l'utilisateur, par exemple avec une notification ou dans le formulaire
      }
    }
  } // Point-virgule ajouté ici
});
