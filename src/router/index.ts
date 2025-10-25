import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { supabase } from '@/supabase.ts'
import type { Session } from '@supabase/supabase-js'

let user: Session | null = null
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPassword.vue'),
    },
  ],
})

const getUser = async (next: NavigationGuardNext) => {
  const { data, error } = await supabase.auth.getSession()
  if (error) console.error(error)
  user = data.session
  if (user === null) {
    next({ name: 'auth' })
  } else {
    next()
  }
}

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.meta.requiresAuth) {
      await getUser(next)
    } else {
      next()
    }
  }
)
export default router
