<!-- src/components/ChatCard.vue -->
<template>
  <div class="p-4 bg-white shadow-sm rounded-xl border border-gray-100 animate-pop-in">
    <p :class="message.role === 'user' ? 'text-blue-600' : 'text-green-600'">
      {{ message.role === 'user' ? '您：' : 'AI：' }}
    </p>
    <p v-if="message.role === 'user'" class="mt-2 text-gray-800">{{ message.content }}</p>
    <div v-else>
      <div class="mt-4 mb-4 animate-fade-in animate-slide-in">
        <div class="flex items-center text-teal-600">
          <CheckCircle class="w-5 h-5 mr-2" />
          <span>完成医疗知识库检索，精选4份资料参考</span>
        </div>
        <ul class="mt-2 space-y-2">
          <li v-for="(step, stepIndex) in message.thinkingSteps" :key="stepIndex" class="flex items-start">
            <div v-if="stepIndex < (message.currentStep || 0)" class="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mr-2 mt-1">
              <Check class="w-4 h-4 text-teal-600" />
            </div>
            <div v-else-if="stepIndex === message.currentStep && !message.thinkingComplete" class="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mr-2 mt-1">
              <div class="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div v-else class="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-1"></div>
            <span :class="{ 'text-gray-400': stepIndex > (message.currentStep || 0) }">{{ step }}</span>
          </li>
        </ul>
      </div>
      <p v-if="message.thinkingComplete" class="mt-2 text-gray-800 animate-fade-in">{{ message.displayedResponse }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { CheckCircle, Check } from 'lucide-vue-next'

interface Message {
  role: 'user' | 'assistant'
  content: string
  thinkingSteps?: string[]
  currentStep?: number
  displayedResponse?: string
  thinkingComplete?: boolean
}

defineProps<{
  message: Message
}>()
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-in-out;
}

.animate-pop-in {
  animation: popIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(20px); }
  to { transform: translateY(0); }
}

@keyframes popIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>