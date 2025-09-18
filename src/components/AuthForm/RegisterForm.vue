<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { supabase } from '@/supabase.ts'

const toast = useToast()

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
const emits = defineEmits(['resetPassword'])

const submitForm = async ({ valid }) => {
  if (!valid) return
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: error, life: 3000 })
  } else {
    toast.add({
      severity: 'success',
      summary: 'Регистрация',
      detail: 'Вы успешно зарегистрировались',
      life: 3000,
    })
  }
  console.log(data, error)
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
        v-model="formData.firstName"
        class="w-full"
      />
      <Message v-if="$form.firstname?.invalid" severity="error" size="small" variant="simple">
        {{ $form.firstname.error.message }}
      </Message>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Регистрация" />
      <Button type="submit" icon="pi pi-github" class="w-full" label="Github" severity="contrast" />
    </div>
  </Form>
</template>

<style scoped></style>
