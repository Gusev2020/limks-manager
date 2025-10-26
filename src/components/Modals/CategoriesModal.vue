<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Skeleton from 'primevue/skeleton'
import { Form } from '@primevue/forms'
import { useToastNotification } from '@/composables/useToastNotifications'
import { supabase } from '@/supabase.ts'

type ListCategoryType = {
  id: number
  created_at: string
  name: string
  user_id: string
}
const { showToast } = useToastNotification()

const modalVaue = defineModel<boolean>()
const isloading = ref<boolean>(false)
const categoryName = ref<string>('')
const listCategories = ref<ListCategoryType[]>([])
const isloadingModal = ref<boolean>(false)

const getCategories = async () => {
  isloadingModal.value = true
  try {
    const { data, error } = await supabase.from('categories').select()
    if (error) throw error
    listCategories.value = data
    isloadingModal.value = false
  } catch {
    showToast('error', 'Ошибка', 'Не удалось получить категории')
  }
}

const saveCategory = async () => {
  isloading.value = true
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: categoryName.value })
      .select()

    if (error) throw error
    listCategories.value.push(data[0])
    categoryName.value = ''
    showToast('success', 'Успешно', 'Категория добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить категорию')
  } finally {
    isloading.value = false
  }
}
const deleteCategory = async (id: ListCategoryType['id']) => {
  isloadingModal.value = true
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    listCategories.value = listCategories.value.filter(category => category.id !== id)
    isloadingModal.value = false
    showToast('success', 'Успешно', 'Категория успешно удалена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось удалить категорию')
  } finally {
    isloadingModal.value = false
  }
}

watch(modalVaue, async newValue => {
  if (newValue) await getCategories()
})
</script>

<template>
  <Toast />
  <div class="card flex justify-center">
    <Dialog v-model:visible="modalVaue" header="Категории" :style="{ width: '25rem' }">
      <template v-if="isloadingModal">
        <div class="grid mt-3 grid-cols-[1fr_32px] mb-1 items-center gap-5">
          <Skeleton width="100%" />
          <Skeleton shape="circle" size="2rem" />
        </div>
      </template>
      <template v-else>
        <Form @submit="saveCategory">
          <div class="flex gap-2 mb-2">
            <InputText
              placeholder="Название новой категории"
              v-model="categoryName"
              class="flex-auto w-full"
              autocomplete="off"
            />
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Добавить" @click="saveCategory" :loading="isloading" />
          </div>
          <div
            :key="category.id"
            v-for="category in listCategories"
            class="grid mt-3 grid-cols-[1fr_32px] mb-1 gap-5"
          >
            {{ category.name }}
            <Button
              type="button"
              rounded
              size="small"
              variant="text"
              icon="pi pi-times"
              @click="deleteCategory(category.id)"
            />
          </div>
        </Form>
      </template>
    </Dialog>
  </div>
</template>

<style scoped></style>
