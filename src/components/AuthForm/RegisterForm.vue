<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { Form } from '@primevue/forms'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useToastNotification } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const { showToast } = useToastNotification()
const { singUp, signInWithGithub, loading, errorMessage } = useAuth()
const authStore = useUserStore()

type FormData = {
  email: string
  password: string
  firstname: string
}

const formData = ref<FormData>({
  email: '',
  password: '',
  firstname: '',
})

const rules = z.object({
  email: z.string().email({ message: 'Неккоректный email' }),
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
  firstname: z.string().min(2, { message: 'Должно быть минимум 2 символа' }),
})

const resolver = ref(zodResolver(rules))

const submitForm = async ({ valid }: { valid: boolean }) => {
  if (!valid) return
  try {
    await singUp({
      email: formData.value.email,
      password: formData.value.password,
      firstname: formData.value.firstname,
    })
    await authStore.getUserInfo()
    await router.replace({ name: 'home' })
  } catch {
    showToast('error', 'Ошибка регистрации', errorMessage.value)
  }
}
</script>

<template>
  <Toast />
  <Form
    v-slot="$form"
    :initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitForm"
  >
    <div class="mb-3">
      <InputText
        name="email"
        placeholder="Введите email"
        type="text"
        v-model="formData.email"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
        {{ $form.email.error.message }}
      </Message>
    </div>
    <div class="mb-3">
      <InputText
        name="password"
        placeholder="Введите пароль"
        type="password"
        v-model="formData.password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
        {{ $form.password.error.message }}
      </Message>
    </div>
    <div class="mb-3">
      <InputText
        name="firstname"
        placeholder="Введите имя"
        type="text"
        v-model="formData.firstname"
        class="w-full"
      />
      <Message v-if="$form.firstname?.invalid" severity="error" size="small" variant="simple">
        {{ $form.firstname.error.message }}
      </Message>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Регистрация" :loading="loading" />
      <Button
        @click="signInWithGithub"
        icon="pi pi-github"
        class="w-full"
        label="Github"
        severity="contrast"
      />
    </div>
  </Form>
</template>

<style scoped></style>
