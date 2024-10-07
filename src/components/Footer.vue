<!-- src/components/Footer.vue -->
<template>
    <footer class="p-4 bg-white border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <button 
          class="p-2 rounded-full border border-gray-300 transform active:scale-90 transition-transform duration-100"
          aria-label="Voice input"
        >
          <Mic class="w-5 h-5" />
        </button>
        <input 
          v-model="chatStore.userInput"
          class="flex-1 text-sm rounded-full border border-gray-300 p-2" 
          placeholder="请输入想咨询的内容" 
        />
        <button 
          class="p-2 rounded-full bg-teal-500 text-white transform active:scale-90 transition-transform duration-100" 
          @click="handleSend"
          aria-label="Send message"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
import { Mic, Send } from 'lucide-vue-next'
import { useChatStore } from '@/store/chat'  // Updated import path

const chatStore = useChatStore()

const handleSend = async () => {
  if (!chatStore.userInput.trim()) return
  await chatStore.sendMessage(chatStore.userInput)
  chatStore.userInput = ''
}
</script>