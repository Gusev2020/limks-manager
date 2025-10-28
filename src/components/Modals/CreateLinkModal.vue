<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import Message from 'primevue/message'
import LoaderSpinner from '@/components/LoaderSpinner.vue'
import { Form } from '@primevue/forms'
import { useToastNotification } from '@/composables/useToastNotifications'
import { supabase } from '@/supabase.ts'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useUserStore } from '@/stores/userStore'

type formInputsType = {
  name: string
  url: string
  description: string
  category: ListCategoryType | null
  is_favorite: boolean
}

type ListCategoryType = {
  id: number
  created_at: string
  name: string
  user_id: string
}

const userStore = useUserStore()
const { showToast } = useToastNotification()
const rules = z.object({
  name: z.string().min(1, { message: 'Название обязательно для заполнения' }),
  url: z.string().url({ message: 'Неккоректная ссылка' }),
})

const resolver = ref(zodResolver(rules))

const isLoading = ref<boolean>(false)
const isLoadingButton = ref<boolean>(false)
const listCategories = ref<ListCategoryType[]>([])

const modalValue = defineModel<boolean>()
const formInputs = ref<formInputsType>({
  name: '',
  url: '',
  description: '',
  category: null,
  is_favorite: false,
})

const getDomain = (url: string) => {
  const { hostname } = new URL(url)
  const parts = hostname.split('.')
  if (parts.length > 2) {
    return parts.slice(-2).join('.')
  }
  return hostname
}

const loadModal = async () => {
  isLoading.value = true
  await getCategories()
  isLoading.value = false
}

const clearFromInputs = () => {
  formInputs.value = {
    name: '',
    url: '',
    description: '',
    category: null,
    is_favorite: false,
  }
}

const getCategories = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase.from('categories').select()
    if (error) throw error
    listCategories.value = data
    formInputs.value.category = listCategories.value[0]
    isLoading.value = false
  } catch {
    showToast('error', 'Ошибка', 'Не удалось получить категории')
  }
}

const addNewLink = async () => {
  isLoadingButton.value = true
  const hostname = getDomain(formInputs.value.url)
  const payload = {
    name: formInputs.value.name,
    url: formInputs.value.url,
    description: formInputs.value.description,
    category: formInputs.value.category?.id,
    click_count: 0,
    is_favorite: formInputs.value.is_favorite,
    preview_image: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=32`,
    user_id: userStore.user?.id,
  }

  try {
    const { error } = await supabase.from('links').insert(payload).select()
    if (error) throw error
    modalValue.value = false
    clearFromInputs()
    showToast('success', 'Успех', 'Ссылка успешно добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить ссылку')
  } finally {
    isLoadingButton.value = false
  }
}

const submitForm = async () => {
  await addNewLink()
}

watch(modalValue, async newValue => {
  if (newValue) {
    await loadModal()
  }
})
</script>

<template>
  <Toast />
  <Dialog modal v-model:visible="modalValue" header="Создание ссылки" :style="{ width: '25rem' }">
    <Form
      v-slot="$form"
      :initial-values="formInputs"
      :resolver="resolver"
      :validate-on-submit="true"
      :validate-on-value-update="false"
      @submit="submitForm"
    >
      <LoaderSpinner v-if="isLoading" />
      <template v-else>
        <div class="mb-3">
          <InputText
            name="name"
            v-model="formInputs.name"
            class="w-full"
            autocomplete="off"
            placeholder="Название ссылки"
          />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
            {{ $form.name.error.message }}
          </Message>
        </div>
        <div class="mb-3">
          <InputText
            name="url"
            v-model="formInputs.url"
            class="w-full"
            autocomplete="off"
            placeholder="Url ссылки"
          />
          <Message v-if="$form.url?.invalid" severity="error" size="small" variant="simple">
            {{ $form.url.error.message }}
          </Message>
        </div>
        <div class="mb-3">
          <Select
            v-model="formInputs.category"
            :options="listCategories"
            option-label="name"
            placeholder="Выберите категорию"
            class="w-full"
          />
        </div>
        <div class="mb-3">
          <Textarea
            v-model="formInputs.description"
            class="w-full"
            style="resize: none"
            placeholder="Описание"
          />
        </div>
        <div class="mb-3 flex gap-2 items-center">
          <Checkbox v-model="formInputs.is_favorite" inputId="isFavorite" binary />
          <label for="isFavorite">Добавить в избранное</label>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Добавить" type="submit" :loading="isLoadingButton" />
        </div>
      </template>
    </Form>
  </Dialog>
</template>

<style scoped></style>
