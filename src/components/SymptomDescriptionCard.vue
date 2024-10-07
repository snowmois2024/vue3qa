<!-- eslint-disable -->

<template>
  <div class="bg-white p-6 rounded-xl max-w-lg w-full">
    <h3 class="text-lg font-semibold mb-4">症状描述与报告上传</h3>
    
    <!-- 症状描述步骤 -->
    <div v-if="currentStep === 'symptoms'">
      <div class="mt-4 space-y-3">
        <select v-model="symptomData.duration" class="w-full p-2 border rounded">
          <option value="" disabled selected>症状持续时间</option>
          <option value="1-3天">1-3天</option>
          <option value="4-7天">4-7天</option>
          <option value="1-2周">1-2周</option>
          <option value="2周以上">2周以上</option>
        </select>
        <select v-model="symptomData.severity" class="w-full p-2 border rounded">
          <option value="" disabled selected>症状严重程度</option>
          <option value="轻微">轻微</option>
          <option value="中等">中等</option>
          <option value="严重">严重</option>
        </select>
        <select v-model="symptomData.frequency" class="w-full p-2 border rounded">
          <option value="" disabled selected>症状频率</option>
          <option value="偶尔">偶尔</option>
          <option value="经常">经常</option>
          <option value="持续">持续</option>
        </select>
      </div>
      <div class="mt-6 flex justify-end space-x-3">
        <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-200 rounded">取消</button>
        <button @click="nextStep" class="px-4 py-2 bg-teal-500 text-white rounded">下一步</button>
      </div>
    </div>

    <!-- 确认步骤 -->
    <div v-else-if="currentStep === 'confirm'">
      <p>您选择的症状信息：</p>
      <p>症状持续时间：{{ symptomData.duration }}</p>
      <p>症状严重程度：{{ symptomData.severity }}</p>
      <p>症状频率：{{ symptomData.frequency }}</p>
      <div class="mt-4 flex justify-end space-x-3">
        <button @click="currentStep = 'symptoms'" class="px-4 py-2 bg-gray-200 rounded">返回修改</button>
        <button @click="nextStep" class="px-4 py-2 bg-teal-500 text-white rounded">确认</button>
      </div>
    </div>

    <!-- 上传报告步骤 -->
    <div v-else-if="currentStep === 'upload'">
      <p class="mb-4">请上传清晰完整的检验或检查报告，我将马上为您进行深度解读~^^</p>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">病历治疗：</h3>
        <p class="text-sm text-gray-600 mb-2">这是您的医院就诊记录，上面有您的症状、医生的诊断和治疗方案，以及医嘱等信息。</p>
        <div class="bg-gray-100 p-4 rounded-lg">
          <img v-if="image_url" :src="image_url" class="w-full h-auto" alt="上传的病历图片预览" />
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">检查诊断报告：</h3>
        <p class="text-sm text-gray-600 mb-2">包括您在就诊期间进行的各种检查的结果，如X光、CT等。</p>
        <div class="bg-gray-100 p-4 rounded-lg">
          <!-- 这里可以放置上传的检查报告图片预览 -->
        </div>
      </div>
      
      <div class="flex flex-col space-y-3">
        <input type="file" @change="selectLocalImage" class="hidden" ref="fileInput" />
        <button @click="$refs.fileInput.click()" class="w-full py-2 bg-green-500 text-white rounded-lg">选择本地图片</button>
        <button @click="$emit('cancel')" class="w-full py-2 bg-gray-300 text-gray-700 rounded-lg">取消</button>
        <button v-if="image_url" @click="confirmUpload" class="w-full py-2 bg-teal-500 text-white rounded-lg">确认上传</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, defineEmits } from 'vue'

const emit = defineEmits(['send-message', 'cancel'])

const currentStep = ref('symptoms')
const image_url = ref('')

const symptomData = reactive({
  duration: '',
  severity: '',
  frequency: '',
  images: []
})

watch(symptomData, (newValue) => {
  localStorage.setItem('symptomData', JSON.stringify(newValue))
}, { deep: true })

function nextStep() {
  if (currentStep.value === 'symptoms') {
    currentStep.value = 'confirm'
  } else if (currentStep.value === 'confirm') {
    currentStep.value = 'upload'
  }
}

function selectLocalImage(event) {
  const file = event.target.files ? event.target.files[0] : null
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      image_url.value = e.target.result
      symptomData.images.push(image_url.value)
    }
    reader.readAsDataURL(file)
  }
}

function confirmUpload() {
  console.log('确认上传按钮被点击') // 添加调试日志
  const messages = exportMessages()
  emit('send-message', messages) // 发送消息到父组件
  emit('cancel') // 关闭窗口
}

function exportMessages() {
  console.log('exportMessages 函数被调用') // 添加调试日志
  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `症状描述：持续时间 ${symptomData.duration}，严重程度 ${symptomData.severity}，频率 ${symptomData.frequency}`
        },
        {
          type: 'image_url',
          image_url: {
            url: image_url.value,
          },
        },
      ],
    },
  ]

  console.log('准备发送的消息:', JSON.stringify(messages)) // 添加调试日志
  return messages
}
</script>

<style scoped>
/* 添加样式以确保弹窗的外观 */
.fixed {
  position: fixed;
  z-index: 1000;
}
</style>