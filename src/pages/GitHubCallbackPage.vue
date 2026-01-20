<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <div v-if="status === 'processing'" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 class="text-xl font-semibold text-gray-900">Connexion GitHub en cours...</h2>
          <p class="text-sm text-gray-600">Veuillez patienter</p>
        </div>

        <div v-else-if="status === 'success'" class="space-y-4">
          <div class="text-green-600">
            <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Connexion réussie !</h2>
          <p class="text-sm text-gray-600">Vous pouvez fermer cette fenêtre</p>
        </div>

        <div v-else-if="status === 'error'" class="space-y-4">
          <div class="text-red-600">
            <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">Erreur de connexion</h2>
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
          <button 
            @click="closeWindow"
            class="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { oauthAPI } from '@/services/api';

const route = useRoute();
const status = ref<'processing' | 'success' | 'error'>('processing');
const errorMessage = ref('');

onMounted(async () => {
  try {
    // Get code and state from URL
    const code = route.query.code as string;
    const state = route.query.state as string;
    const error = route.query.error as string;

    // Check for errors
    if (error) {
      status.value = 'error';
      errorMessage.value = `GitHub OAuth error: ${error}`;
      notifyParent(false);
      return;
    }

    if (!code) {
      status.value = 'error';
      errorMessage.value = 'No authorization code received';
      notifyParent(false);
      return;
    }

    // Verify state to prevent CSRF
    const savedState = sessionStorage.getItem('github_oauth_state');
    if (state !== savedState) {
      status.value = 'error';
      errorMessage.value = 'Invalid state parameter';
      notifyParent(false);
      return;
    }

    // Send code to backend
    const result = await oauthAPI.completeOAuth('github', code);

    if (result.success) {
      status.value = 'success';
      notifyParent(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        closeWindow();
      }, 2000);
    } else {
      status.value = 'error';
      errorMessage.value = result.error || 'Failed to complete OAuth';
      notifyParent(false);
    }
  } catch (error: any) {
    status.value = 'error';
    errorMessage.value = error.message || 'An error occurred';
    notifyParent(false);
  } finally {
    // Clean up
    sessionStorage.removeItem('github_oauth_state');
  }
});

function notifyParent(success: boolean) {
  // Notify the opener window
  if (window.opener) {
    sessionStorage.setItem('oauth_success', success.toString());
  }
}

function closeWindow() {
  if (window.opener) {
    window.close();
  }
}
</script>
