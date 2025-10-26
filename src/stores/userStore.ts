import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase.ts'
import type { User } from '@supabase/supabase-js'

export const useUserStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  async function getUserInfo() {
    const { data } = await supabase.auth.getUser()
    user.value = data?.user || null
  }

  const resetUser = () => {
    user.value = null
  }

  return { user, getUserInfo, resetUser }
})
