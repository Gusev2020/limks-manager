<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menubar from 'primevue/menubar'
import { useToastNotification } from '@/composables/useToastNotifications'
import { useUserStore } from '@/stores/userStore'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()

const authStore = useUserStore()
const { signOut, loading, errorMessage } = useAuth()
const { showToast } = useToastNotification()

const emailFirstLetter = computed(() => {
  return authStore.user?.email ? authStore.user?.email[0].toUpperCase() : ''
})

const signOutUser = async () => {
  try {
    await signOut()
    authStore.resetUser()
    await router.replace({ name: 'auth' })
  } catch {
    showToast('error', 'Ошибка выхода', errorMessage.value)
  }
}
</script>

<template>
  <div class="mb-5">
    <Menubar>
      <template #start>
        <div class="flex items-center gap-2">
          <span class="font-bold">Links Manager</span>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-link" rounded></Button>
            <Button icon="pi pi-folder" rounded></Button>
          </div>
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <Avatar :label="emailFirstLetter" size="large" shape="circle" />
          <Button
            @click="signOutUser"
            icon="pi pi-sign-out"
            rounded
            severity="secondary"
            :loading="loading"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped></style>
