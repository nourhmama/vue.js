<template>
  <div class="ResetPasswordPage">
    <div class="restBox">
      <h3 class="text-h3 text-center mb-10">Reset the password</h3>
      <Form @submit="resetPassword" class="ResetPasswordForm" v-slot="{ errors, isSubmitting }">
        <div>
          <v-label> New Password</v-label>
          <v-text-field
            aria-label="password"
            v-model="password"
            :rules="passwordRules"
            required
            variant="outlined"
            color="primary"
            hide-details="auto"
            :type="showPassword ? 'text' : 'password'"
            class="pwdInput mt-2"
          >
            <template v-slot:append>
              <v-btn color="secondary" icon rounded variant="text" @click="toggleShowPassword">
                <v-icon :style="{ color: showPassword ? 'rgb(var(--v-theme-secondary))' : '' }">
                  {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
        <div class="mt-4">
          <v-label> Confirm the password </v-label>
          <v-text-field
            aria-label="confirmPassword"
            v-model="confirmPassword"
            :rules="confirmPasswordRules"
            required
            variant="outlined"
            color="primary"
            hide-details="auto"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="pwdInput mt-2"
          >
            <template v-slot:append>
              <v-btn color="secondary" icon rounded variant="text" @click="toggleShowConfirmPassword">
                <v-icon :style="{ color: showConfirmPassword ? 'rgb(var(--v-theme-secondary))' : '' }">
                  {{ showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
        <v-btn color="primary" :loading="isSubmitting" block class="mt-8" variant="flat" size="large" :disabled="isSubmitting || password === '' || confirmPassword === '' || Boolean(passwordError) || Boolean(confirmPasswordError)" type="submit">
          Continue
        </v-btn>

        <div v-if="errors && errors.apiError" class="mt-4">
          <v-alert color="error">{{ errors.apiError }}</v-alert>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form, useField } from 'vee-validate';
import { useRouter } from 'vue-router';

const password = ref('');
const confirmPassword = ref('');
const router = useRouter();

// Password validation rules
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters'
]);

// Confirm password validation rules
const confirmPasswordRules = ref([
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === password.value || 'Passwords do not match'
]);

const { value: passwordValue, errorMessage: passwordError } = useField('password', value => {
  if (typeof value !== 'string') {
    return 'Invalid password';
  }

  const errors = passwordRules.value.map(rule => rule(value)).filter(error => typeof error === 'string');
  return errors.length === 0 ? true : errors[0];
});

const { value: confirmPasswordValue, errorMessage: confirmPasswordError } = useField('confirmPassword', value => {
  if (typeof value !== 'string') {
    return 'Invalid confirmation password';
  }

  const errors = confirmPasswordRules.value.map(rule => rule(value)).filter(error => typeof error === 'string');
  return errors.length === 0 ? true : errors[0];
});

// State to toggle password visibility
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Function to toggle password visibility
function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}

function toggleShowConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

async function resetPassword() {
  try {
    const response = await fetch('http://dev.back-end.localhost/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  
      },
      body: JSON.stringify({
        password: password.value,
        password_confirmation: confirmPassword.value,
        token: router.currentRoute.value.query.token
      })
    });

    if (response.ok) {
      router.push({ name: 'reset-password-confirmation' });
    } else {
      const data = await response.json();
      throw new Error(data.message || 'Password reset failed');
    }
  } catch (error) {
    console.error("An error occurred while resetting the password:", error);
  }
}

</script>

<style lang="scss">
.ResetPasswordPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fefefe;
}

.restBox {
  width: 40%;
  max-width: 600px;
  margin: 0 auto;
  padding: 120px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.inputField {
  border-radius: 15px;
  font-size: 18px;
}


.ResetPasswordForm {
  .v-text-field .v-field--active input {
    font-weight: 600;
  }
}
</style>
