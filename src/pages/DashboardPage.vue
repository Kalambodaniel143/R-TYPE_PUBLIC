<template>
  <div class="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
    <!-- Navigation (Glass Effect) -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <div class="flex items-center cursor-pointer group" @click="resetView">
            <div class="relative">
              <div class="absolute inset-0 bg-indigo-500 blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-lg"></div>
              <div class="relative inline-flex items-center justify-center w-20 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl mr-3 shadow-lg shadow-indigo-200">
                <!-- <Zap :size="20" color="white" /> -->
                <span class="text-xl font-bold text-white">AREA</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-6">
            <button 
              v-if="!isCreating"
              @click="startCreation"
              class="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus :size="18" class="mr-2 transition-transform group-hover:rotate-90" />
              Create Area
            </button>
            <button 
              v-else
              @click="cancelCreation"
              class="text-slate-500 hover:text-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            
            <div class="h-8 w-px bg-slate-200"></div>
            
            <button @click="logout" class="text-slate-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      <!-- Dashboard View (List of Areas) -->
      <div v-if="!isCreating" class="space-y-8 animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">My Areas</h1>
            <p class="text-slate-500 mt-2">Manage your automated workflows</p>
          </div>
        </div>
        
        <!-- Areas List -->
        <div v-if="isLoadingAreas" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <div v-else-if="userAreas.length === 0" class="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex flex-col items-center">
            <h3 class="text-xl font-semibold text-slate-900 mb-2">No Areas configured yet</h3>
            <p class="text-slate-500 max-w-md mx-auto mb-8">Start automating your tasks by connecting your favorite services together.</p>
            <button @click="startCreation" class="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-2 transition-all hover:gap-3">
              Create your first automation <ArrowRight :size="18" />
            </button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <template v-for="area in userAreas" :key="area?.id || Math.random()">
            <div 
              v-if="area"
              class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-bold text-slate-900">{{ area.name }}</h3>
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                    :class="area.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ area.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <p v-if="area.description" class="text-slate-600 mb-4">{{ area.description }}</p>
                
                <div class="flex items-center gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-xs font-bold text-blue-700">IF</span>
                    </div>
                    <span class="text-slate-600">{{ area.service_action || area.action_name || 'Action' }}</span>
                  </div>
                  <ArrowRight :size="16" class="text-slate-400" />
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span class="text-xs font-bold text-purple-700">THEN</span>
                    </div>
                    <span class="text-slate-600">{{ area.service_reaction || area.reaction_name || 'Reaction' }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="toggleAreaStatus(area)"
                  :title="area.is_active ? 'Pause' : 'Run'"
                  class="p-2 rounded-lg transition-colors"
                  :class="area.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'"
                >
                  <component :is="area.is_active ? 'Pause' : 'Play'" :size="20" />
                </button>
                <button
                  @click="editArea(area)"
                  title="Edit"
                  class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit :size="20" />
                </button>
                <button
                  @click="confirmDeleteArea(area)"
                  title="Delete"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 :size="20" />
                </button>
              </div>
            </div>

            <div v-if="area.last_triggered" class="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              Last triggered: {{ formatDate(area.last_triggered) }}
            </div>
          </div>
          </template>
        </div>
      </div>

      <!-- Create Area View (Timeline Style) -->
      <div v-else class="animate-fade-in pb-20">
        <!-- Header -->
        <div class="flex items-center justify-between mb-12 sticky top-24 z-40 bg-slate-50/95 backdrop-blur py-4 border-b border-slate-200/50">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">New Automation</h1>
            <p class="text-slate-500 mt-1">Configure your trigger and reactions</p>
          </div>
          <button 
            @click="saveArea"
            :disabled="!canSaveArea || isSaving"
            class="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle v-if="!isSaving" :size="18" />
            <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isSaving ? 'Saving...' : 'Save Area' }}
          </button>
        </div>

        <!-- Area Name & Description -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Area Name *</label>
              <input 
                v-model="areaConfig.name"
                type="text" 
                placeholder="e.g., Github to Discord notifier"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Description (optional)</label>
              <textarea 
                v-model="areaConfig.description"
                placeholder="Describe what this automation does..."
                rows="2"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="relative space-y-16">
          <!-- Vertical Connecting Line -->
          <div class="absolute left-[2.25rem] top-8 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent -z-10"></div>

          <!-- IF THIS (Action) -->
          <section class="relative pl-24 group">
            <!-- Floating Badge -->
            <div class="absolute left-0 top-0 w-18 h-18">
              <div class="w-18 h-18 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-slate-50 z-10 transition-transform group-hover:scale-105 duration-300">
                <span class="text-xs font-bold opacity-80 tracking-wider">IF</span>
                <span class="text-xl font-bold">THIS</span>
              </div>
            </div>
            
            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <!-- Header Card -->
              <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                  Trigger Event
                </h2>
                <button 
                  v-if="areaConfig.action.service" 
                  @click="resetAction"
                  class="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
                >
                  Change Service
                </button>
              </div>

              <div class="p-8">
                <!-- Step 1: Select Service -->
                <div v-if="!areaConfig.action.service">
                  <ServiceSelector 
                    type="action"
                    :services="services"
                    :is-loading="isLoadingServices"
                    @select="selectActionService" 
                  />
                </div>

                <!-- Step 2: Select Action Trigger -->
                <div v-else-if="!areaConfig.action.trigger" class="animate-slide-up">
                  <div class="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-transparent rounded-2xl border border-blue-100">
                    <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                      <span class="text-2xl font-bold text-blue-600">{{ areaConfig.action.service.display_name.charAt(0) }}</span>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-slate-900">{{ areaConfig.action.service.display_name }}</h3>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="flex h-2 w-2 relative">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span class="text-sm font-medium text-slate-600">Connected</span>
                      </div>
                    </div>
                  </div>

                  <h3 class="text-lg font-semibold text-slate-800 mb-4">Choose a trigger</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      v-for="trigger in areaConfig.action.service.actions" 
                      :key="trigger.id"
                      @click="selectActionTrigger(trigger)"
                      class="text-left p-5 border border-slate-200 rounded-xl hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:bg-blue-50/30 transition-all group bg-white"
                    >
                      <div class="font-semibold text-slate-900 group-hover:text-blue-700">{{ trigger.name }}</div>
                      <div class="text-sm text-slate-500 mt-1 group-hover:text-slate-600">{{ trigger.description }}</div>
                    </button>
                  </div>
                </div>

                <!-- Step 3: Configure Action -->
                <div v-else class="animate-slide-up">
                  <div class="flex items-start gap-6">
                    <div class="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span class="text-xl font-bold text-blue-600">{{ areaConfig.action.service.display_name.charAt(0) }}</span>
                    </div>
                    <div class="flex-grow">
                      <h3 class="text-xl font-bold text-slate-900">{{ areaConfig.action.trigger.name }}</h3>
                      <p class="text-slate-500 mb-6">{{ areaConfig.action.trigger.description }}</p>
                      
                      <!-- Configuration Form -->
                      <ConfigForm 
                        :config-schema="areaConfig.action.trigger.config_schema || {}"
                        v-model="areaConfig.action.config"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- THEN THAT (Reactions) -->
          <section class="space-y-12">
            <div 
              v-for="(reactionItem, index) in areaConfig.reactions" 
              :key="reactionItem.id"
              class="relative pl-24 group"
            >
              <!-- Floating Badge -->
              <div class="absolute left-0 top-0 w-18 h-18">
                <div class="w-18 h-18 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex flex-col items-center justify-center shadow-lg shadow-purple-200 ring-4 ring-slate-50 z-10 transition-transform group-hover:scale-105 duration-300">
                  <span class="text-xs font-bold opacity-80 tracking-wider">THEN</span>
                  <span class="text-xl font-bold">THAT</span>
                </div>
              </div>

              <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300">
                <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                    Reaction #{{ index + 1 }}
                  </h2>
                  <div class="flex items-center gap-3">
                    <button 
                      v-if="reactionItem.service" 
                      @click="resetReaction(index)"
                      class="text-sm font-medium text-slate-400 hover:text-purple-600 transition-colors px-3 py-1 rounded-lg hover:bg-purple-50"
                    >
                      Change
                    </button>
                    <button 
                      v-if="areaConfig.reactions.length > 1"
                      @click="removeReaction(index)"
                      class="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove reaction"
                    >
                      <Trash2 :size="18" />
                    </button>
                  </div>
                </div>

                <div class="p-8">
                  <!-- Step 1: Select Service -->
                  <div v-if="!reactionItem.service">
                    <ServiceSelector 
                      type="reaction"
                      :services="services"
                      :is-loading="isLoadingServices"
                      @select="(service) => selectReactionService(index, service)" 
                    />
                  </div>

                  <!-- Step 2: Select Reaction -->
                  <div v-else-if="!reactionItem.reaction" class="animate-slide-up">
                    <div class="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-purple-50 to-transparent rounded-2xl border border-purple-100">
                      <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                        <span class="text-2xl font-bold text-purple-600">{{ reactionItem.service.display_name.charAt(0) }}</span>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-slate-900">{{ reactionItem.service.display_name }}</h3>
                        <div class="flex items-center gap-2 mt-1">
                          <span class="flex h-2 w-2 relative">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span class="text-sm font-medium text-slate-600">Connected</span>
                        </div>
                      </div>
                    </div>

                    <h3 class="text-lg font-semibold text-slate-800 mb-4">Choose an action</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        v-for="react in reactionItem.service.reactions" 
                        :key="react.id"
                        @click="selectReactionTrigger(index, react)"
                        class="text-left p-5 border border-slate-200 rounded-xl hover:border-purple-500 hover:ring-1 hover:ring-purple-500 hover:bg-purple-50/30 transition-all group bg-white"
                      >
                        <div class="font-semibold text-slate-900 group-hover:text-purple-700">{{ react.name }}</div>
                        <div class="text-sm text-slate-500 mt-1 group-hover:text-slate-600">{{ react.description }}</div>
                      </button>
                    </div>
                  </div>

                  <!-- Step 3: Configure Reaction -->
                  <div v-else class="animate-slide-up">
                    <div class="flex items-start gap-6">
                      <div class="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span class="text-xl font-bold text-purple-600">{{ reactionItem.service.display_name.charAt(0) }}</span>
                      </div>
                      <div class="flex-grow">
                        <h3 class="text-xl font-bold text-slate-900">{{ reactionItem.reaction.name }}</h3>
                        <p class="text-slate-500 mb-6">{{ reactionItem.reaction.description }}</p>
                        
                        <!-- Configuration Form -->
                        <ConfigForm 
                          :config-schema="reactionItem.reaction.config_schema || {}"
                          v-model="reactionItem.config"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Reaction Button -->
            <div class="pl-24 pt-4">
              <button 
                @click="addReaction"
                class="group flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 px-6 py-3 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
              >
                <div class="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <Plus :size="18" />
                </div>
                Add another reaction
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Zap, Plus, Trash2, ArrowRight, CheckCircle, Play, Pause, Edit } from 'lucide-vue-next';
import { areasAPI } from '@/services/api';

