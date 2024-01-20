<script setup>
// Slots - Vue.js
// https://vuejs.org/guide/components/slots.html#scoped-slots

// Vue.js Scoped Slots & Renderless Components
// https://www.youtube.com/watch?v=6cn3xyK4Alk

import { ref, defineModel, watch, computed } from "vue";

const results = defineModel("results");

// methods
function btnCopy() {
  if (results.value == "" || results.value == "Tidak ada hasil") {
    return;
  }

  const tmpResultsField = document.getElementById("results");
  tmpResultsField.select();
  // Untuk perangkat seluler
  tmpResultsField.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(results.value);
}

function btnTweet() {
  if (results.value.length > 280) {
    selectTweet.value = false;
    return;
  }
  const UTF8_hash = results.value.replaceAll("#", "%23");
  window.open("https://twitter.com/intent/tweet?text=" + UTF8_hash, "_blank");
}

function copyTweetBoolFunc(rule) {
  selectResults.value = rule;
  selectCopy.value = rule;
  selectTweet.value = rule;
}

const count = ref(280);

// pilih hasil: true atau false
const selectResults = ref(false);
const selectCopy = ref(false);
const selectTweet = ref(false);

// computed
const isResults = computed(() => !selectResults.value);
const isCopy = computed(() => !selectCopy.value);
const isTweet = computed(() => !selectTweet.value);

watch(results, () => {
  if (results.value == "" || results.value == "Tidak ada hasil") {
    copyTweetBoolFunc(false);
    count.value = 280;
    return;
  }

  count.value = 280 - results.value.length;
  if (count.value >= 0) copyTweetBoolFunc(true);
  else copyTweetBoolFunc(false);
});
</script>

<template>
  <h3 style="margin-top: 10px; margin-bottom: 5px">Hasil</h3>
  <textarea
    v-model="results"
    id="results"
    data-test="results"
    rows="5"
    cols="50"
    placeholder="Test

Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ...
"
    :disabled="isResults"
  ></textarea>
  <br />
  <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
  <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">
    Tweet is: <small v-if="results.length < 280">+</small> {{ count }}
  </button>
  <br />
</template>
