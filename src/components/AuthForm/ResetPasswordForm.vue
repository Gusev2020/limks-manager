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
const { resetPassword, loading, errorMessage } = useAuth()
const email = ref<string>('')

const rules = z.object({
  email: z.string().email({ message: 'Неккоректный email' }),
})

const resolver = ref(zodResolver(rules))

const submitForm = async ({ valid }: { valid: boolean }) => {
  if (!valid) return
  try {
    await resetPassword(email.value)
    showToast('success', 'Ссылка на сброс пароля отправлена на почту')
  } catch {
    showToast('error', 'Ошибка при сбросе пароля', errorMessage.value)
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    :initial-values="{ email }"
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
        v-model="email"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
        {{ $form.email.error.message }}
      </Message>
    </div>
    <div class="grid">
      <Button type="submit" class="w-full" label="Сброс пароля" :loading="loading" />
    </div>
  </Form>
</template>

<style scoped></style>