// Components
import ServiceSelector from '../components/ServiceSelector.vue';
import ConfigForm from '../components/ConfigForm.vue';

const router = useRouter();

// State
const isCreating = ref(false);
const services = ref([]);
const isLoadingServices = ref(true);
const userAreas = ref([]);
const isLoadingAreas = ref(true);
const isSaving = ref(false);
const editingAreaId = ref(null);

const areaConfig = reactive({
  name: '',
  description: '',
  action: {
    service: null,
    trigger: null,
    config: {}
  },
  reactions: [
    { id: Date.now(), service: null, reaction: null, config: {} }
  ]
});

// Computed
const canSaveArea = computed(() => {
  const hasAction = areaConfig.action.service && areaConfig.action.trigger;
  const hasValidReactions = areaConfig.reactions.some(
    r => r.service && r.reaction
  );
  return hasAction && hasValidReactions && areaConfig.name.trim().length > 0;
});

// Fetch services and areas
onMounted(async () => {
  try {
    const data = await areasAPI.about();
    services.value = data.server.services || [];
    
    // Check if returning from OAuth
    const returnTo = localStorage.getItem('oauth_return_to');
    if (returnTo === 'dashboard_create') {
      isCreating.value = true;
      localStorage.removeItem('oauth_return_to');
    }
  } catch (error) {
    console.error('Failed to load services:', error);
  } finally {
    isLoadingServices.value = false;
  }

  // Load user's areas
  await loadUserAreas();
});

