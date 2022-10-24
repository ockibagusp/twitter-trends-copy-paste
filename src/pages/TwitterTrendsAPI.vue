<script>
const TAGS = 'Tags: '

import axios from 'axios'
import ResultsSlots from './Results.slots.vue'

export default {
  data() {
    return {
      // textarea: twittertrends dan hasil
      twittertrends: '',
      results: '',

      // tweet dihasil maks. 280 karakter
      count: 0,
      // array untuk trends
      arraytrends: [],
      
      // pilih button hasil dan submit: true atau false
      selectSubmit: false,
      selectResults: false,
      // pilih `semua kotak centang`: true atau false
      selectCheckBoxAll: false,

      // `semua kotak centang` diaktifkan
      allCheckboxesEnabled: 0
    }
  },
  computed: {
    // adalah submit: true atau false
    isSubmit: function() {
      return !this.selectSubmit
    },

    // adalah button `semua kotak centang`: true atau false
    isCheckBoxAll: function() {
      return !this.selectCheckBoxAll
    },
  },
  created() {
    this.beMade()
  },
  watch: {
    // textarea: twittertrends
    twittertrends() {
      // textarea hasil: loading...
      this.results = 'Loading...'
      
      // vue methods: memuat
      this.carry()
    }
  },
  methods: {
    // dibuat: dari textarea Twitter Trends API ini
    async beMade() {
      this.arraytrends = []
      this.allCheckboxesEnabled = 0

      this.selectResults = false
      this.selectSubmit = false
      this.selectCopy = false
      this.selectTweet = false
      this.count = 280

      // textarea hasil: loading...
      this.results = 'Loading...'

      try {
        const res = await axios.get('https://twitter-trends-redirect.herokuapp.com/api/trends')
        this.twittertrends = res.data

        // // Testing
        // this.twittertrends = [{"name":"#Test1","url":"http://twitter.com/search?q=%23Test1","tweet_volume":null},{"name":"#Test2","url":"http://twitter.com/search?q=%23Test2","tweet_volume":null},{"name":"#Test3","url":"http://twitter.com/search?q=%23Test3","tweet_volume":null},{"name":"#Test4","url":"http://twitter.com/search?q=%23Test4","tweet_volume":34487},{"name":"#Test5","url":"http://twitter.com/search?q=%23Test5","tweet_volume":17718},{"name":"Test 6","url":"http://twitter.com/search?q=%22Test+1%22","tweet_volume":23644},{"name":"Test 7","url":"http://twitter.com/search?q=%22Test+7%22","tweet_volume":null},{"name":"Test 8","url":"http://twitter.com/search?q=%22Test+8%22","tweet_volume":null},{"name":"Test 9","url":"http://twitter.com/search?q=%22Test+9%22","tweet_volume":null},{"name":"Test 10","url":"http://twitter.com/search?q=%22Test+10%22","tweet_volume":null},{"name":"Test 11","url":"http://twitter.com/search?q=%22Test+11%22","tweet_volume":null},{"name":"Test 12","url":"http://twitter.com/search?q=%22Test+12%22","tweet_volume":null},{"name":"Test 13","url":"http://twitter.com/search?q=%22Test+13%22","tweet_volume":null},{"name":"Test 14","url":"http://twitter.com/search?q=Test 14","tweet_volume":null},{"name":"Test 15","url":"http://twitter.com/search?q=%22Test+15%22","tweet_volume":null},{"name":"Faults 1","url":"http://twitter.com/search?q=%22Faults+1%22","tweet_volume":null},{"name":"Faults 2","url":"http://twitter.com/search?q=%22Faults+2%22","tweet_volume":null}]

        this.selectSubmit = true

        // hasil
        this.carry()
      } catch (error) {
        this.results = ''
        this.selectResults = false
        this.selectSubmit = false
        this.selectCopy = false
        this.selectTweet = false
        alert(error)
      }
    },
    // memuat: dari textarea copydanpaste ini
    carry() {
      this.arraytrends = []
      this.allCheckboxesEnabled = 0
      
      let trends = ''

      let i = 0
      this.twittertrends.forEach((value, index) => {
        // https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
        const tweet_val = Math.abs(value.tweet_volume) > 999 ? Math.sign(value.tweet_volume)*((Math.abs(value.tweet_volume)/1000).toFixed(1)) + 'k' : Math.sign(value.tweet_volume)*Math.abs(value.tweet_volume)
        
        this.arraytrends.push({
          name: value.name,
          url: value.url,
          tweet_volume: tweet_val,
          completed: (i < 15) ? true: false
        })

        if (i < 15) {
          trends += `${value.name}, `
          this.allCheckboxesEnabled++
        }
        i++
      })

      // 'Oknum, Motor, ' ke 'Oknum, Motor'
      if (trends != '') {
        trends = TAGS + trends.substring(0, trends.length-2)
        this.selectResults = true
        this.selectCopy = true
        this.selectTweet = true

        this.count = 280 - trends.length
      } else if (this.twittertrends === 0 && trends == '') {
        trends = 'Tidak ada hasil'
        this.selectResults = false
        this.selectCopy = false
        this.selectTweet = false

        this.count = 280
      }
      
      this.results = trends
      this.isCopyAndCountTweet()
    },
    
    // button: submit dan copy
    btnSubmit() {
      this.selectResults = false
      this.selectCopy = false

      // textarea hasil: loading...
      this.results = 'Loading...'

      this.carry()
    },
    // sama GetDayTrends:btnCheckBoxAll()
    
    // button `semua kotak centang`
    btnCheckBoxAll() {
      if (this.selectCheckBoxAll === true) {
        let newArrayTrendsName = ''
        this.allCheckboxesEnabled = 0

        for (let i = 0; i < 15; i++) {
          this.arraytrends[i].completed = true
          newArrayTrendsName += `${this.arraytrends[i].name}, `
          this.allCheckboxesEnabled++
        }
        this.selectResults = true
        this.selectCopy = true
        this.selectTweet = true

        this.selectCheckBoxAll = false

        this.results = TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length-2)
        this.count = 280 - this.results.length
        this.isCopyAndCountTweet()
      } else {
        this.arraytrends.forEach((val, index) => {
          this.arraytrends[index].completed = false
        })

        this.count = 280
        this.results = 'Tidak ada hasil'
        this.isCopyAndCountTweet()
        this.allCheckboxesEnabled = 0

        this.selectResults = false
        this.selectCopy = false
        this.selectTweet = false        
        this.selectCheckBoxAll = true
      }
    },

    // sama GetDayTrends:trendsChanged(event, index)

    // berubah dalam array untuk trends
    trendsChanged(event, index) {
      const name = this.arraytrends[index].name

      if (event.target.checked) {
        if (this.results === 'Tidak ada hasil') {
          this.results =  TAGS + name
          // pilih hasil, button copy dan button tweet: true
          this.selectResults = true
          this.selectCopy = true
          this.selectTweet = true

          this.allCheckboxesEnabled = 1
        } else {
          let newArrayTrendsName = ''
          for (let i = 0; i < this.arraytrends.length; i++) {
            if (this.arraytrends[i].completed !== false) {
              newArrayTrendsName += `${this.arraytrends[i].name}, `
            }
          }

          this.results = TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length-2)
          this.isCopyAndCountTweet()

          this.allCheckboxesEnabled++
        }

        this.count = 280 - this.results.length
      } else {
        const rightComma = `${name}, `
        const leftComma = `, ${name}`
        const bothComma = `, ${name}, `

        let release = ''
        if (this.results.includes(rightComma)) {
          release = rightComma
        } else if (this.results.includes(leftComma)) {
          release = leftComma
        } else if (this.results.includes(bothComma)) {
          release = bothComma
        } else {
          // melepas = text 
          this.results = 'Tidak ada hasil'
          // pilih hasil, button copy dan button tweet: false
          this.selectResults = false
          this.selectCopy = false
          this.selectTweet = false
          this.count = 280

          this.allCheckboxesEnabled = 0
          return
        }
        this.results = this.results.replace(release, '')

        this.count = 280 - this.results.length
        this.isCopyAndCountTweet()

        this.allCheckboxesEnabled--
      }
    },

    // sama GetDayTrends:isCountTweet()
    // adalah textarea hitungan dan tombol tweet
    isCopyAndCountTweet() {
      if (this.results === '' || this.results === 'Tidak ada hasil' 
        || this.results.length > 280) { 
        this.selectCopy = false
        this.selectTweet = false
      } else {
        this.selectCopy = true
        this.selectTweet = true
      }
    }
  },
  // Slots - Vue.js
  // https://vuejs.org/guide/components/slots.html#scoped-slots
  components: {
    ResultsSlots: ResultsSlots
  }
}
</script>

