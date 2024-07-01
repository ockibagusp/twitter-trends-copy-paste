<template>
  <nav>
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/getdaytrends.com"><s>GetDayTrends.com</s></RouterLink> |
    <!-- <RouterLink to="/#/..."><s>...</s></RouterLink> | -->
    <RouterLink to="/twitter-trends-api"><s>Twitter Trends API (slow)</s></RouterLink>
  </nav>

  <main>
    <h2 style="margin-top: 5px">Twitter trending topics in Indonesia</h2>
    <h3 style="margin-top: -20px; margin-bottom: 0px">
      Web browser on Twitter trending topics here.
    </h3>

    <RouterView />
  </main>
</template>
