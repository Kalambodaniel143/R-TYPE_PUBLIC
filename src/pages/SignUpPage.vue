<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      
      <!-- Logo et titre -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4">
          <Zap :size="32" color="white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-600">Join AREA to automate your workflow</p>
      </div>

      <!-- Success Message -->
      <div v-if="isSuccess" class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle :size="32" class="text-green-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <p class="text-gray-600 mb-6">
          We've sent a verification email to <strong>{{ email }}</strong>.<br>
          Please check your inbox and click the link to activate your account.
        </p>
        <router-link 
          to="/login" 
          class="inline-block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-lg hover:shadow-xl"
        >
          Go to Login
        </router-link>
      </div>

      <!-- Formulaire d'inscription -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">

        <!-- First Name Field -->
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              @input="clearFieldError('firstName')"
              :class="[
                'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                errors.firstName 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500'
              ]"
              placeholder="John"
            />
          </div>
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name Field -->
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              @input="clearFieldError('lastName')"
              :class="[
                'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                errors.lastName 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500'
              ]"
              placeholder="Doe"
            />
          </div>
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div class="relative">
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
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              @input="clearFieldError('confirmPassword')"
              :class="[
                'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                errors.confirmPassword 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500'
              ]"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!showConfirmPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- General error message -->
        <div v-if="errors.general" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ errors.general }}</p>
        </div>

        <!-- Sign Up button -->
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
            Creating account...
          </span>
          <span v-else>Sign Up</span>
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

        <!-- Bouton Google Sign Up -->
        <button
          type="button"
          @click="handleGoogleSignup"
          class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm hover:shadow"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>
      </form>

      <!-- Lien Sign In -->
      <p class="text-center text-sm text-gray-600 mt-6">
        Already have an account?
        <router-link to="/login" class="text-indigo-600 font-medium hover:text-indigo-700">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Mail, Lock, Eye, EyeOff, Zap, CheckCircle } from 'lucide-vue-next';
import { googleTokenLogin } from 'vue3-google-login';
import { authAPI } from '@/services/api';

const router = useRouter();

// Reactive state
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errors = ref({});
const isLoading = ref(false);
const isSuccess = ref(false);

const validateForm = () => {
  const validationErrors = {};

  if (!firstName.value.trim()) {
    validationErrors.firstName = 'First name is required';
  }

  if (!lastName.value.trim()) {
    validationErrors.lastName = 'Last name is required';
  }

  if (!email.value.trim()) {
    validationErrors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      validationErrors.email = 'Please enter a valid email address';
    }
  }

  if (!password.value) {
    validationErrors.password = 'Password is required';
  } else if (password.value.length < 8) {
    validationErrors.password = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password.value)) {
    validationErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }

  if (password.value !== confirmPassword.value) {
    validationErrors.confirmPassword = 'Passwords do not match';
  }

  return validationErrors;
};

const clearFieldError = (fieldName) => {
  if (errors.value[fieldName]) {
    delete errors.value[fieldName];
  }
};

const handleSubmit = async () => {
  errors.value = {};
  const validationErrors = validateForm();
  
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  try {
    isLoading.value = true;
    
    // Call API to register
    await authAPI.register({
      email: email.value.trim(),
      password: password.value,
      password_confirm: confirmPassword.value,
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim()
    });
    
    // Show success message
    isSuccess.value = true;
    
  } catch (error) {
    console.error('Registration error:', error);
    errors.value.general = error.message || 'An error occurred during registration. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handle Google Signup
 */
const handleGoogleSignup = () => {
  googleTokenLogin().then(async (response) => {
    try {
      isLoading.value = true;
      // Call backend with Google token
      const data = await authAPI.googleLogin(response.access_token);
      
      // Store tokens (if backend returns them directly for Google login)
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Google Signup Backend Error", error);
      errors.value.general = 'Google signup failed on server. Please try again.';
    } finally {
      isLoading.value = false;
    }
  }).catch((error) => {
    console.error("Handle Google Signup Error", error)
    errors.value.general = 'Google signup failed. Please try again.';
  })
};

</script>