<template>
  <h2 style="margin-top: 10px; margin-bottom: 0px;">Twitter Trends (Bekasi, Indonesia)</h2>
  <button @click="btnSubmit" data-test="btn-submit" :disabled="isSubmit">Submit</button>
  <br>

  <ResultsSlots 
    :results="results" 
    :count="count"
    :selectResults="selectResults"
    :selectCopy="selectCopy"
    :selectTweet="selectTweet"/>
  
  <h4 v-if="arraytrends.length > 0">Kotak Centang: 
    <button @click="btnCheckBoxAll()" data-test="btn-checkbox-all">
      {{ !isCheckBoxAll ? 'diaktifkan': 'tidak diaktifkan' }}
    </button>    
  </h4>
  
  <p style="margin-top: -20px; margin-bottom: 5px;" v-if="arraytrends.length > 0" data-test="all-checkboxes-enabled">
    diaktifkan: {{ allCheckboxesEnabled }}
  </p>
  
  {{ arraytrends.length > 0 ? '📌' : '' }}
  <div
    v-for="(trends, index) in arraytrends"
    :key="trends.name"
    data-test="array-trends"
    :class="[trends.completed ? 'completed' : '']"
    @change="trendsChanged($event, index)"
  >
    <input
      type="checkbox"
      v-model="trends.completed"
      data-test="trends-checkbox"
    />
    <a :href="trends.url" target="_blank">{{ trends.name }}</a>
    <small class="tweet-volume-class">{{ trends.tweet_volume !== 0 ? `(${trends.tweet_volume} tweets)` : '' }}</small>
  </div>

  <br>
  <p style="margin-top: -5px; margin-bottom: 5px; color: red;">Platform Pengembang untuk Saya (Twitter API v2): tidak bisa trends/place API ❌</p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: green;">
    Platform Pengembang untuk <a href="https://github.com/guilhermefront/Twitter-Trending" target="_blank">Github: @guilhermefront</a> (Twitter API Standard v1.1): ada trends/place API  ✅
  </p>
</template>