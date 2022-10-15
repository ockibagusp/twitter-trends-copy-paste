<script>
import axios from 'axios'

const TAGS = 'Tags: '

// Slots - Vue.js
// https://vuejs.org/guide/components/slots.html#scoped-slots

export default {
  data() {
    return {
      // data getdaytrends.com
      getdaytrends: '',
      // textarea: hasil
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
    // textarea: getdaytrends
    getdaytrends() {
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
        const res = await axios.get('https://twitter-trends-redirect.herokuapp.com/url')
        this.getdaytrends = res.data

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
    // memuat: dari textarea getdaytrends ini
    memuat() {
      this.arraytrends = []
      this.allCheckboxesEnabled = 0

      let trends = ''

      // TODO: regex without "
      // regex101.com
      const regex = /<td class="main"><a (class="string" )?href="[^"]+">([^'"]+)<\/a><div class="desc"><span class="small text-muted">(Under )?(\d*\.\d+K tweets|\d+\.\d*K tweets|\d+K tweets)<\/span><\/div><\/td>/gm
      
      const str = this.getdaytrends
      
      let m;

      let i = 0
      while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          if (groupIndex === 2) {
            // unescape HTML
            const unescapeHtml = match
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, "\"")
              .replace(/&#39;/g, "'")

            // replace
            let encodedUrl = unescapeHtml
              .replaceAll('#', "%23")
              .replaceAll(' ', '+')
              // // replace all '%'' to '%25'
              // .replaceAll('%', "%25")
            this.arraytrends[i] = {
              name: unescapeHtml,
              url: 'https://twitter.com/search?q=' + encodedUrl,
              tweet_volume: '',
              completed: true
            }

            trends += `${unescapeHtml}, `
          }

          if (groupIndex === 3) {
            if (match !== undefined)
              this.arraytrends[i].tweet_volume = `${match}`
          }

          // Misalnya: 20K
          if (groupIndex === 4) {
            this.arraytrends[i].tweet_volume += match
          }
        })
        
        this.allCheckboxesEnabled++
        i++
        // trends getdaytrends.com: no. 1-15
        if (i === 15 && this.allCheckboxesEnabled === 15) {
          break
        }
      }

      // 'Oknum, Motor, ' ke 'Oknum, Motor'
      if (trends != '') {
        trends = TAGS + trends.substring(0, trends.length-2)
        this.selectHasil = true
        this.selectCopy = true
        this.selectTweet = true

        this.count = 280 - trends.length
      } if (str != '' && trends == '') {
        trends = 'Tidak ada hasil'
        this.selectHasil = false
        this.selectCopy = false
        this.selectTweet = false

        this.count = 280
      }
      
      this.hasil = trends
      this.isCountTweet()
    },

    // button: submit dan copy
    btnSubmit() {
      this.selectHasil = false
      this.selectCopy = false

      // textarea hasil: loading...
      this.hasil = 'Loading...'

      this.memuat()
    },
    // sama CopydanPaste:btnCopy()
    btnCopy() {
      if (this.hasil == '' || this.hasil == 'Tidak ada hasil') {
        return
      }
      
      this.$refs.hasil.select()
      // Untuk perangkat seluler
      this.$refs.hasil.setSelectionRange(0, 99999);
    
      navigator.clipboard.writeText(this.hasil);
    },
    // sama CopydanPaste:btnTweet()
    btnTweet() {
      if (this.hasil.length > 280) {
        this.selectTweet = false
        return
      }
      const UTF8_hash = this.hasil.replaceAll("#", "%23")
      window.open("https://twitter.com/intent/tweet?text="+UTF8_hash, "_blank")
    },
    // sama CopydanPaste:btnCheckBoxAll()

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
        this.isCountTweet()
      } else {
        this.arraytrends.forEach((val, index) => {
          this.arraytrends[index].completed = false
        })

        this.count = 280
        this.hasil = 'Tidak ada hasil'
        this.isCountTweet()
        this.allCheckboxesEnabled = 0

        this.selectHasil = false
        this.selectCopy = false
        this.selectTweet = false        
        this.selectCheckBoxAll = true
      }
    },

    // sama CopydanPaste:trendsChanged(event, index)

    // berubah dalam array untuk trends
    trendsChanged(event, index) {
      const name = this.arraytrends[index].name

      if (event.target.checked) {
        if (this.hasil === 'Tidak ada hasil') {
          this.hasil =  TAGS + name
          // pilih hasil, button copy dan button tweet: true
          this.selectHasil = true
          this.selectCopy = true
          
          this.allCheckboxesEnabled = 1
        } else {
          let newArrayTrendsName = ''
          for (let i = 0; i < this.arraytrends.length; i++) {
            if (this.arraytrends[i].completed !== false) {
              newArrayTrendsName += `${this.arraytrends[i].name}, `
            }
          }

          this.hasil = TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length-2)
          this.isCountTweet()
          
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
        this.isCountTweet()
      
        this.allCheckboxesEnabled--
      }
    },

    // Slots - Vue.js
    // https://vuejs.org/guide/components/slots.html#scoped-slots
    // sama CopydanPaste:isCountTweet()

    // adalah textarea hitungan dan tombol tweet
    isCountTweet() {
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
  <h2 style="margin-top: 10px; margin-bottom: -5px;">GetDayTrends.com!</h2>
  <p style="margin-top: 0px; margin-bottom: 10px;"> <a href="https://getdaytrends.com/indonesia/bekasi/" target="_blank">getdaytrends.com/indonesia/bekasi/</a> </p>

  <button @click="btnSubmit" data-test="btn-submit" :disabled="isSubmit">Submit</button>
  <br>
  
  <h3 style="margin-top: 10px; margin-bottom: 5px;">Hasil</h3>
  <textarea v-model="hasil" data-test="hasil" ref="hasil" rows="5" cols="50" 
    placeholder="Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ..." :disabled="isHasil"></textarea>
  <br>
  <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
  <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">Tweet is: <small v-if="hasil.length < 280">+</small> {{count}}</button>
  <br>

  <h4 style="margin-top: 15px; margin-bottom: 5px;" v-if="arraytrends.length > 0">Tren Sekarang</h4>
  <h4 style="margin-top: -3px; margin-bottom: 5px;" v-if="arraytrends.length > 0">Kotak Centang: 
    <button @click="btnCheckBoxAll()" data-test="btn-checkbox-all">
      {{ !isCheckBoxAll ? 'diaktifkan': 'tidak diaktifkan' }}
    </button>    
  </h4>
  
  <p style="margin-top: -10px; margin-bottom: 5px;" v-if="arraytrends.length > 0" data-test="all-checkboxes-enabled">
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
    <small>{{ trends.tweet_volume !== 0 ? `(${trends.tweet_volume})` : '' }}</small>
  </div>
</template>

