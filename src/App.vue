<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import TheHeader from '@/components/TheHeader.vue'
import { onMounted } from 'vue'

const authStore = useUserStore()

onMounted(async () => {
  await authStore.getUserInfo()
})
</script>

<template>
  <TheHeader v-if="authStore.user" />
  <RouterView />
</template>
