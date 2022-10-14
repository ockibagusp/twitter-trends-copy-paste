import { createRouter, createWebHashHistory } from 'vue-router'
import TwitterTrendsAPI from '../pages/TwitterTrendsAPI.vue'
import CopydanPaste from '../pages/CopydanPaste.vue'
import GetDayTrends from '../pages/GetDayTrends.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TwitterTrendsAPI
    },
    {
      path: '/copydanpaste',
      name: 'Twitter Trends: Copy dan Paste',
      component: CopydanPaste
    },
    {
      path: '/getdaytrends',
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