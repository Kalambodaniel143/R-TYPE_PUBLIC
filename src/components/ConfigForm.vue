<template>
  <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200">
    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Configuration</h4>
    
    <div v-if="hasFields" class="space-y-5">
      <div v-for="(field, key) in configSchema" :key="key">
        <label class="block text-sm font-semibold text-slate-700 mb-2">
          {{ field.title || key }}
        </label>
        
        <!-- String Input -->
        <input 
          v-if="field.type === 'string'"
          type="text"
          v-model="formData[key]"
          class="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 bg-white transition-colors"
          :placeholder="`Enter ${field.title || key}`"
        />
        
        <!-- Number/Integer Input -->
        <input 
          v-else-if="field.type === 'number' || field.type === 'integer'"
          type="number"
          v-model="formData[key]"
          class="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 bg-white transition-colors"
          :placeholder="`Enter ${field.title || key}`"
        />
        
        <!-- Enum (Select) -->
        <select
          v-else-if="field.enum && field.enum.length > 0"
          v-model="formData[key]"
          class="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 bg-white transition-colors"
        >
          <option value="" disabled>Select {{ field.title || key }}</option>
          <option v-for="option in field.enum" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        
        <!-- Fallback -->
        <input 
          v-else
          type="text"
          v-model="formData[key]"
          class="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4 bg-white transition-colors"
          :placeholder="`Enter ${field.title || key}`"
        />
      </div>
    </div>
    
    <div v-else class="text-sm text-slate-500 italic flex items-center gap-2">
      <CheckCircle :size="16" class="text-green-500" />
      No configuration required.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { CheckCircle } from 'lucide-vue-next';

const props = defineProps({
  configSchema: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue']);

const formData = ref({ ...props.modelValue });

const hasFields = computed(() => {
  return Object.keys(props.configSchema).length > 0;
});

// Sync formData with parent
watch(formData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

// Sync with external changes only if different
watch(() => props.modelValue, (newVal) => {
  // Only update if values are actually different
  if (JSON.stringify(newVal) !== JSON.stringify(formData.value)) {
    formData.value = { ...newVal };
  }
}, { deep: true });
</script>
