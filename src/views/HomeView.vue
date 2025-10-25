<script setup lang="ts">
import Button from 'primevue/button'
import { onMounted } from 'vue'

onMounted(() => {
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')

    if (accessToken) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }
})
</script>

<template>
  <main>
    test
    <Button label="Submit" severity="warn" />
  </main>
</template>

<style scoped></style>
