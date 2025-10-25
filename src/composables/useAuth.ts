import { supabase } from '@/supabase.ts'
import { useRequest } from '@/composables/useRequest'

type SingUpParams = {
  email: string
  password: string
  firstname: string
}

type SingInParams = {
  email: string
  password: string
}

export function useAuth() {
  const { loading, errorMessage, handleRequest } = useRequest()

  const singUp = async ({ email, password, firstname }: SingUpParams) => {
    handleRequest(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.warn('Пользователь ещё не вошёл — email не подтверждён?')
      } else {
        const user = session.user
        await supabase.from('users').insert([{ id: user.id, firstname, email }])
      }

      if (error) throw error
      return data
    })
  }

  const singIn = ({ email, password }: SingInParams) =>
    handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw new Error(error.message)

      return data
    })

  const resetPassword = async (email: string) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw new Error(error.message)

      return data
    })
  }

  return { singUp, singIn, resetPassword, loading, errorMessage }
}