// Load user areas
const loadUserAreas = async () => {
  isLoadingAreas.value = true;
  try {
    const response = await areasAPI.getUserAreas();
    
    // Handle paginated response
    const areas = response.results || response;
    userAreas.value = areas;
  } catch (error) {
    console.error('Failed to load areas:', error);
    userAreas.value = [];
  } finally {
    isLoadingAreas.value = false;
  }
};

// Actions
const startCreation = () => {
  isCreating.value = true;
  resetForm();
};

const cancelCreation = () => {
  if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
    isCreating.value = false;
    resetForm();
  }
};

const resetView = () => {
  if (isCreating.value) {
    cancelCreation();
  }
};

const resetForm = () => {
  areaConfig.name = '';
  areaConfig.description = '';
  areaConfig.action = { service: null, trigger: null, config: {} };
  areaConfig.reactions = [{ id: Date.now(), service: null, reaction: null, config: {} }];
  editingAreaId.value = null;
};

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  router.push('/login');
};

// Action Flow
const selectActionService = (service) => {
  areaConfig.action.service = service;
};

const selectActionTrigger = (trigger) => {
  areaConfig.action.trigger = trigger;
};

const resetAction = () => {
  areaConfig.action.service = null;
  areaConfig.action.trigger = null;
  areaConfig.action.config = {};
};

