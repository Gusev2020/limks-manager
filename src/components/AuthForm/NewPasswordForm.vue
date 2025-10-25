<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import Message from 'primevue/message'
import { useToastNotification } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'

const { showToast } = useToastNotification()
const { updatePassword, loading, errorMessage } = useAuth()
const router = useRouter()
const password = ref<string>('')

const rules = z.object({
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})
const resolver = ref(zodResolver(rules))

const submitForm = async ({ valid }: { valid: boolean }) => {
  if (!valid) return
  try {
    await updatePassword(password.value)
    router.replace('/auth')
  } catch {
    showToast('error', 'Ошибка при смене пароля', errorMessage.value)
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    :initial-values="{ password }"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitForm"
  >
    <div class="mb-3">
      <InputText
        name="password"
        placeholder="Введите новый пароль"
        type="password"
        v-model="password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
        {{ $form.password.error.message }}
      </Message>
    </div>
    <div class="grid">
      <Button type="submit" class="w-full" label="Задать новый пароль" :loading="loading" />
    </div>
  </Form>
</template>

<style scoped></style>
