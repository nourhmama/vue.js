<template>
  <div class="verifyEmailPage">
    <div class="message">
      <!-- Insérer l'icône email ici -->
      <img :src="emailIcon" class="email-icon">

      <!-- Utilisez la propriété $route directement pour accéder aux paramètres de requête -->
      <h3 class="text-h3 text-center">Vérifiez votre adresse e-mail</h3>
      <p class="text-center">Un e-mail de réinitialisation de mot de passe a été envoyé à votre adresse e-mail <span class="highlight">{{ $route.query.email }}</span>. Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import emailIcon from '@images/email.png';
// Ne pas importer $route depuis vue-router, il est disponible directement dans le contexte du composant
</script>

<style lang="scss">
.verifyEmailPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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

.highlight {
  font-size: 19px; /* Taille de police plus grande */
  color: black; /* Couleur de police noire */
}
</style>
