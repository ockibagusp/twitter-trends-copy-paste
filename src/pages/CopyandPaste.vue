<script>
const TAGS = 'Tags: '
// Slots - Vue.js
// https://vuejs.org/guide/components/slots.html#scoped-slots
export default {
  data() {
    return {
      // textarea: copydanpaste, tweet text dan hasil
      copyandpaste: '',
      tweetText: '',
      resultsTags: '',
      // teks tweet dan hasil tags
      results: '',
      // tweet dihasil maks. 280 karakter
      count: 280,
      // array untuk trends
      arraytrends: [],
     
      // pilih hasil: true atau false
      selectResults: false,
      selectCopy: false,
      selectTweet: false,

      // pilih `semua kotak centang`: true atau false
      selectCheckBoxAll: false,

      // `semua kotak centang` diaktifkan
      allCheckboxesEnabled: 0
    }
  },
  computed: {
    // adalah hasil dan button copy: true atau false
    isResults: function() {
      return !this.selectResults
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
  watch: {
    // textarea: tweetText dan copydanpaste
    tweetText() {
      if (this.tweetText.length !== 0 && this.resultsTags.length !== 0)
        this.count = 280 - (this.tweetText.length + this.resultsTags.length + 1)
      else if (this.tweetText.length !== 0)
        this.count = 280 - this.tweetText.length
      else
        this.count = 280 - this.resultsTags.length
    },
    copyandpaste() {
      // textarea hasil: loading...
      this.resultsTags = 'Loading...'
      
      // vue methods: memuat
      this.carry()
    }
  },
  methods: {
    // memuat: dari textarea copydanpaste ini
    carry() {
      this.arraytrends = []
      this.allCheckboxesEnabled = 0
      let trends = ''
      // regex101.com
      const regex = /(Sedang tren dalam topik (.+)|Trending in (.+)|(.+) Popular|(.+) Populer|(.+) Trending|Trending)\n?\n(.+)\n?\n([\d.,]+.*)?/gm
      
      const str = this.copyandpaste
      let m
      let i = 0
      while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          // topik yang sedang tren: TODO
          if (groupIndex === 1) {
            // sama, this.arraytrends[i] = {...}
            this.arraytrends.push({
              trending_topics: match,
              name: '',
              url: '',
              tweet_volume: 0,
              completed: true
            })
          }
          
          // name hash: misalnya, #TimnasIndonesia
          if (groupIndex === 7) {
            this.arraytrends[i].name = match
            // replace
            let encodedUrl = match
              .replaceAll('#', "%23")
              // // replace all '%'' to '%25'
              // .replaceAll('%', "%25")
            this.arraytrends[i].url = 'https://twitter.com/search?q=' + encodedUrl
            
            trends += `${match}, `
          }
          // jumlah tweet: misalnya, 7,153 Tweets
          if (groupIndex === 8) {
            if (match !== undefined)
              this.arraytrends[i].tweet_volume = match
          }
        })
        
        this.allCheckboxesEnabled++
        i++
      }
      // 'Oknum, Motor, ' ke 'Oknum, Motor'
      if (this.arraytrends.length != 0) {
        trends = TAGS + trends.substring(0, trends.length-2)

        this.results = this.addResults(trends) 
        this.selectResults = true
        this.selectCopy = true
        this.selectTweet = true

        if (this.tweetText.length != 0)
          this.count = 280 - (this.tweetText.length + trends + 1)
        else
          this.count = 280 - trends.length
      } else if (str != '' && this.arraytrends.length == 0) {
        trends = 'Tidak ada hasil'
        this.selectResults = false
        this.selectCopy = false
        this.selectTweet = false
        this.count = 280 - this.tweetText.length
      }
      
      this.resultsTags = trends
      // this.results = this.addResults(trends)
      this.isCopyAndCountTweet()
    },
    
    // button: reset, copy dan `semua kotak centang`
    btnResetTweet() {
      this.tweetText = ''
      // autofocus
      this.$refs.tweetText.focus()
    },
    btnResetTags() {
      this.copyandpaste = ''
      // autofocus
      this.$refs.copyandpaste.focus()
      this.tweetText = ''
      this.resultsTags = ''
      this.selectCopy = false
      this.selectTweet = false
      this.arraytrends = []
      this.count = 280
    },
    // sama GetDayTrends:btnCopy()
    btnCopy() {
      if (this.resultsTags == '' || this.resultsTags == 'Tidak ada hasil') {
        return
      }
      
      // ? tweetText: tidak rentang pilihan
      // this.$refs.tweetText.select()
      // this.$refs.tweetText.setSelectionRange(0, 99999)

      this.$refs.resultsTags.select()
      // Untuk perangkat seluler
      this.$refs.resultsTags.setSelectionRange(0, 99999)
    
      let results
      if (this.tweetText.length !== 0)
        results = this.tweetText + '\n' + this.resultsTags
      else
        results = this.resultsTags
      navigator.clipboard.writeText(results)
    },
    // sama GetDayTrends:btnTweet()
    btnTweet() {
      let length
      if (this.tweetText.length !== 0)
        length = this.tweetText.length + this.resultsTags.length + 1
      else
        length = this.resultsTags.length

      if (length > 280) {
        this.selectTweet = false
        return
      }
      const UTF8_hash = this.results.replaceAll("#", "%23")
      window.open("https://twitter.com/intent/tweet?text="+UTF8_hash, "_blank")
    },
    // sama GetDayTrends:btnCheckBoxAll()
    
    // button `semua kotak centang`
    btnCheckBoxAll() {
      if (this.selectCheckBoxAll === true) {
        let newArrayTrendsName = ''
        this.allCheckboxesEnabled = 0

        for (let i = 0; i < this.arraytrends.length; i++) {
          this.arraytrends[i].completed = true
          newArrayTrendsName += `${this.arraytrends[i].name}, `
          this.allCheckboxesEnabled++
        }
        this.selectResults = true
        this.selectCopy = true
        this.selectTweet = true

        this.selectCheckBoxAll = false
        
        this.resultsTags = TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length-2)
        this.count = 280 - this.resultsTags.length
        this.isCopyAndCountTweet()
      } else {
        this.arraytrends.forEach((val, index) => {
          this.arraytrends[index].completed = false
        })
        this.count = 280
        this.resultsTags = 'Tidak ada hasil'
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
        if (this.resultsTags === 'Tidak ada hasil') {
          this.resultsTags =  TAGS + name
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

          this.resultsTags = TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length-2)
          this.isCopyAndCountTweet()
          
          this.allCheckboxesEnabled++
        }

        this.count = 280 - this.resultsTags.length
      } else {
        const rightComma = `${name}, `
        const leftComma = `, ${name}`
        const bothComma = `, ${name}, `
        
        let release = ''
        if (this.resultsTags.includes(rightComma)) {
          release = rightComma
        } else if (this.resultsTags.includes(leftComma)) {
          release = leftComma
        } else if (this.resultsTags.includes(bothComma)) {
          release = bothComma
        } else {
          // melepas = text 
          this.resultsTags = 'Tidak ada hasil'
          // pilih hasil, button copy dan button tweet: false
          this.selectResults = false
          this.selectCopy = false
          this.selectTweet = false
          this.count = 280
          
          this.allCheckboxesEnabled = 0
          return
        }
        this.resultsTags = this.resultsTags.replace(release, '')
        
        this.count = 280 - this.resultsTags.length
        this.isCopyAndCountTweet()
        
        this.allCheckboxesEnabled--
      }
    },

    // sama GetDayTrends:isCountTweet()
    // adalah textarea hitungan dan tombol tweet
    isCopyAndCountTweet() {
      if (this.resultsTags === '' || this.resultsTags === 'Tidak ada hasil' 
        || this.resultsTags.length > 280) { 
        this.selectCopy = false
        this.selectTweet = false
      } else {
        this.selectCopy = true
        this.selectTweet = true
      }
    },

    addResults(trends) {
      if (this.tweetText.length !== 0)
        return this.tweetText + '\n' + trends
      else
        return trends
    }
  }
}
</script>

