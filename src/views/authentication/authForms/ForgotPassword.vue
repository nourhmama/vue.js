<template>
  <div class="forgotPasswordPage">
    <div class="restBox">
      <h3 class="text-h3 text-center mb-10">Forgot Password</h3>
      <Form @submit="forgotPassword" class="forgotPasswordForm" v-slot="{ errors, isSubmitting }">
        <div class="mb-8">
          <v-label class="mb-2" style="font-size: 18px;">Email Address</v-label>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            class="mt-3 inputField"
            required
            hide-details="auto"
            variant="outlined"
            color="primary"
          ></v-text-field>
        </div>
        <!-- Afficher les erreurs au-dessus du bouton "Continuer" -->
        <div v-if="errorMessage" class="mb-4">
          <v-alert color="error">{{ errorMessage }}</v-alert>
        </div>
        <v-btn v-show="!isSubmitting" color="primary" block class="mt-8" variant="flat" size="large" :disabled="isDisabled" type="submit">
           Continue
      </v-btn>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Form } from 'vee-validate';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const emailRules = ref([
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]);
const router = useRouter();
const authStore = useAuthStore();

let errorMessage = ''; // Variable pour stocker le message d'erreur
const isSubmitting = ref(false); // Ajout de la variable isSubmitting

async function forgotPassword() {
  try {
    // Définir isSubmitting sur true avant l'appel à l'API
    isSubmitting.value = true;

    // Appel à l'API pour vérifier si l'e-mail existe dans la base de données
    const response = await authStore.checkEmailExists(email.value);
    
    // Définir isSubmitting sur false une fois l'appel à l'API terminé
    isSubmitting.value = false;

    if (response.exists) {
      // Si l'e-mail existe, initier le processus de réinitialisation du mot de passe
      await authStore.forgotPassword(email.value);
      // Rediriger vers la page de vérification d'e-mail
      router.push({ path: '/auth/verify-email', query: { email: email.value } });
    } else {
      // Si l'e-mail n'existe pas, afficher un message d'erreur
      errorMessage = "Email not found.";
    }
  } catch (error: any) {
    // Gérer les erreurs ici
    console.error("Une erreur s'est produite lors de la vérification de l'e-mail :", error);
    // Définir isSubmitting sur false en cas d'erreur
    isSubmitting.value = false;
  }
}

const isDisabled = computed(() => !email.value);
</script>


<style lang="scss">
.forgotPasswordPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fefefe; /* Couleur d'arrière-plan */
}

.restBox {
  width: 40%; /* Augmenter la largeur de la restBox */
  max-width: 600px; /* Limiter la largeur maximale */
  margin: 0 auto;
  padding: 120px; /* Ajoutez un padding pour plus d'espace intérieur */
  border-radius: 5px; /* Arrondir les coins du formulaire */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Ajoutez une ombre plus prononcée */
}

.inputField {
  border-radius: 15px; /* Arrondir les coins des zones de saisie */
  font-size: 18px; /* Augmenter davantage la taille de la police des zones de saisie */
}

.forgotPasswordForm {
  .v-text-field .v-field--active input {
    font-weight: 600; /* Augmenter la pondération de la police pour les zones de saisie actives */
  }
}
</style>
