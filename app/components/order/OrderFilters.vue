<template>
  <div class="mb-6 flex flex-wrap gap-3">
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-all',
        currentFilter === filter.value
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200',
      ]"
      @click="$emit('change', filter.value)"
    >
      {{ filter.label }}
      <span
        v-if="filter.count !== undefined"
        :class="[
          'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
          currentFilter === filter.value
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600',
        ]"
      >
        {{ filter.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Filter {
  label: string;
  value: "all" | "pending" | "verified" | "rejected";
  count: number;
}

interface Props {
  filters: Filter[];
  currentFilter: "all" | "pending" | "verified" | "rejected";
}

defineProps<Props>();

defineEmits<{
  change: [value: "all" | "pending" | "verified" | "rejected"];
}>();
</script>
