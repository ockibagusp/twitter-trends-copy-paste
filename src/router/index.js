import { createRouter, createWebHashHistory } from 'vue-router'
import TwitterTrendsAPI from '../pages/TwitterTrendsAPI.vue'
import CopyandPaste from '../pages/CopyandPaste.vue'
import GetDayTrends from '../pages/GetDayTrends.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CopyandPaste
    },
    {
      path: '/twitter-trends-api',
      name: 'Twitter Trends API',
      component: TwitterTrendsAPI
    },
    {
      path: '/getdaytrends.com',
      name: 'getdaytrends',
      component: GetDayTrends
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: NotFound
    }
  ]
})

export default router