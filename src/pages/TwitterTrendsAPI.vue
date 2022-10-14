<script>
const TAGS = 'Tags: '

// Slots - Vue.js
// https://vuejs.org/guide/components/slots.html#scoped-slots

import axios from 'axios'

export default {
  data() {
    return {
      // textarea: twittertrends dan hasil
      twittertrends: '',
      hasil: '',

      // array untuk trends
      arraytrends: [],

      // tweet dihasil maks. 280 karakter
      count: 280,

      // pilih hasil, button submit, button copy dan button tweet: true atau false
      selectSubmit: false,
      selectHasil: false,
      selectCopy: false,
      selectTweet: false,

      // pilih `semua kotak centang`: true atau false
      selectCheckBoxAll: false,

      // `semua kotak centang` diaktifkan
      allCheckboxesEnabled: 0
    }
  },
  computed: {
    // adalah submit, hasil dan button copy: true atau false
    isSubmit: function() {
      return !this.selectSubmit
    },
    isHasil: function() {
      return !this.selectHasil
    },
    isCopy: function() {
      return !this.selectCopy
    },
    isTweet: function() {
      return !this.selectTweet
    },

    // adalah button `semua kotak centang`: true atau false
    isCheckBoxAll: function() {
      return !this.selectCheckBoxAll
    },
  },
  created() {
    this.dibuat()
  },
  watch: {
    // textarea: twittertrends
    twittertrends() {
      // textarea hasil: loading...
      this.hasil = 'Loading...'
      
      // vue methods: memuat
      this.memuat()
    }
  },
  methods: {
    // dibuat: dari textarea getdaytrends ini
    async dibuat() {
      this.arraytrends = []
      this.allCheckboxesEnabled = 0

      this.selectSubmit = false
      this.selectCopy = false
      this.selectTweet = false
      this.count = 280

      this.selectHasil = false
      // textarea hasil: loading...
      this.hasil = 'Loading...'

      try {
        const res = await axios.get('https://twitter-trends-redirect.herokuapp.com/api/trends')
        this.twittertrends = res.data

        // // Testing
        // this.twittertrends = [{"name":"#Test1","url":"http://twitter.com/search?q=%23Test1","tweet_volume":null},{"name":"#Test2","url":"http://twitter.com/search?q=%23Test2","tweet_volume":null},{"name":"#Test3","url":"http://twitter.com/search?q=%23Test3","tweet_volume":null},{"name":"#Test4","url":"http://twitter.com/search?q=%23Test4","tweet_volume":34487},{"name":"#Test5","url":"http://twitter.com/search?q=%23Test5","tweet_volume":17718},{"name":"Test 6","url":"http://twitter.com/search?q=%22Test+1%22","tweet_volume":23644},{"name":"Test 7","url":"http://twitter.com/search?q=%22Test+7%22","tweet_volume":null},{"name":"Test 8","url":"http://twitter.com/search?q=%22Test+8%22","tweet_volume":null},{"name":"Test 9","url":"http://twitter.com/search?q=%22Test+9%22","tweet_volume":null},{"name":"Test 10","url":"http://twitter.com/search?q=%22Test+10%22","tweet_volume":null},{"name":"Test 11","url":"http://twitter.com/search?q=%22Test+11%22","tweet_volume":null},{"name":"Test 12","url":"http://twitter.com/search?q=%22Test+12%22","tweet_volume":null},{"name":"Test 13","url":"http://twitter.com/search?q=%22Test+13%22","tweet_volume":null},{"name":"Test 14","url":"http://twitter.com/search?q=Test 14","tweet_volume":null},{"name":"Test 15","url":"http://twitter.com/search?q=%22Test+15%22","tweet_volume":null},{"name":"Faults 1","url":"http://twitter.com/search?q=%22Faults+1%22","tweet_volume":null},{"name":"Faults 2","url":"http://twitter.com/search?q=%22Faults+2%22","tweet_volume":null}]

        this.selectSubmit = true

        // hasil
        this.memuat()
      } catch (error) {
        this.hasil = ''
        this.selectHasil = false
        this.selectSubmit = false
        this.selectCopy = false
        this.selectTweet = false
        alert(error)
      }
    },
    // memuat: dari textarea copydanpaste ini
    memuat() {
      this.arraytrends = []
      this.allCheckboxesEnabled = 0
      
      let trends = ''

      let i = 0
      this.twittertrends.forEach((value, index) => {
        this.arraytrends.push({
          name: value.name,
          url: value.url,
          tweet_volume: value.tweet_volume,
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
        this.selectHasil = true
        this.selectCopy = true
        this.selectTweet = true

        this.count = 280 - trends.length
      } else if (this.twittertrends === 0 && trends == '') {
        trends = 'Tidak ada hasil'
        this.selectHasil = false
        this.selectCopy = false
        this.selectTweet = false

        this.count = 280
      }
      
      this.hasil = trends
      this.isCopyAndCountTweet()
    },
    
    // button: submit dan copy
    btnSubmit() {
      this.selectHasil = false
      this.selectCopy = false

      // textarea hasil: loading...
      this.hasil = 'Loading...'

      this.memuat()
    },
    // sama GetDayTrends:btnCopy()
    btnCopy() {
      if (this.hasil == '' || this.hasil == 'Tidak ada hasil') {
        return
      }
      
      this.$refs.hasil.select()
      // Untuk perangkat seluler
      this.$refs.hasil.setSelectionRange(0, 99999);
    
      navigator.clipboard.writeText(this.hasil);
    },
    // sama GetDayTrends:btnTweet()
    btnTweet() {
      if (this.hasil.length > 280) {
        this.selectTweet = false
        return
      }
      const UTF8_hash = this.hasil.replaceAll("#", "%23")
      window.open("https://twitter.com/intent/tweet?text="+UTF8_hash, "_blank")
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
        this.selectHasil = true
        this.selectCopy = true
        this.selectTweet = true

        this.selectCheckBoxAll = false

        this.hasil = TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length-2)
        this.count = 280 - this.hasil.length
        this.isCopyAndCountTweet()
      } else {
        this.arraytrends.forEach((val, index) => {
          this.arraytrends[index].completed = false
        })

        this.count = 280
        this.hasil = 'Tidak ada hasil'
        this.isCopyAndCountTweet()
        this.allCheckboxesEnabled = 0

        this.selectHasil = false
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
        if (this.hasil === 'Tidak ada hasil') {
          this.hasil =  TAGS + name
          // pilih hasil, button copy dan button tweet: true
          this.selectHasil = true
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

          this.hasil = TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length-2)
          this.isCopyAndCountTweet()

          this.allCheckboxesEnabled++
        }

        this.count = 280 - this.hasil.length
      } else {
        const kananKoma = `${name}, `
        const kiriKoma = `, ${name}`
        const keduanyaKoma = `, ${name}, `

        let melepas = ''
        if (this.hasil.includes(kananKoma)) {
          melepas = kananKoma
        } else if (this.hasil.includes(kiriKoma)) {
          melepas = kiriKoma
        } else if (this.hasil.includes(keduanyaKoma)) {
          melepas = keduanyaKoma
        } else {
          // melepas = text 
          this.hasil = 'Tidak ada hasil'
          // pilih hasil, button copy dan button tweet: false
          this.selectHasil = false
          this.selectCopy = false
          this.selectTweet = false
          this.count = 280

          this.allCheckboxesEnabled = 0
          return
        }
        this.hasil = this.hasil.replace(melepas, '')

        this.count = 280 - this.hasil.length
        this.isCopyAndCountTweet()

        this.allCheckboxesEnabled--
      }
    },

    // Slots - Vue.js
    // https://vuejs.org/guide/components/slots.html#scoped-slots
    // sama GetDayTrends:isCountTweet()

    // adalah textarea hitungan dan tombol tweet
    isCopyAndCountTweet() {
      if (this.hasil === '' || this.hasil === 'Tidak ada hasil' 
        || this.hasil.length > 280) { 
        this.selectCopy = false
        this.selectTweet = false
      } else {
        this.selectCopy = true
        this.selectTweet = true
      }
    }
  }
}
</script>

<template>
  <h2 style="margin-top: 10px; margin-bottom: 0px;">Twitter Trends (Bekasi, Indonesia)</h2>
  <button @click="btnSubmit" data-test="btn-submit" :disabled="isSubmit">Submit</button>
  <br>

  <h3 style="margin-top: 10px; margin-bottom: 5px;">Hasil</h3>
  <textarea v-model="hasil" data-test="hasil" ref="hasil" rows="5" cols="50" 
    placeholder="Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ..." :disabled="isHasil"></textarea>
  <br>
  <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
  <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">Tweet is: <small v-if="hasil.length < 280">+</small> {{count}}</button>
  <br>
  
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
    <small class="tweet-volume-class">{{ trends.tweet_volume !== null ? `(${trends.tweet_volume} tweets)` : '' }}</small>
  </div>

  <br>
  <p style="margin-top: -5px; margin-bottom: 5px; color: red;">Platform Pengembang untuk Saya (Twitter API v2): tidak bisa trends/place API ❌</p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: green;">
    Platform Pengembang untuk <a href="https://github.com/guilhermefront/Twitter-Trending" target="_blank">Github: @guilhermefront</a> (Twitter API Standard v1.1): ada trends/place API  ✅
  </p>
</template>