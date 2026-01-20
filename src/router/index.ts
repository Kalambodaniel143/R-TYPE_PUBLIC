import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login',
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../pages/SignUpPage.vue'),
    },
    {
      path: '/verify-email/:token',
      name: 'verifyEmail',
      component: () => import('../pages/VerifyEmailPage.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../pages/DashboardPage.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('../pages/ForgotPasswordRequestPage.vue'),
    },
    {
      path: '/reset-password/:uid/:token',
      name: 'resetPassword',
      component: () => import('../pages/PasswordResetPage.vue'),
    },
    {
      path: '/oauth',
      name: 'oauth',
      component: () => import('../pages/OAuthManagement.vue')
    },
    {
      path: '/oauth/callback/github',
      name: 'githubCallback',
      component: () => import('../pages/GitHubCallbackPage.vue')
    },
    {
      path: '/oauth/callback/discord',
      name: 'discordCallback',
      component: () => import('../pages/DiscordCallback.vue')
    }
  ],
})

export default router
