<!-- src/components/AppHeader.vue -->
<template>
  <header class="flex items-center justify-between p-4 bg-teal-500 text-white">
    <div class="flex items-center space-x-4">
      <button class="transform active:scale-90 transition-transform duration-100" aria-label="Go back">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <button class="transform active:scale-90 transition-transform duration-100" aria-label="Home">
        <Home class="w-6 h-6" />
      </button>
    </div>
    <h1 class="text-lg font-semibold">万释AI辅助问诊平台</h1>
    <div class="flex items-center space-x-2">
      <button 
        class="transform active:scale-90 transition-transform duration-100" 
        aria-label="Reset Chat"
        @click="$emit('reset-chat')"
      >
        <RefreshCw class="w-5 h-5" />
      </button>
      <button 
        class="transform active:scale-90 transition-transform duration-100" 
        aria-label="View History"
        @click="$emit('toggle-history')"
      >
        <Clock class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ArrowLeft, Home, RefreshCw, Clock } from 'lucide-vue-next'
</script>