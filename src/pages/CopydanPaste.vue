<script>
const TAGS = 'Tags: '
// Slots - Vue.js
// https://vuejs.org/guide/components/slots.html#scoped-slots
export default {
  data() {
    return {
      // textarea: copydanpaste dan hasil
      copydanpaste: '',
      hasil: '',
      // array untuk trends
      arraytrends: [],
      // tweet dihasil maks. 280 karakter
      count: 280,
      // pilih hasil dan button copy: true atau false
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
    // adalah hasil dan button copy: true atau false
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
  watch: {
    // textarea: copydanpaste
    copydanpaste() {
      // textarea hasil: loading...
      this.hasil = 'Loading...'
      
      // vue methods: memuat
      this.memuat()
    }
  },
  methods: {
    // memuat: dari textarea copydanpaste ini
    memuat() {
      this.arraytrends = []
      this.allCheckboxesEnabled = 0
      let trends = ''
      // regex101.com
      const regex = /(Sedang tren dalam topik (.+)|Trending in (.+)|(.+) Popular|(.+) Populer|(.+) Trending)\n?\n(.+)\n?\n([\d.,]+.*)?/gm
      
      const str = this.copydanpaste
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
              trendingTopics: match,
              name: '',
              url: '',
              tweetVolume: 0,
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
              this.arraytrends[i].tweetVolume = match
          }
        })
        
        this.allCheckboxesEnabled++
        i++
      }
      // 'Oknum, Motor, ' ke 'Oknum, Motor'
      if (this.arraytrends.length != 0) {
        trends = TAGS + trends.substring(0, trends.length-2)
        this.selectHasil = true
        this.selectCopy = true
        this.selectTweet = true
        this.count = 280 - trends.length
      } else if (str != '' && this.arraytrends.length == 0) {
        trends = 'Tidak ada hasil'
        this.selectHasil = false
        this.selectCopy = false
        this.selectTweet = false
        this.count = 280
      }
      
      this.hasil = trends
      this.isCopyAndCountTweet()
    },
    
    // button: reset, copy dan `semua kotak centang`
    btnReset() {
      this.copydanpaste = ''
      // autofocus
      this.$refs.copydanpaste.focus()
      this.hasil = ''
      this.selectCopy = false
      this.selectTweet = false
      this.arraytrends = []
      this.count = 280
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
        for (let i = 0; i < this.arraytrends.length; i++) {
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
  <h2 style="margin-top: 10px; margin-bottom: 25px;">Twitter Trends (Indonesia atau Inggris)</h2>
  <h3 style="margin-top: -25px; margin-bottom: 25px;">>> Copy dan Paste!</h3>

  <p style="margin-top: -18px; margin-bottom: 5px;"> <a href="https://twitter.com/i/trends" target="_blank">twitter.com/i/trends</a> + (Select All [ctrl + a] dan Copy [ctrl + c])</p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: green;">web browser (PC, Laptop, Android dan iOS: Chrome, Firefox, dll) ✅</p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: red;">aplikasi Android dan iOS ❌</p>

  <h3>Paste [ctrl + v]...</h3>
    <textarea style="margin-top: -15px; margin-bottom: 5px;" v-model="copydanpaste" ref="copydanpaste" data-test="copydanpaste" rows="8" cols="50" 
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
  <button @click="btnReset" data-test="btnReset">Reset</button>
  <br>

  <h3>Hasil</h3>
  <textarea style="margin-top: -15px; margin-bottom: 5px;" v-model="hasil" data-test="hasil" ref="hasil" rows="5" cols="50" 
    placeholder="Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ..." :disabled="isHasil"></textarea>
  <br>
  <button @click="btnCopy" data-test="btnCopy" :disabled="isCopy">Copy</button>
  <button @click="btnTweet" data-test="btnTweet" :disabled="isTweet">Tweet is: <small v-if="hasil.length < 280">+</small> {{count}}</button>
  <br>
  
  <h4 v-if="arraytrends.length > 0">Kotak Centang: 
    <button @click="btnCheckBoxAll()" data-test="btnCheckBoxAll">
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
    data-test="arrayTrends"
    :class="[trends.completed ? 'completed' : '']"
    @change="trendsChanged($event, index)"
  >
    <input
      type="checkbox"
      v-model="trends.completed"
      data-test="trends-checkbox"
    />
    <a :href="trends.url" target="_blank">{{ trends.name }}</a>
    <small class="tweetVolume-class">{{ trends.tweetVolume !== 0 ? `(${trends.tweetVolume})` : '' }}</small>
    -
    <small class="trendingTopics-class">{{ trends.trendingTopics }}</small>
  </div>
</template>
