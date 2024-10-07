<!-- src/components/ChatHistory.vue -->
<template>
  <div class="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
    <h2 class="font-bold text-lg mb-4">历史对话</h2>
    <div v-for="(chat, index) in conversation" :key="index" class="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
      <p class="font-semibold" :class="chat.role === 'user' ? 'text-blue-600' : 'text-green-600'">
        {{ chat.role === 'user' ? '您：' : 'AI：' }}
      </p>
      <p class="mt-1 text-gray-800">{{ chat.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  conversation: {
    type: Array,
    required: true
  }
})
</script>