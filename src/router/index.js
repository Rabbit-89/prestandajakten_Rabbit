import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('../views/LoginView.vue') },
    { path: '/', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/fakturor', component: () => import('../views/InvoicesView.vue'), meta: { requiresAuth: true } },
    { path: '/flytt', component: () => import('../views/MoveFormView.vue'), meta: { requiresAuth: true } },
    { path: '/profil', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } }
  ]
})

// Route guard = användarupplevelse, inte säkerhet. Den hindrar att en utloggad ser en tom sida.
// Skyddet sitter i API:t: utan giltig token får ingen sida några data, guard eller inte.
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // efter omladdning: token är borta ur minnet men cookien finns – försök få en ny först
    const ok = await auth.restore()
    if (!ok) return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.path === '/login' && auth.isAuthenticated) return '/'
})

export default router
