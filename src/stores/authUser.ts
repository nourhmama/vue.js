import { defineStore } from 'pinia';

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useUsersStore = defineStore({
  id: 'Authuser',
  state: () => ({
    users: {}
  }),
  actions: {
    async getAll() {
      this.users = { loading: true };
      fetchWrapper
        .get(baseUrl)
        .then((users) => (this.users = users))
        .catch((error) => (this.users = { error }));
    },
    async forgotPassword(email: any) {
      try {
        const response = await fetchWrapper.post(`${import.meta.env.VITE_API_URL}/forgot-password`, { email });
        // console.log('Response:', response);
        // Gérer la réponse de l'API si nécessaire
      } catch (error) {
        console.error("Une erreur s'est produite lors de l'envoi de la demande de réinitialisation de mot de passe :", error);
        throw error;
      }
    }
    
    
  }
});
