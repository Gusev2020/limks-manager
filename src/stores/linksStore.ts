import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase.ts'

type LinkType = {
  id: number
  name: string
  url: string
  description: string
  category: ListCategoryType
  is_favorite: boolean
  preview_image?: string
  click_count: number
}

type ListCategoryType = {
  id: number
  name: string
}

const LIMIT = 6

export const useLinksStore = defineStore('links', () => {
  const loading = ref<boolean>(false)
  const links = ref<LinkType[]>([])
  const onlyFavorites = ref<boolean>(false)
  const sortByPopular = ref<boolean>(false)
  const totalLinks = ref<number | null>(0)
  const hasMore = ref<boolean>(true)
  const offset = ref<number>(0)

  const fetchLinks = async (resetPages: boolean = false, resetFilters: boolean = false) => {
    loading.value = true
    if (resetPages) {
      offset.value = 0
      links.value = []
      hasMore.value = true
    }
    if (resetFilters) {
      onlyFavorites.value = false
      sortByPopular.value = false
    }
    try {
      let query = supabase
        .from('links')
        .select(
          'id, name, url, description, is_favorite, preview_image, click_count, category(id, name)',
          { count: 'exact' }
        )
        .range(offset.value, offset.value + LIMIT - 1)

      if (onlyFavorites.value) {
        query = query.eq('is_favorite', true)
      }

      if (sortByPopular.value) {
        query = query.order('click_count', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await query
      totalLinks.value = count
      offset.value += data?.length ?? 0

      if (error) throw error

      links.value.push(
        ...(data ?? []).map(link => ({
          ...link,
          category: link.category?.[0] ?? null,
        }))
      )
      if (totalLinks.value) {
        hasMore.value = offset.value < totalLinks.value
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const changeIsFavorite = async (id: LinkType['id']) => {
    const index = links.value.findIndex(link => link.id === id)
    if (index !== -1) {
      const newFavorite = !links.value[index].is_favorite

      const { error } = await supabase
        .from('links')
        .update({ is_favorite: newFavorite })
        .eq('id', id)
      if (error) throw error
      links.value[index].is_favorite = newFavorite
    }
  }

  const removeLink = async (id: LinkType['id']) => {
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) throw error
    links.value = links.value.filter(link => link.id !== id)
  }

  const addClickCount = async (id: LinkType['id']) => {
    const index = links.value.findIndex(link => link.id === id)
    if (index !== -1) {
      const newClickCount = links.value[index].click_count + 1

      const { error } = await supabase
        .from('links')
        .update({ click_count: newClickCount })
        .eq('id', id)
      if (error) throw error
      links.value[index].click_count = newClickCount
    }
  }

  return {
    loading,
    links,
    onlyFavorites,
    sortByPopular,
    hasMore,
    offset,
    fetchLinks,
    changeIsFavorite,
    removeLink,
    addClickCount,
  }
})
