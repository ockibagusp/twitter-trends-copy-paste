<script setup>
// Slots - Vue.js
// https://vuejs.org/guide/components/slots.html#scoped-slots

// Vue.js Scoped Slots & Renderless Components
// https://www.youtube.com/watch?v=6cn3xyK4Alk

import { ref, defineProps, computed } from "vue";

const props = defineProps({
  // textarea: hasil
  results: {
    type: String,
    required: true,
  },
});

// methods
function btnCopy() {
  if (results == "" || results == "Tidak ada hasil") {
    return;
  }

  const tmpResultsField = document.getElementById("results");
  tmpResultsField.select();
  // Untuk perangkat seluler
  tmpResultsField.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(results.value);
}

function btnTweet() {
  if (results.length > 280) {
    selectTweet.value = false;
    return;
  }
  const UTF8_hash = results.value.replaceAll("#", "%23");
  window.open("https://twitter.com/intent/tweet?text=" + UTF8_hash, "_blank");
}

// const count = ref(0);

// // pilih hasil: true atau false
// const selectResults = ref(false);
// const selectCopy = ref(false);
// const selectTweet = ref(false);

// // computed
// const isResults = computed(() => !selectResults);
// const isCopy = computed(() => !selectCopy);
// const isTweet = computed(() => !selectTweet);
</script>

<template>
  <h3 style="margin-top: 10px; margin-bottom: 5px">Hasil</h3>
  <textarea
    v-model="props.results"
    data-test="results"
    rows="5"
    cols="50"
    placeholder="Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ..."
  ></textarea>
  <br />
  <!-- <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button> -->
  <!-- <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">
    Tweet is: <small v-if="results.length < 280">+</small> {{ count }}
  </button> -->
  <br />
</template>
