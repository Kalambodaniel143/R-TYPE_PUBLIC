<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-xl mb-4">
          <Mail :size="32" color="white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p class="text-gray-600">Enter your email to reset your password</p>
      </div>

      <!-- Success Message -->
      <div v-if="emailSent" class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
        <div class="flex items-center">
          <CheckCircle class="w-5 h-5 text-green-500 mr-3" />
          <p class="text-sm text-green-700">
            Reset email sent successfully! Check your inbox and follow the instructions.
          </p>
        </div>
      </div>

      <!-- Form -->
      <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              v-model="email"
              type="email"
              @input="clearError"
              :class="[
                'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition',
                error 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500'
              ]"
              placeholder="Enter your email address"
              required
            />
          </div>
          <!-- Error message -->
          <p v-if="error" class="mt-1 text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <!-- Submit Button -->
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
            Sending...
          </span>
          <span v-else>Reset Password</span>
        </button>

      </form>

      <!-- Back to Login -->
      <div class="mt-6 text-center">
        <button
          @click="goBackToLogin"
          class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-vue-next';
import { authAPI } from '@/services/api';

// Router
const router = useRouter();

// Reactive state
const email = ref('');
const error = ref('');
const isLoading = ref(false);
const emailSent = ref(false);

/**
 * Validate email format
 */
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.value.trim()) {
    return 'Email address is required';
  }
  
  if (!emailRegex.test(email.value.trim())) {
    return 'Please enter a valid email address';
  }
  
  return '';
};

/**
 * Clear error when user types
 */
const clearError = () => {
  if (error.value) {
    error.value = '';
  }
};

/**
 * Send forgot password request to backend
 */
const sendForgotPasswordRequest = async (emailAddress) => {
  try {
    const data = await authAPI.forgotPassword(emailAddress);

    return { success: true, data };
  } catch (err) {
    console.error('Forgot password error:', err);
    throw new Error(err.message || 'Network error occurred');
  }
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  // Clear previous error
  error.value = '';
  
  // Validate email
  const validationError = validateEmail();
  if (validationError) {
    error.value = validationError;
    return;
  }

  try {
    isLoading.value = true;
    
    // Send request to backend
    await sendForgotPasswordRequest(email.value.trim());
    
    // Show success message
    emailSent.value = true;
    
  } catch (err) {
    error.value = err.message || 'Failed to send reset email. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Navigate back to login page
 */
const goBackToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* Tailwind CSS handles all styling */
</style>