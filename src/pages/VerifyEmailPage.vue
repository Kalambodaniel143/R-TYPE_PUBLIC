<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
      
      <!-- Loading State -->
      <div v-if="isLoading">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4 animate-pulse">
          <Mail :size="32" class="text-indigo-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
        <p class="text-gray-600">Please wait while we verify your account.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="isSuccess">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle :size="32" class="text-green-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
        <p class="text-gray-600 mb-6">
          Your account has been successfully activated. You can now log in.
        </p>
        <router-link 
          to="/login" 
          class="inline-block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-lg hover:shadow-xl"
        >
          Go to Login
        </router-link>
      </div>

      <!-- Error State -->
      <div v-else>
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <XCircle :size="32" class="text-red-600" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
        <p class="text-gray-600 mb-6">
          {{ errorMessage || 'The verification link is invalid or has expired.' }}
        </p>
        <router-link 
          to="/login" 
          class="text-indigo-600 font-medium hover:text-indigo-700"
        >
          Back to Login
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Mail, CheckCircle, XCircle } from 'lucide-vue-next';
import { authAPI } from '@/services/api';

const route = useRoute();
const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  const token = route.params.token;
  
  if (!token) {
    isLoading.value = false;
    errorMessage.value = 'No verification token provided.';
    return;
  }

  try {
    await authAPI.verifyEmail(token);
    isSuccess.value = true;
  } catch (error) {
    console.error('Verification error:', error);
    errorMessage.value = error.message || 'Verification failed.';
  } finally {
    isLoading.value = false;
  }
});
</script>
