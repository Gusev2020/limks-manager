<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import Message from 'primevue/message'
import { useToastNotification } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'

const { showToast } = useToastNotification()
const { singIn, signInWithGithub, loading, errorMessage } = useAuth()

type FormData = {
  email: string
  password: string
}

const formData = ref<FormData>({
  email: '',
  password: '',
})

const rules = z.object({
  email: z.string().email({ message: 'Неккоректный email' }),
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})

const resolver = ref(zodResolver(rules))
const emits = defineEmits(['resetPassword'])

const submitForm = async ({ valid }) => {
  if (!valid) return
  try {
    await singIn({
      email: formData.value.email,
      password: formData.value.password,
    })
  } catch {
    showToast('error', 'Ошибка при входе', errorMessage.value)
  }
}
</script>

<template>
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
    <span class="cursor-pointer mb-3 block" @click="emits('resetPassword')">Забыли пароль?</span>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Вход" :loading="loading" />
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
