<template>
  <div class="d-flex justify-space-between align-center">
    <h3 class="text-h3 text-center mb-0">Sign up</h3>
    <router-link to="/auth/login" class="text-primary text-decoration-none">Already have an account?</router-link>
  </div>
  <v-form ref="Regform" lazy-validation action="/dashboards/analytical" class="mt-7 loginForm">
    <v-row class="my-0">
      <v-col cols="12" sm="6" class="py-0">
        <div class="mb-6">
          <v-label>First Name*</v-label>
          <v-text-field
            v-model="first_name"
            :rules="firstRules"
            hide-details="auto"
            required
            variant="outlined"
            class="mt-2"
            color="primary"
            placeholder="John"
          ></v-text-field>
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="py-0">
        <div class="mb-6">
          <v-label>Last Name*</v-label>
          <v-text-field
            v-model="last_name"
            :rules="lastRules"
            hide-details="auto"
            required
            variant="outlined"
            class="mt-2"
            color="primary"
            placeholder="Doe"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
    <div class="mb-6">
      <v-label>Company*</v-label>
      <v-text-field
        v-model="company"
        :rules="companyRules"
        hide-details="auto"
        required
        variant="outlined"
        class="mt-2"
        color="primary"
        placeholder="Company Name"
      ></v-text-field>
    </div>
    <div class="mb-6">
      <v-label>Email Address*</v-label>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        placeholder="demo@company.com"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
    </div>
    <div class="mb-6">
      <v-label>Phone Number*</v-label>
      <v-text-field
        v-model="phone_number"
        :rules="phoneRules"
        placeholder="23-456-789"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
      ></v-text-field>
    </div>
    <div class="mb-6">
      <v-label>Password</v-label>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        placeholder="*****"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="pwdInput mt-2"
      >
        <template v-slot:append>
          <v-btn color="secondary" icon rounded variant="text">
            <EyeInvisibleOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == false" @click="show1 = !show1" />
            <EyeOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == true" @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>
    <div class="mb-6">
      <v-label>Password Confirmation</v-label>
      <v-text-field
        v-model="password_confirmation"
        placeholder="*****"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="pwdInput mt-2"
      >
        <template v-slot:append>
          <v-btn color="secondary" icon rounded variant="text">
            <EyeInvisibleOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == false" @click="show1 = !show1" />
            <EyeOutlined :style="{ color: 'rgb(var(--v-theme-secondary))' }" v-if="show1 == true" @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <h6 class="text-caption">
        By Signing up, you agree to our
        <router-link to="/auth/register" class="text-primary link-hover font-weight-medium">Terms of Service </router-link>
        and
        <router-link to="/auth/register" class="text-primary link-hover font-weight-medium">Privacy Policy</router-link>
      </h6>
    </div>
    <!-- <v-btn color="primary" block class="mt-4" variant="flat" size="large" @click="validate()">Create Account</v-btn> -->
    <v-form ref="Regform" lazy-validation action="/dashboards/analytical" class="mt-7 loginForm">
      <!-- Reste du formulaire ici -->

      <v-btn color="primary" block class="mt-4" variant="flat" size="large" @click="validate()">Create Account</v-btn>
    </v-form>
  </v-form>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { router } from '@/router';

const show1 = ref(false);
const password = ref('');
const email = ref('');
const phone_number = ref('');
const password_confirmation = ref('');
const Regform = ref();
const first_name = ref('');
const last_name = ref('');
const company = ref('');
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters'
]);
const firstRules = ref([(v: string) => !!v || 'First Name is required']);
const lastRules = ref([(v: string) => !!v || 'Last Name is required']);
const companyRules = ref([(v: string) => !!v || 'Company is required']);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);
const phoneRules = ref([(v: string) => !!v || 'Phone number is required']);

function validate() {
  Regform.value.validate().then((isValid) => {
    if (isValid) {
      submitForm();
    }
  });
}

function submitForm() {
  console.log('submitForm() called');
  const formData = {
    first_name: first_name.value,
    last_name: last_name.value,
    company: company.value,
    email: email.value,
    phone_number: phone_number.value,
    password: password.value,
    password_confirmation: password_confirmation.value
  };

  // Envoyer les données du formulaire au serveur
  // Utilisez une méthode telle que fetch() ou Axios pour envoyer les données au backend
  fetch('http://dev.back-end.localhost/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then((response) => {
      if (response.ok) {
        router.push('/auth/login');
        console.log('User registered successfully!');
        // Redirection ou autre action
      } else {
        console.error('Failed to register user:', response.statusText);
        // Gestion des erreurs
      }
    })
    .catch((error) => {
      console.error('An error occurred while registering the user:', error);
      // Gestion des erreurs de requête
    });
}
</script>
