<template>
    <div class="bg-white p-6 rounded-xl max-w-lg w-full">
      <h2 class="text-xl font-bold mb-4">发图小贴士</h2>
      <p class="mb-4">请上传清晰完整的检验或检查报告，我将马上为您进行深度解读~^^</p>
      
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">病历治疗：</h3>
        <p class="text-sm text-gray-600 mb-2">这是您的医院就诊记录，上面有您的症状、医生的诊断和治疗方案，以及医嘱等信息。</p>
        <div class="bg-gray-100 p-4 rounded-lg">
          <!-- 这里可以放置上传的病历图片预览 -->
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
        <button @click="takePicture" class="w-full py-2 bg-blue-500 text-white rounded-lg">
          相机拍照
        </button>
        <button @click="selectLocalImage" class="w-full py-2 bg-green-500 text-white rounded-lg">
          本地图片
        </button>
        <button @click="cancel" class="w-full py-2 bg-gray-300 text-gray-700 rounded-lg">
          取消
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    symptomData: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['close'])

  onMounted(() => {
    console.log('症状数据:', props.symptomData)
  })

  const takePicture = () => {
    // 实现相机拍照功能
    console.log('启动相机拍照')
  }

  const selectLocalImage = () => {
    // 实现选择本地图片功能
    console.log('选择本地图片')
  }

  const cancel = () => {
    // 关闭模态框
    emit('close')
  }
  
  </script>