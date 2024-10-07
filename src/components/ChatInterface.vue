<!-- eslint-disable -->
<!-- src/components/ChatInterface.vue -->
/* eslint-disable */ 
<template>
  <div>
    <div v-if="!showHistory" class="p-6 bg-white shadow-sm rounded-xl border border-gray-100">
      <div class="flex items-start space-x-3">
        <div class="w-20 h-20 rounded-full overflow-hidden">
          <img src="/images/Unknown.png" alt="AI Avatar" class="w-full h-full object-cover" />
        </div>
        <div>
          <h2 class="font-bold text-base mb-2">Hi，欢迎来到万释AI辅助问诊平台</h2>
          <p class="text-sm text-gray-600 mb-4">
            您可以同时上传<HighlightedText>多张检查结果</HighlightedText>，检验报告进行免费报告解读，提供<HighlightedText>症状、用药情况、病史</HighlightedText>等病情描述有助于解读结果更加准确。
          </p>
          <button 
            class="w-full py-3 rounded-full text-white text-base font-semibold transition-all duration-300 ease-in-out transform active:scale-95"
            :style="gradientStyle"
            @click="handleUpload"
          >
            立即上传报告
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!showHistory" class="p-4 bg-white shadow-sm rounded-xl border border-gray-100 mt-4 overflow-hidden">
      <h3 class="font-semibold mb-4 text-sm">还可以直接问我医疗检查知识或指标结果：</h3>
      <div class="relative h-36 overflow-hidden">
        <div v-for="(row, rowIndex) in 3" :key="rowIndex" class="absolute w-full" :style="{ top: `${rowIndex * 33.33}%` }">
          <div :class="`animate-scroll-${rowIndex + 1}`">
            <div class="flex gap-4">
              <button
                v-for="(question, index) in getRowQuestions(rowIndex)"
                :key="index"
                @click="$emit('send-message', question)"
                class="py-2 px-3 rounded-full text-black-800 text-xs font-medium transition-all duration-300 ease-in-out transform active:scale-95 whitespace-nowrap text-center bg-green-100 flex-shrink-0"
              >
                {{ question }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="conversation.length > 0 && !showHistory" class="space-y-4 mt-4" ref="chatContainer">
      <div v-for="(message, index) in conversation" :key="index" class="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
        <p :class="message.role === 'user' ? 'text-blue-600' : 'text-green-600'">
          {{ message.role === 'user' ? '您：' : 'AI：' }}
        </p>
        <p v-if="message.role === 'user'" class="mt-2 text-gray-800">{{ message.content }}</p>
        <div v-else>
          <div class="mt-4 mb-4">
            <div class="flex items-center text-teal-600">
              <CheckCircle class="w-5 h-5 mr-2" />
              <span>完成医疗知识库检索，精选4份资料参考</span>
            </div>
            <ul class="mt-2 space-y-2">
              <li v-for="(step, stepIndex) in message.thinkingSteps" :key="stepIndex" class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mr-2 mt-1">
                  <Check v-if="stepIndex <= message.currentStep" class="w-4 h-4 text-teal-600" />
                </div>
                <span :class="{ 'text-gray-400': stepIndex > message.currentStep }">{{ step }}</span>
              </li>
            </ul>
          </div>
          <p v-if="message.thinkingComplete" class="mt-2 text-gray-800">{{ message.displayedResponse }}</p>
        </div>
      </div>
      <div v-if="isThinking" class="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
        <p class="text-green-600">AI：</p>
        <div class="mt-2 flex items-center space-x-2">
          <span class="text-gray-600">正在思考中</span>
          <div class="flex space-x-1">
            <div v-for="i in 3" :key="i" class="w-2 h-2 bg-teal-500 rounded-full animate-pulse" :style="{ animationDelay: `${(i - 1) * 0.2}s` }"></div>
          </div>
        </div>
        <button @click="$emit('stop-generating')" class="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
          停止生成
        </button>
      </div>
    </div>
    
    <div v-if="showUploadPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SymptomDescriptionCard @cancel="closeUploadPopup" @send-message="sendMessage" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { CheckCircle, Check } from 'lucide-vue-next'
import SymptomDescriptionCard from './SymptomDescriptionCard.vue'

/* eslint-disable no-undef, no-unused-vars */
const props = defineProps({
  conversation: Array,
  showHistory: Boolean,
  isThinking: Boolean,
  stopThinking: Boolean // 确保 stopThinking 被定义
})

const emit = defineEmits(['upload', 'send-message', 'stop-generating'])
/* eslint-enable no-undef, no-unused-vars */

const predefinedQuestions = [
  '勃起功能障碍是什么?它有多常见?',
  '正常的勃起过程是如何发生的?',
  '哪些因素会导致勃起功能障碍?',
  '勃起功能障碍会影响生育能力吗?',
  '我的年龄会增加患勃起功能障碍的风险吗?',
  '压力和焦虑会导致勃起功能障碍吗?',
  '糖尿病如何影响勃起功能?',
  '高血压会引起勃起功能障碍吗?',
  '吸烟和饮酒会影响勃起功能吗?',
  '缺乏运动会导致勃起功能障碍吗?',
  '睾酮水平对勃起功能有什么影响?',
  '如何诊断勃起功能障碍?需要做哪些检查?',
  '有哪些治疗勃起功能障碍的方法?',
  'PDE5抑制剂是什么?它们如何帮助改善勃起功能?',
  '使用勃起功能障碍药物有副作用吗?',
  '我可以长期使用勃起功能障碍药物吗?',
  '除了药物,还有其他治疗勃起功能障碍的方法吗?',
  '生活方式的改变能改善勃起功能吗?',
  '勃起功能障碍会自行好转吗?',
  '我的伴侣如何帮助我应对勃起功能障碍?',
  '勃起功能障碍会影响心理健康吗?',
  '有哪些新的勃起功能障碍治疗方法?',
  '手术能治疗勃起功能障碍吗?',
  '中医能治疗勃起功能障碍吗?',
  '勃起功能障碍会影响整体健康吗?',
  '如何预防勃起功能障碍?',
  '我需要定期检查勃起功能吗?',
  '勃起功能障碍治疗后,性功能能完全恢复吗?'
];

const getRowQuestions = (rowIndex) => {
  const questionsPerRow = 5;
  const startIndex = rowIndex * questionsPerRow;
  const uniqueQuestions = predefinedQuestions.filter((q, index) => index % 3 !== rowIndex);
  
  // 创建一个足够长的问题数组以确保无缝循环
  const extendedQuestions = [...uniqueQuestions, ...uniqueQuestions];
  
  return extendedQuestions.slice(startIndex, startIndex + questionsPerRow * 2);
};

const gradientStyle = computed(() => ({
  background: 'linear-gradient(to right, #20e3b2, #29ffc6)',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
}))

const showUploadPopup = ref(false)

function closeUploadPopup() {
  showUploadPopup.value = false
}

// 删除 typeResponse 函数

function sendMessage(message) {
  emit('send-message', message)
  typeWriterEffect(message.content) // 添加打字机效果
}

// 修改 typeWriterEffect 数
function typeWriterEffect(content) {
  const message = { role: 'ai', content: '', thinkingComplete: false };
  emit('add-message', message); // 使用事件向父组件发送消息

  let index = 0;
  const interval = setInterval(() => {
    if (index < content.length) {
      message.content += content.charAt(index);
      index++;
      scrollToBottom(); // 每次添加字符后滚动到底部
    } else {
      clearInterval(interval);
      message.thinkingComplete = true; // 打字完成
      scrollToBottom(); // 最后一次滚动到底部
    }
  }, 50); // 调整打字速度为每50毫秒一个字符
}

function handleUpload() {
  showUploadPopup.value = true
}

const chatContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

watch(() => props.conversation, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style>
@keyframes scroll-1 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@keyframes scroll-2 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@keyframes scroll-3 {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

.animate-scroll-1, .animate-scroll-2, .animate-scroll-3 {
  display: flex;
  width: 200%;
}

.animate-scroll-1 {
  animation: scroll-1 80s linear infinite;
}

.animate-scroll-2 {
  animation: scroll-2 90s linear infinite;
}

.animate-scroll-3 {
  animation: scroll-3 100s linear infinite;
}

.animate-scroll-1:hover,
.animate-scroll-2:hover,
.animate-scroll-3:hover {
  animation-play-state: paused;
}
</style>