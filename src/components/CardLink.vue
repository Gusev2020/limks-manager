<script setup lang="ts">
import { computed, ref } from 'vue'
import Card from 'primevue/card'
import SpeedDial from 'primevue/speeddial'
import CreateLinkModal from '@/components/Modals/CreateLinkModal.vue'

import { useLinksStore } from '@/stores/linksStore'
import { useToastNotification } from '@/composables/useToastNotifications'

type LinkType = {
  id: number
  name: string
  url: string
  description: string
  category: ListCategoryType
  is_favorite: boolean
  preview_image?: string
  click_count?: number
}

type ListCategoryType = {
  id: number
  name: string
}
type ItemMenuButton = {
  label: string
  icon: string
  command: () => void
}
const linksStore = useLinksStore()

const { link } = defineProps<{ link: LinkType }>()
const itemsMenuButton = ref<ItemMenuButton[]>([
  {
    label: 'Избранное',
    icon: 'pi pi-star',
    command: async () => {
      try {
        await linksStore.changeIsFavorite(link.id)
        showToast('success', 'Успех', 'Изменения сохранены')
      } catch {
        showToast('error', 'Ошибка')
      }
    },
  },
  {
    label: 'Скопировать',
    icon: 'pi pi-link',
    command: () => {
      copyToClipBoard()
    },
  },
  {
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    command: () => {
      createLinkDialogVisible.value = true
    },
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: async () => {
      try {
        await linksStore.removeLink(link.id)
        showToast('success', 'Успех', `Ссылка ${link.name} удалена`)
      } catch {
        showToast('error', 'Ошибка при удалении')
      }
    },
  },
])

const { showToast } = useToastNotification()

const createLinkDialogVisible = ref<boolean>(false)

const isFavoriteBgCard = computed(() => {
  return link.is_favorite ? 'var(--p-button-outlined-warn-hover-background)' : ''
})

const copyToClipBoard = async () => {
  try {
    await navigator.clipboard.writeText(link.url)
    showToast('success', 'Успех', `Скопировано ${link.name}`)
  } catch {
    showToast('error', 'Ошибка при копировании')
  }
}

const openLink = () => {
  linksStore.addClickCount(link.id)
}
</script>

<template>
  <CreateLinkModal isEdit :id="link.id" v-model="createLinkDialogVisible" />
  <Card class="relative" :style="{ backgroundColor: isFavoriteBgCard }">
    <template #title>
      <div class="flex items-center gap-2 pr-10">
        <img :src="link.preview_image" :alt="link.url" />
        <a :href="link.url" target="_blank" @click="openLink">{{ link.name }}</a>
        <SpeedDial
          :model="itemsMenuButton"
          :tooltipOptions="{ position: 'left', event: 'hover' }"
          direction="down"
          style="position: absolute; right: 20px; top: 20px"
        />
      </div>
    </template>
    <template #content>
      <div class="flex gap-2 flex-col">
        <div class="font-bold">{{ link.category?.name }}</div>
        <div class="w-full" v-if="link.description">{{ link.description }}</div>
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