// Reaction Flow
const addReaction = () => {
  areaConfig.reactions.push({ 
    id: Date.now(), 
    service: null, 
    reaction: null, 
    config: {} 
  });
};

const removeReaction = (index) => {
  areaConfig.reactions.splice(index, 1);
};

const selectReactionService = (index, service) => {
  areaConfig.reactions[index].service = service;
};

const selectReactionTrigger = (index, reaction) => {
  areaConfig.reactions[index].reaction = reaction;
};

const resetReaction = (index) => {
  areaConfig.reactions[index].service = null;
  areaConfig.reactions[index].reaction = null;
  areaConfig.reactions[index].config = {};
};

// Save Area
const saveArea = async () => {
  if (!canSaveArea.value) return;

  isSaving.value = true;
  try {
    // Get first valid reaction
    const firstReaction = areaConfig.reactions.find(r => r.service && r.reaction);
    
    if (!firstReaction) {
      alert('Please configure at least one reaction');
      return;
    }

    // Check if IDs are present
    if (!areaConfig.action.trigger?.id || !firstReaction.reaction?.id) {
      alert('Action or Reaction ID missing. Please reload and try again.');
      return;
    }

    // Format according to backend API with numeric IDs
    const areaData = {
      name: areaConfig.name.trim(),
      description: areaConfig.description.trim() || undefined,
      action_id: areaConfig.action.trigger.id,          // Numeric ID of Action
      reaction_id: firstReaction.reaction.id,           // Numeric ID of Reaction
      action_config: areaConfig.action.config || {},
      reaction_config: firstReaction.config || {}
    };

    if (editingAreaId.value) {
      // Update existing area
      await areasAPI.updateArea(editingAreaId.value, areaData);
    } else {
      // Create new area
      await areasAPI.createArea(areaData);
    }

    // Reload areas and reset form
    await loadUserAreas();
    isCreating.value = false;
    resetForm();
  } catch (error) {
    console.error('Failed to save area:', error);
    alert('Failed to save area: ' + (error.message || 'Unknown error'));
  } finally {
    isSaving.value = false;
  }
};

