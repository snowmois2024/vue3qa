<template>
  <div ref="chartContainer" class="w-full h-64"></div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';
import ForceGraph from 'force-graph';

const props = defineProps({
  data: Object,
});

const chartContainer = ref(null);
let graph = null;

onMounted(() => {
  initGraph();
});

watch(() => props.data, (newData) => {
  if (graph && newData) {
    updateGraph(newData);
  }
});

function initGraph() {
  graph = ForceGraph()(chartContainer.value)
    .nodeId('id')
    .nodeVal('value')
    .nodeLabel('name')
    .nodeColor(node => node.recommended ? 'red' : '#1f77b4')
    .linkSource('source')
    .linkTarget('target');
}

function updateGraph(data) {
  graph.graphData(data);
}
</script>
