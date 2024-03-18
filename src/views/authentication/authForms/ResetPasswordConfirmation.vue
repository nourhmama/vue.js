<template>
    <div class="ResetPasswordConfirmationPage">
      <div class="message">
        <img :src="emailIcon" class="email-icon">
        <h3 class="text-h3 text-center">Password reset successful</h3>
        <p class="text-center">Your password has been successfully reset.</p>
        <v-btn color="primary" @click="redirectToLogin" block class="mt-8" variant="flat" size="large">
          Go to the login page
        </v-btn>
      </div>
    </div>
  </template>
  
  <script>
import emailIcon from '@images/verifie-icon.png';

export default {
  data() {
    return {
      emailIcon: emailIcon // ou simplement emailIcon si les noms sont identiques
    };
  },
  
  methods: {
    redirectToLogin() {
      this.$router.push({ name: 'Login' }); // Assurez-vous que 'login' correspond à la route de votre page de connexion
    }
  }
}

</script>
  
  <style lang="scss">
  .ResetPasswordConfirmationPage {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fefefe;
  }
  
  .message {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    padding: 40px;
    border-radius: 5px;
    background-color: #fffffffd;
    box-shadow: 0 0 10px rgba(75, 75, 75, 0.2);
  }
  
  .email-icon {
    width: 70px; /* Ajustez la taille de l'icône selon vos besoins */
    height: 70px; /* Ajustez la taille de l'icône selon vos besoins */
    margin-bottom: 20px; /* Ajoutez une marge en bas pour l'espacement */
  }
  
  .text-h3 {
    margin-top: 0; /* Supprime la marge supérieure par défaut */
  }
  
  .text-center {
    text-align: center; /* Centre le texte */
  }
  
  .mt-8 {
    margin-top: 8px; /* Ajoute une marge en haut */
  }
  
  .block {
    display: block; /* Affiche l'élément en tant que bloc */
  }
  
  .variant-flat {
    border: none; /* Supprime la bordure */
  }
  
  .size-large {
    font-size: 18px; /* Ajuste la taille de la police */
  }
  </style>
  