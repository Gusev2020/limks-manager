import { ref } from 'vue'

export function useRequest() {
  const loading = ref<boolean>(false)
  const errorMessage = ref<string>('')
  const handleRequest = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    errorMessage.value = ''
    loading.value = true
    try {
      return await fn()
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage.value = error.message
        console.log(errorMessage.value)

        throw new Error(error.message)
      } else {
        errorMessage.value = String(error)
        throw new Error(String(error))
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, errorMessage, handleRequest }
}
