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
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        // для продакшн указать корректный домен
        redirectTo: 'http://localhost:5173/reset-password',
      })

      if (error) throw new Error(error.message)

      return data
    })
  }

  const updatePassword = async (password: string) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.updateUser({ password })

      if (error) throw new Error(error.message)

      return data
    })
  }

  const signInWithGithub = async () => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github' })

      if (error) throw new Error(error.message)

      return data
    })
  }

  const signOut = async () => {
    return await handleRequest(async () => {
      const { error } = await supabase.auth.signOut()

      if (error) throw new Error(error.message)

      return error
    })
  }

  return {
    singUp,
    singIn,
    resetPassword,
    updatePassword,
    signInWithGithub,
    signOut,
    loading,
    errorMessage,
  }
}
