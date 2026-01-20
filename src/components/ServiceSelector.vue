<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <template v-else>
      <!-- Connected Services -->
      <div v-if="connectedServices.length > 0">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Connected Services
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          <button
            v-for="service in connectedServices"
            :key="service.name"
            @click="handleServiceClick(service)"
            class="group relative flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-40 overflow-hidden"
          >
            <!-- Background decoration -->
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative z-10 flex flex-col items-center">
              <div class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                <span class="text-2xl font-bold text-indigo-700">{{ service.display_name.charAt(0) }}</span>
              </div>
              <span class="font-semibold text-slate-900 text-sm text-center">{{ service.display_name }}</span>
              <span class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 border border-green-100">
                ACTIVE
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Not Connected Services -->
      <div v-if="notConnectedServices.length > 0">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          Available Services
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          <button
            v-for="service in notConnectedServices"
            :key="service.name"
            @click="handleServiceClick(service)"
            class="group relative flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 h-40 opacity-80 hover:opacity-100"
          >
            <div class="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center mb-3 group-hover:bg-slate-300 transition-colors">
              <span class="text-2xl font-bold text-slate-600">{{ service.display_name.charAt(0) }}</span>
            </div>
            <span class="font-medium text-slate-600 text-sm group-hover:text-slate-900 text-center">{{ service.display_name }}</span>
            <span class="text-[10px] font-medium text-slate-400 mt-2 group-hover:text-indigo-500 transition-colors">Click to connect</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="connectedServices.length === 0 && notConnectedServices.length === 0" class="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p>No services available.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  type: {
    type: String,
    required: true, // 'action' or 'reaction'
    validator: (value) => ['action', 'reaction'].includes(value)
  },
  services: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

// Filter services based on type (action or reaction) and connection status
const connectedServices = computed(() => {
  return props.services.filter(service => {
    // Use is_connected property from backend
    const isConnected = service.is_connected === true;
    
    // Has actions or reactions depending on type
    const hasCapability = props.type === 'action' 
      ? service.actions && service.actions.length > 0
      : service.reactions && service.reactions.length > 0;
    
    return isConnected && hasCapability;
  });
});

const notConnectedServices = computed(() => {
  return props.services.filter(service => {
    // Not connected = is_connected is false AND requires OAuth
    const isNotConnected = service.is_connected === false && service.requires_oauth === true;
    
    // Has actions or reactions depending on type
    const hasCapability = props.type === 'action' 
      ? service.actions && service.actions.length > 0
      : service.reactions && service.reactions.length > 0;
    
    return isNotConnected && hasCapability;
  });
});

/**
 * Handle service click
 * - If service is not connected, save state and redirect to OAuth
 * - If service is connected, emit select event
 */
const handleServiceClick = (service) => {
  if (!service.is_connected && service.requires_oauth) {
    // Service not connected - save current state and redirect to OAuth page
    localStorage.setItem('oauth_return_to', 'dashboard_create');
    router.push('/oauth');
  } else {
    // Service connected - select it
    emit('select', service);
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
