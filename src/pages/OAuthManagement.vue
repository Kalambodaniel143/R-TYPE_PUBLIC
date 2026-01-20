<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Service Authentication</h1>
        <p class="text-gray-600 text-base">Manage your connections to external services</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span class="ml-3 text-gray-600">Loading services...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <AlertCircle class="w-5 h-5 text-red-600 mr-2" />
          <span class="text-red-800">{{ error }}</span>
        </div>
      </div>

      <!-- Services List -->
      <div v-else class="space-y-6">
        <!-- OAuth Required Services -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <Lock class="w-5 h-5 text-indigo-600 mr-2" />
            OAuth Authentication Required
          </h2>
          <div class="space-y-2">
            <ServiceOAuthCard
              v-for="service in oauthServices"
              :key="service.name"
              :service="service"
            />
          </div>
        </div>

        <!-- No Auth Services -->
        <div v-if="noAuthServices.length > 0">
          <h2 class="text-xl font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle class="w-5 h-5 text-green-600 mr-2" />
            Ready to Use
          </h2>
          <div class="space-y-2">
            <ServiceOAuthCard
              v-for="service in noAuthServices"
              :key="service.name"
              :service="service"
            />
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <!-- <div v-if="services.length > 0" class="mt-12 bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">Connection Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-600">{{ services.length }}</div>
            <div class="text-gray-600">Total Services</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{{ oauthServices.length }}</div>
            <div class="text-gray-600">OAuth Services</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{{ noAuthServices.length }}</div>
            <div class="text-gray-600">Ready Services</div>
          </div>
        </div>
      </div> -->

      <!-- Navigation -->
      <!-- <div class="mt-8 flex justify-center space-x-4">
        <router-link
          to="/dashboard"
          class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft class="w-4 h-4 mr-2" />
          Back to Dashboard
        </router-link>
        <router-link
          to="/services"
          class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <List class="w-4 h-4 mr-2" />
          View Services
        </router-link>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AlertCircle, Lock, CheckCircle, ArrowLeft, List } from 'lucide-vue-next';
import { areasAPI } from '@/services/api';
import ServiceOAuthCard from '@/components/ServiceOAuthCard.vue';
import type { Service, AboutResponse } from '@/types/areas';

// Reactive state
const services = ref<Service[]>([]);
const isLoading = ref(true);
const error = ref('');

// Computed properties
const oauthServices = computed(() => {
  return services.value.filter(service => service.requires_oauth);
});

const noAuthServices = computed(() => {
  return services.value.filter(service => !service.requires_oauth);
});

// const FAKE_ABOUT_DATA: AboutResponse = {
//   client: { host: 'localhost' },
//   server: {
//     current_time: Date.now(),
//     services: [
//       {
//         name: 'google',
//         display_name: 'Google Mail',
//         requires_oauth: true,
//         oauth_config: {
//           scopes: [
//             'https://www.googleapis.com/auth/userinfo.email',
//             'https://www.googleapis.com/auth/userinfo.profile',
//             'https://www.googleapis.com/auth/gmail.readonly',
//             'https://www.googleapis.com/auth/gmail.send'
//           ],
//           auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
//           token_url: 'https://oauth2.googleapis.com/token'
//         },
//         actions: [
//           { name: 'new_email', description: 'New email received', params: [] }
//         ],
//         reactions: [
//           { name: 'send_email', description: 'Send an email', params: [{ name: 'to', type: 'string' }, { name: 'subject', type: 'string' }, { name: 'body', type: 'string' }] }
//         ]
//       },
//       {
//         name: 'github',
//         display_name: 'GitHub',
//         requires_oauth: true,
//         oauth_config: {
//           scopes: ['repo', 'user:email'],
//           auth_url: 'https://github.com/login/oauth/authorize',
//           token_url: 'https://github.com/login/oauth/access_token'
//         },
//         actions: [
//           { name: 'new_issue', description: 'New issue created', params: [] },
//           { name: 'new_pr', description: 'New pull request', params: [] }
//         ],
//         reactions: [
//           { name: 'create_issue', description: 'Create an issue', params: [{ name: 'title', type: 'string' }, { name: 'body', type: 'string' }] }
//         ]
//       },
//       {
//         name: 'timer',
//         display_name: 'Timer',
//         requires_oauth: false,
//         oauth_config: {},
//         actions: [
//           { name: 'interval', description: 'Trigger at interval', params: [{ name: 'interval_seconds', type: 'integer' }] }
//         ],
//         reactions: []
//       },
//       {
//         name: 'openweather',
//         display_name: 'OpenWeather',
//         requires_oauth: false,
//         oauth_config: {},
//         actions: [
//           { name: 'weather_change', description: 'Weather condition changes', params: [{ name: 'city', type: 'string' }] }
//         ],
//         reactions: []
//       }
//     ]
//   }
// };

// Load services
const loadServices = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    
    //when backend is ready
    const data: AboutResponse = await areasAPI.about();
    if (data && data.server && data.server.services) {
      services.value = data.server.services;
    } else {
      throw new Error('Invalid data format');
    }
    
    // MOCK DATA - Remove when backend is ready
    // console.log('[MOCK] Using fake about data for preview');
    // services.value = FAKE_ABOUT_DATA.server.services;
    
  } catch (err) {
    console.error('Error loading services:', err);
    error.value = (err as Error).message || 'Failed to load services';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadServices();
});
</script>