// Toggle area active status
const toggleAreaStatus = async (area) => {
  try {
    await areasAPI.updateArea(area.id, {
      ...area,
      is_active: !area.is_active
    });
    await loadUserAreas();
  } catch (error) {
    console.error('Failed to toggle area status:', error);
    alert('Failed to update area status');
  }
};

// Edit area
const editArea = async (area) => {
  try {
    // Load full area details from backend
    const fullArea = await areasAPI.getArea(area.id);
    console.log('Loaded area for editing:', fullArea);
    
    editingAreaId.value = fullArea.id;
    areaConfig.name = fullArea.name;
    areaConfig.description = fullArea.description || '';
    
    // Extract action service ID and action ID
    const actionServiceId = fullArea.action?.service;
    const actionId = fullArea.action?.id;
    
    console.log('Looking for action service:', actionServiceId, 'action:', actionId);
    
    // Find and populate action service
    const actionService = services.value.find(s => s.id === actionServiceId);
    if (actionService) {
      areaConfig.action.service = actionService;
      const actionTrigger = actionService.actions?.find(a => a.id === actionId);
      if (actionTrigger) {
        areaConfig.action.trigger = actionTrigger;
        areaConfig.action.config = fullArea.action_config || {};
        console.log('Action loaded:', actionTrigger.name);
      } else {
        console.error('Action trigger not found:', actionId, 'in service:', actionService.name);
      }
    } else {
      console.error('Action service not found:', actionServiceId);
    }

    // Extract reaction service ID and reaction ID
    const reactionServiceId = fullArea.reaction?.service;
    const reactionId = fullArea.reaction?.id;
    
    console.log('Looking for reaction service:', reactionServiceId, 'reaction:', reactionId);

    // Find and populate reaction service
    const reactionService = services.value.find(s => s.id === reactionServiceId);
    if (reactionService) {
      const reactionTrigger = reactionService.reactions?.find(r => r.id === reactionId);
      if (reactionTrigger) {
        areaConfig.reactions = [{
          id: Date.now(),
          service: reactionService,
          reaction: reactionTrigger,
          config: fullArea.reaction_config || {}
        }];
        console.log('Reaction loaded:', reactionTrigger.name);
      } else {
        console.error('Reaction not found:', reactionId, 'in service:', reactionService.name);
      }
    } else {
      console.error('Reaction service not found:', reactionServiceId);
    }

    console.log('Final areaConfig:', areaConfig);
    isCreating.value = true;
  } catch (error) {
    console.error('Failed to load area details:', error);
    alert('Failed to load area details. Please try again.');
  }
};

// Delete area
const confirmDeleteArea = async (area) => {
  if (!confirm(`Are you sure you want to delete "${area.name}"?`)) return;

  try {
    // Clear the list first to show loading state
    isLoadingAreas.value = true;
    
    // Delete the area
    await areasAPI.deleteArea(area.id);
    
    // Reload the list
    await loadUserAreas();
    
    // Show success message
    console.log('Area deleted successfully');
  } catch (error) {
    console.error('Failed to delete area:', error);
    alert('Failed to delete area: ' + (error.message || 'Unknown error'));
  } finally {
    isLoadingAreas.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

</script>

<style scoped>
.w-18 {
  width: 4.5rem;
}
.h-18 {
  height: 4.5rem;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out forwards;
}
</style>
