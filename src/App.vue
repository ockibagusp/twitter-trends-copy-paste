<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/getdaytrends.com">GetDayTrends.com</RouterLink> |
    <RouterLink to="/twitter-trends-api">Twitter Trends API (slow)</RouterLink>
  </nav>

  <main>
    <h2 style="margin-top: 5px;">Trending Topic Twitter di Indonesia</h2>
    <h3 style="margin-top: -25px; margin-bottom: 0px;">Web browser aja.</h3>

    <RouterView />
  </main>
</template>
