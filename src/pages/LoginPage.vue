<template>
  <!-- 
    LoginPage.vue - Page de connexion pour AREA
    
    Ce composant gère l'authentification de l'utilisateur.
    
    Props:
    - Aucun
    
    Events émis:
    - @login: Émis quand l'utilisateur se connecte avec succès, passe l'objet { email }
    
    État local:
    - email: Email de l'utilisateur
    - password: Mot de passe
    - showPassword: Boolean pour afficher/masquer le mot de passe 
  -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      
      <!-- Logo et titre de l'application -->
      <div class="text-center mb-8">
       
        <h1 class="text-3xl font-bold text-indigo-600 mb-2">AREA</h1>
        <p class="text-gray-600">Automate your workflow</p>
      </div>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleSubmit" class="space-y-6">

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div class="relative">
            <!-- Email Icon -->
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              v-model="email"
              type="email"
              @input="clearFieldError('email')"
              :class="[
                'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                errors.email 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500'
              ]"
              placeholder="you@example.com"
            />
          </div>
          <!-- Error message for email -->
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div class="relative">
            <!-- Lock Icon -->
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              @input="clearFieldError('password')"
              :class="[
                'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                errors.password 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500'
              ]"
              placeholder="••••••••"
            />
            <!-- Button to toggle password visibility -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <!-- Eye icon (show) -->
              <Eye v-if="!showPassword" :size="20" />
              <!-- EyeOff icon (hide) -->
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <!-- Error message for password -->
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Remember Me et Forgot Password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <span class="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button 
            type="button"
            @click="goToForgotPassword"
            class="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Forgot password?
          </button>
        </div>

        <!-- General error message -->
        <div v-if="errors.general" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>

        <!-- Login button -->
        <button
          type="submit"
          :disabled="isLoading"
          :class="[
            'w-full py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl',
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          ]"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>

        <!-- Séparateur OR -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <!-- Bouton Google Sign In -->
        <button
          type="button"
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm hover:shadow"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </form>

      <!-- 2FA Modal -->
      <div v-if="show2FAModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4">
              <Mail :size="32" color="white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
            <p class="text-gray-600">We sent a 6-digit code to {{ email }}</p>
          </div>

          <form @submit.prevent="handleTwoFAVerification" class="space-y-6">
            <div>
              <label for="twoFACode" class="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="twoFACode"
                v-model="twoFACode"
                type="text"
                maxlength="6"
                @input="twoFACode = twoFACode.replace(/\D/g, '')"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition text-center text-2xl font-mono tracking-widest',
                  errors.twoFACode 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500'
                ]"
                placeholder="123456"
                required
              />
              <p v-if="errors.twoFACode" class="mt-1 text-sm text-red-600">
                {{ errors.twoFACode }}
              </p>
            </div>

            <button
              type="submit"
              :disabled="isVerifying2FA || twoFACode.length !== 6"
              :class="[
                'w-full py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl',
                isVerifying2FA || twoFACode.length !== 6
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              ]"
            >
              <span v-if="isVerifying2FA" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
              <span v-else>Verify Code</span>
            </button>

            <button
              type="button"
              @click="cancel2FA"
              class="w-full text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>

      <!-- Lien Sign Up -->
      <p class="text-center text-sm text-gray-600 mt-6">
        Don't have an account?
        <router-link to="/signup" class="text-indigo-600 font-medium hover:text-indigo-700">
          Sign up
        </router-link>
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-vue-next';
import { authAPI } from '@/services/api';

// Router
const router = useRouter();

// Définition de l'event émis vers le composant parent
const emit = defineEmits(['login']);

// Reactive state of the component
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errors = ref({});
const isLoading = ref(false);

// 2FA state
const show2FAModal = ref(false);
const twoFACode = ref('');
const isVerifying2FA = ref(false);

/**
 * Validate user input data
 * Returns an object with validation errors
 */
const validateForm = () => {
  const validationErrors = {};

  // Email validation
  if (!email.value.trim()) {
    validationErrors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      validationErrors.email = 'Please enter a valid email address';
    }
  }

  // Password validation
  if (!password.value) {
    validationErrors.password = 'Password is required';
  } else if (password.value.length < 8) {
    validationErrors.password = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password.value)) {
    validationErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)';
  }

  return validationErrors;
};

/**
 * Clear validation errors for a specific field
 */
const clearFieldError = (fieldName) => {
  if (errors.value[fieldName]) {
    delete errors.value[fieldName];
  }
};

/**
 * Handle form submission
 * Validates fields and emits 'login' event to parent
 */
const handleSubmit = async () => {
  // Clear previous errors
  errors.value = {};
  
  // Validate form data
  const validationErrors = validateForm();
  
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  try {
    isLoading.value = true;
    
    // Step 1: Send credentials to backend using API service
    const data = await authAPI.login(email.value.trim(), password.value);

    // Step 1 successful - show 2FA modal
    show2FAModal.value = true;
    
  } catch (error) {
    console.error('Login error:', error);
    errors.value.general = error.message || 'An error occurred during login. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handle 2FA verification - Step 2: Verify code and get tokens
 */
const handleTwoFAVerification = async () => {
  if (twoFACode.value.length !== 6) {
    errors.value.twoFACode = 'Please enter a 6-digit code';
    return;
  }

  try {
    isVerifying2FA.value = true;
    errors.value.twoFACode = '';

    // Step 2: Verify 2FA code using API service
    const data = await authAPI.verify2FA(email.value.trim(), twoFACode.value);

    // Success! Store tokens and redirect
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    // Emit success event
    emit('login', {
      email: email.value.trim(),
      user: data.user,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
      }
    });

    // Close modal and redirect
    show2FAModal.value = false;
    router.push('/dashboard');
    
  } catch (error) {
    console.error('2FA verification error:', error);
    errors.value.twoFACode = error.message || 'Invalid verification code';
  } finally {
    isVerifying2FA.value = false;
  }
};

/**
 * Cancel 2FA process
 */
const cancel2FA = () => {
  show2FAModal.value = false;
  twoFACode.value = '';
  errors.value.twoFACode = '';
};

/**
 * Navigate to forgot password page
 */
const goToForgotPassword = () => {
  router.push('/forgot-password');
};

/**
 * Fonction de gestion de la connexion Google
 * Utilise Google Identity Services (GIS) pour obtenir un access_token via popup
 * puis envoie ce token au backend via authAPI.googleLogin
 */
import { getGoogleAccessToken } from '@/services/google';

const handleGoogleLogin = async () => {
  try {
    isLoading.value = true;
    // Request an access token from Google (opens a popup)
    const googleAccessToken = await getGoogleAccessToken({ prompt: 'consent' });

    // Send the Google access token to the backend
    const data = await authAPI.googleLogin(googleAccessToken);

    // Success: store tokens and emit login event
    if (data.access_token) localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);

    emit('login', {
      user: data.user,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      },
    });

    router.push('/dashboard');
  } catch (error) {
    console.error('Google login error:', error);
    errors.value.general = error.message || 'Google login failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Pas de styles supplémentaires nécessaires, tout est géré par Tailwind CSS */
</style>