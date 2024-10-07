<!-- src/App.vue -->
<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <AppHeader @reset-chat="resetChat" @toggle-history="toggleHistory" />
    
    <main class="flex-1 overflow-y-auto p-4 space-y-4">
      <ChatHistory v-if="showHistory" :conversation="conversation" />
      <ChatInterface 
        v-else
        :conversation="conversation"
        :showHistory="showHistory"
        :isThinking="isThinking"
        @upload="handleUpload"
        @send-message="sendMessage"
        @stop-generating="stopGenerating"
      />
    </main>
    
    <ChatInput @send-message="sendMessage" />

    <!-- 新增：上下文大小调整的控件 -->
    <div>
      <label for="contextSize">上下文大小:</label>
      <input 
        type="number" 
        id="contextSize" 
        v-model="contextSize" 
        @change="adjustContextSize(contextSize)"
        min="1" 
        max="50" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import ChatHistory from '@/components/ChatHistory.vue'
import ChatInterface from '@/components/ChatInterface.vue'
import ChatInput from '@/components/ChatInput.vue'

const isThinking = ref(false)
const conversation = ref([])
const showHistory = ref(false)
const stopThinking = ref(false)
const contextSize = ref(10) // 新增：定义上下文大小

const handleUpload = () => {
  // Implement file upload logic here
  console.log('Upload report')
}

const sendMessage = async (message) => {
  console.log('sendMessage 函数被调用，接收到的消息:', message) // 添加调试日志
  isThinking.value = true
  stopThinking.value = false
  
  // 检查消息是否为数组（来自SymptomDescriptionCard）
  if (Array.isArray(message)) {
    console.log('接收到数组类型的消息') // 添加调试日志
    conversation.value.push(...message)
  } else {
    console.log('接收到字符串类型的消息') // 添加调试日志
    conversation.value.push({ role: 'user', content: message })
  }

  try {
    // 构建API请求的消息
    const apiMessages = conversation.value
      .slice(-contextSize.value) // 新增：只取最后 contextSize 条消息
      .map(msg => {
        if (typeof msg.content === 'string') {
          return { role: msg.role, content: msg.content }
        } else {
          // 处理包含图片的消息
          return {
            role: msg.role,
            content: msg.content.map(item => {
              if (item.type === 'text') {
                return { type: 'text', text: item.text }
              } else if (item.type === 'image_url') {
                return { type: 'image_url', image_url: item.image_url }
              }
            })
          }
        }
      })

    console.log('发送到API的消息:', JSON.stringify(apiMessages)) // 添加调试日志

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2-vl-7b-instruct:free',
        messages: apiMessages
      })
    })

    const data = await response.json()
    console.log('API响应:', data) // 添加调试日志

    const aiResponse = data.choices[0].message.content

    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      thinkingSteps: ['思考中...', '分析数据...', '生成回复...'],
      currentStep: 0,
      thinkingComplete: false,
      displayedResponse: ''
    }

    conversation.value.push(aiMessage)
    await thinkingProcess(aiMessage)
    await typeResponse(aiMessage)

  } catch (error) {
    console.error('Error calling LLM API:', error)
    conversation.value.push({ 
      role: 'assistant', 
      content: '抱歉，我现在无法回答您的问题。请稍后再试。',
      displayedResponse: '抱歉，我现在无法回答您的问题。请稍后再试。',
      thinkingComplete: true
    })
  } finally {
    isThinking.value = false
    const lastMessage = conversation.value[conversation.value.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.thinkingComplete = true
      lastMessage.currentStep = lastMessage.thinkingSteps.length // 设置为最后一步
    }
  }
}

const thinkingProcess = async (message) => {
  const totalDuration = 3500 // 3.5 seconds total
  const stepDuration = totalDuration / message.thinkingSteps.length

  for (let i = 0; i < message.thinkingSteps.length; i++) {
    if (stopThinking.value) break
    message.currentStep = i
    await new Promise(resolve => setTimeout(resolve, stepDuration))
  }

  if (!stopThinking.value) {
    message.thinkingComplete = true
    await new Promise(resolve => setTimeout(resolve, 500)) // Short pause before starting response
  }
}

const typeResponse = async (message) => {
  const typingSpeed = 30 // milliseconds per character
  for (let i = 0; i <= message.content.length; i++) {
    if (stopThinking.value) break
    message.displayedResponse = message.content.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, typingSpeed))
  }
}

const stopGenerating = () => {
  stopThinking.value = true
  isThinking.value = false
  const lastMessage = conversation.value[conversation.value.length - 1]
  if (lastMessage && lastMessage.role === 'assistant') {
    lastMessage.thinkingComplete = true
    lastMessage.currentStep = lastMessage.thinkingSteps.length // Complete all steps
    lastMessage.displayedResponse = lastMessage.displayedResponse || '回答生成已停止。'
  }
}

const resetChat = () => {
  conversation.value = []
  showHistory.value = false
  stopThinking.value = true
  isThinking.value = false
  contextSize.value = 10 // 新增：重置上下文大小
}

const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

// 新增：调整上下文大小的函数
const adjustContextSize = (size) => {
  contextSize.value = size
}
</script>

<style>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>