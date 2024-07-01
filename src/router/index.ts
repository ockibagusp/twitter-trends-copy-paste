import { createRouter, createWebHashHistory } from 'vue-router'
// import TwitterTrendsAPI from '../pages/TwitterTrendsAPI.vue'
import CopyAndPaste from '../pages/CopyAndPaste.vue'
// import GetDayTrends from '../pages/GetDayTrends.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CopyAndPaste
    },
    // {
    //   path: '/twitter-trends-api',
    //   name: 'Twitter Trends API',
    //   // component: () => import('../pages/TwitterTrendsAPI.vue')
    //   component: TwitterTrendsAPI
    // },
    // {
    //   path: '/getdaytrends.com',
    //   name: 'getdaytrends',
    //   // component: () => import('../pages/GetDayTrends.vue')
    //   component: GetDayTrends
    // },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: NotFound
    }
  ]
})

export default router
