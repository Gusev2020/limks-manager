import { useToast } from 'primevue/usetoast'
import type { AuthError } from '@supabase/supabase-js'

export function useToastNotification() {
  const toast = useToast()

  const showToast = (
    type: string,
    summary: string,
    detail: AuthError | string = 'Что-то пошло не так',
    life: number = 3000,
  ) => {
    toast.add({ severity: type, summary: summary, detail: detail, life: life })
  }
  return { showToast }
}