<template>
  <h2 style="margin-top: 10px; margin-bottom: 25px">Twitter Trends (Indonesia atau Inggris)</h2>
  <h3 style="margin-top: -25px; margin-bottom: 25px">>> Copy dan Paste!</h3>

  <p style="margin-top: -18px; margin-bottom: 5px"> <a href="https://twitter.com/i/trends" target="_blank">twitter.com/i/trends</a> + (Select All [ctrl + a] dan Copy [ctrl + c])</p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: green;">web browser (PC, Laptop, Android dan iOS: Chrome, Firefox, dll) ✅</p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: red;">aplikasi Android dan iOS ❌</p>

  <h3>Tweet</h3>
  <textarea style="margin-top: -15px; margin-bottom: 5px" v-model="tweetText" data-test="tweet-text" ref="tweetText" rows="3" cols="50" 
    placeholder="Tweet ..."></textarea>
    <br>
  <button @click="btnResetTweet" data-test="btn-reset-tweet">Reset</button>
  <br>

  <h3>Paste [ctrl + v]...</h3>
    <textarea style="margin-top: -15px; margin-bottom: 5px" v-model="copyandpaste" ref="copyandpaste" data-test="copyandpaste" rows="8" cols="50" 
    placeholder="Tren
Sedang tren dalam topik Indonesia
Aksi Cepat Tanggap
10,3 rb Tweet
Sedang tren dalam topik Indonesia
Oknum
3.581 Tweet
Sedang tren dalam topik Indonesia
Motor
44,9 rb Tweet ..." autofocus></textarea>
  <br>
  <button @click="btnResetTags" data-test="btn-reset-tags">Reset</button>
  <br>

  <h3>Tags</h3>
  <!-- data-test="results-tags" => method: this.$refs['results-tags']... -->
  <!-- data-test="resultsTags" => method: this.$refs.resultsTags']... -->
  <textarea style="margin-top: -15px; margin-bottom: 5px" v-model="resultsTags" data-test="results-tags" ref="resultsTags" rows="5" cols="50" 
    placeholder="Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ..." :disabled="isResults"></textarea>
  <br>
  <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
  <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">Tweet is: <small v-if="results.length < 280">+</small> {{count}}</button>
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
    <small class="tweet-volume-class">{{ trends.tweet_volume !== 0 ? `(${trends.tweet_volume})` : '' }}</small>
    -
    <small class="trending-topics-class">{{ trends.trending_topics }}</small>
  </div>
</template>
