<template>
  <div class="bg-white rounded-lg shadow-sm border p-3 max-w-2xl">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0">
          <component 
            :is="getServiceIcon(service.name)" 
            class="w-6 h-6"
            :class="getServiceColor(service.name)"
          />
        </div>
        <div>
          <h3 class="text-base font-medium text-gray-900">{{ service.display_name }}</h3>
          <p class="text-xs text-gray-500">
            {{ service.requires_oauth ? 'OAuth Required' : 'No Authentication Required' }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Connection Status -->
        <div class="flex items-center space-x-1.5">
          <div 
            class="w-2 h-2 rounded-full"
            :class="connectionStatus.connected ? 'bg-green-500' : 'bg-gray-300'"
          ></div>
          <span class="text-xs font-medium" :class="connectionStatus.connected ? 'text-green-700' : 'text-gray-500'">
            {{ connectionStatus.connected ? 'Connected' : 'Not Connected' }}
          </span>
        </div>

        <!-- Action Button -->
        <button
          v-if="service.requires_oauth"
          @click="handleOAuthAction"
          :disabled="isLoading"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors"
          :class="connectionStatus.connected 
            ? 'text-red-700 bg-red-100 hover:bg-red-200' 
            : 'text-white bg-indigo-600 hover:bg-indigo-700'"
        >
          <Loader2 v-if="isLoading" class="w-3 h-3 mr-1.5 animate-spin" />
          <template v-else>
            <template v-if="connectionStatus.connected">
              <Unlink class="w-3 h-3 mr-1.5" />
              Disconnect
            </template>
            <template v-else>
              <Link class="w-3 h-3 mr-1.5" />
              Connect
            </template>
          </template>
        </button>

        <!-- No Auth Indicator -->
        <span
          v-else
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          <CheckCircle class="w-3 h-3 mr-1" />
          Ready
        </span>
      </div>
    </div>

    <!-- OAuth Details for connected services -->
    <div v-if="service.requires_oauth && connectionStatus.connected && connectionStatus.details" class="mt-3 p-2 bg-gray-50 rounded-md">
      <div class="flex items-center justify-between text-xs">
        <span class="text-gray-600">Connected as:</span>
        <span class="font-medium text-gray-900">{{ connectionStatus.details.name}}</span>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <AlertCircle class="w-4 h-4 text-red-400 mr-1.5 flex-shrink-0" />
        <span class="text-red-800 text-xs">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  Link, 
  Unlink, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Clock,
  Github,
  Mail,
  MessageCircle,
  TrendingUp,
  Cloud
} from 'lucide-vue-next'; 
import { oauthAPI } from '@/services/api';
import { startOAuthFlow, getOAuthConnectionStatus, disconnectOAuthService } from '@/services/oauth';
import type { Service } from '@/types/areas';

// Props
interface Props {
  service: Service;
}
const props = defineProps<Props>();

// Reactive state
const isLoading = ref(false);
const error = ref('');
const connectionStatus = ref({
  connected: false,
  details: null as any
});

// Service icon mapping
const getServiceIcon = (serviceName: string) => {
  const iconMap: Record<string, any> = {
    'timer': Clock,
    'github': Github,
    'google': Mail,
    'discord': MessageCircle,
    'coingecko': TrendingUp,
    'openweather': Cloud
  };
  return iconMap[serviceName] || CheckCircle;
};

// Service color mapping
const getServiceColor = (serviceName: string) => {
  const colorMap: Record<string, string> = {
    'timer': 'text-blue-600',
    'github': 'text-gray-900',
    'google': 'text-gray-900',
    'discord': 'text-indigo-600',
    'coingecko': 'text-yellow-600',
    'openweather': 'text-sky-600'
  };
  return colorMap[serviceName] || 'text-gray-600';
};

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Load connection status
const loadConnectionStatus = async () => {
  if (!props.service.requires_oauth) {
    connectionStatus.value = { connected: true, details: null };
    return;
  }

  // Check if service is already active (user already authenticated)
  if (props.service.is_active === true) {
    connectionStatus.value = { connected: true, details: null };
    return;
  }

  try {
    // When backend OAuth status endpoint is ready
    // Get all services connection status
    const allServicesStatus = await getOAuthConnectionStatus();
    
    // Extract the status for this specific service
    const serviceStatus = allServicesStatus[props.service.name];
    
    // Update connection status for this service
    if (serviceStatus) {
      connectionStatus.value = {
        connected: serviceStatus.connected,
        details: serviceStatus.details
      };
    } else {
      // Service not found in status response
      connectionStatus.value = { connected: false, details: null };
    }
    
    // test case
    // const allServicesStatus = await getOAuthConnectionStatus();
    // const serviceStatus = allServicesStatus[props.service.name];
    // connectionStatus.value = serviceStatus || { connected: false, details: null };
  } catch (err) {
    console.warn(`Failed to load connection status for ${props.service.name}:`, err);
    connectionStatus.value = { connected: false, details: null };
  }
};

// Handle OAuth connect/disconnect
const handleOAuthAction = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  error.value = '';

  try {
    if (connectionStatus.value.connected) {
      // Disconnect service
      const result = await disconnectOAuthService(props.service.name);
      if (result.success) {
        connectionStatus.value = { connected: false, details: null };
      } else {
        error.value = result.error || 'Failed to disconnect service';
      }
    } else {
      // Start OAuth flow
      const result = await startOAuthFlow(props.service.name);
      if (result.success) {
        // Reload connection status after successful OAuth
        await loadConnectionStatus();
        
        // Check if we should redirect back to Dashboard
        const returnTo = localStorage.getItem('oauth_return_to');
        if (returnTo === 'dashboard_create') {
          // Redirect to dashboard
          window.location.href = '/dashboard';
        }
      } else {
        error.value = result.error || 'OAuth connection failed';
      }
    }
  } catch (err: any) {
    console.warn('OAuth operation error (may be backend unavailable):', err);
    error.value = err.message || 'OAuth operation failed - backend may be unavailable';
  } finally {
    isLoading.value = false;
  }
};

// Load status on mount
onMounted(() => {
  loadConnectionStatus();
});
</script>