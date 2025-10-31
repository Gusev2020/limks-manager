import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { supabase } from '@/supabase.ts'

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

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { data } = await supabase.auth.getSession()
    const session = data.session

    if (to.meta.requiresAuth && !session) {
      return next({ name: 'auth' })
    }
    if (!to.meta.requiresAuth && session) {
      return next({ name: 'home' })
    }

    next()
  }
)
export default router
