<script setup lang="ts">
import Button from 'primevue/button'
import LoaderSpinner from '@/components/LoaderSpinner.vue'
import CardLink from '@/components/CardLink.vue'
import FiltersLink from '@/components/FiltersLink.vue'
import { useLinksStore } from '@/stores/linksStore'
import { onMounted } from 'vue'

const linksStore = useLinksStore()
onMounted(async () => {
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')

    if (accessToken) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }

  await linksStore.fetchLinks()
})
</script>

<template>
  <LoaderSpinner v-if="linksStore.loading && linksStore.offset === 0" />
  <div v-else>
    <h2 v-if="!linksStore.links.length" class="font-bold text-center">
      Вы пока еще не добавили ссылок
    </h2>
    <template v-else>
      <FiltersLink />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardLink v-for="link in linksStore.links" :key="link.id" :link="link" />
      </div>
      <div class="flex justify-center mt-5">
        <Button
          v-if="linksStore.hasMore"
          label="Показать еще"
          :loading="linksStore.loading"
          @click="linksStore.fetchLinks()"
        />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
