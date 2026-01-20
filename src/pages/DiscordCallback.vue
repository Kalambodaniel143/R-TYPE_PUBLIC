<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <div v-if="loading" class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div v-else-if="success" class="text-green-600 mb-4">
            <CheckCircle class="h-12 w-12 mx-auto" />
          </div>
          <div v-else class="text-red-600 mb-4">
            <XCircle class="h-12 w-12 mx-auto" />
          </div>
          
          <h2 class="text-lg font-medium text-gray-900">
            {{ loading ? 'Connecting Discord...' : success ? 'Discord Connected!' : 'Connection Failed' }}
          </h2>
          
          <p v-if="error" class="mt-2 text-sm text-red-600">
            {{ error }}
          </p>
          
          <p v-else-if="success" class="mt-2 text-sm text-gray-600">
            Your Discord account has been successfully connected.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CheckCircle, XCircle } from 'lucide-vue-next';
import { oauthAPI } from '@/services/api';

const loading = ref(true);
const success = ref(false);
const error = ref('');

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      error.value = `Discord OAuth error: ${errorParam}`;
      loading.value = false;
      return;
    }

    if (!code) {
      error.value = 'No authorization code received from Discord';
      loading.value = false;
      return;
    }

    // Verify state to prevent CSRF attacks
    const storedState = sessionStorage.getItem('discord_oauth_state');
    if (state !== storedState) {
      error.value = 'Invalid state parameter';
      loading.value = false;
      return;
    }

    // Complete OAuth flow with backend
    await oauthAPI.completeOAuth('discord', code);
    
    // Mark as successful
    success.value = true;
    sessionStorage.setItem('oauth_success', 'true');
    
    // Close popup after a short delay
    setTimeout(() => {
      if (window.opener) {
        window.close();
      } else {
        // If not in popup, redirect to OAuth management page
        window.location.href = '/oauth';
      }
    }, 2000);
    
  } catch (err: any) {
    error.value = err.message || 'Failed to connect Discord account';
  } finally {
    loading.value = false;
    sessionStorage.removeItem('discord_oauth_state');
  }
});
</script>
