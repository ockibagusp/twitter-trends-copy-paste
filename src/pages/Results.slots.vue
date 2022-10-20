<script>
export default {
  props: {
    // textarea: hasil
    results: String,
    // tweet dihasil maks. 280 karakter
    count: Number,
    selectResults: Boolean,
    selectCopy: Boolean,
    selectTweet: Boolean
  },
  data() {
    return {
      // pilih hasil, button submit, button copy dan button tweet: true atau false
      
    }
  },
  mounted() {
    
  },
  methods: {
     btnCopy() {
      if (this.results == '' || this.results == 'Tidak ada hasil') {
        return
      }
      
      this.$refs.results.select()
      // Untuk perangkat seluler
      this.$refs.results.setSelectionRange(0, 99999);
    
      navigator.clipboard.writeText(this.results);
    },
    btnTweet() {
      if (this.results.length > 280) {
        this.selectTweet = false
        return
      }
      const UTF8_hash = this.results.replaceAll("#", "%23")
      window.open("https://twitter.com/intent/tweet?text="+UTF8_hash, "_blank")
    },
  },
  computed: {
    isResults: function() {
      return !this.selectResults
    },
    isCopy: function() {
      return !this.selectCopy
    },
    isTweet: function() {
      return !this.selectTweet
    },
  }
}
</script>

<template>
  <h3 style="margin-top: 10px; margin-bottom: 5px;">Hasil</h3>
  <textarea v-model="results" data-test="results" ref="results" rows="5" cols="50" 
    placeholder="Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ..." :disabled="isResults"></textarea>
  <br>
  <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
  <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">Tweet is: <small v-if="results.length < 280">+</small> {{count}}</button>
  <br>
</template>

<style scoped>
  
</style>