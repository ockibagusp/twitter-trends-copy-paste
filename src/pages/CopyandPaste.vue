<script setup>
import { ref } from "vue";
// // JS is good, JS analysis is not
// import { Headers, NewTweetAndPasteModel, ResultsModel } from "../components";
import Headers from "../components/Header.vue";
import NewTweetAndPasteModel from "../components/NewTweetAndPaste.model.vue";
import ResultsModel from "../components/Results.model.vue";
import { TAGS } from "../utils/utils.js";

/**
 * reactive state
 */
// textarea: copydanpaste, tweet baru dan hasil
const newTweet = ref("");
const copyAndPaste = ref("");
const results = ref("");

// // TODO:
// // document.execCommand('copy');
// // document.execCommand("selectAll");
// setTimeout(() => {
//   console.log("selectAll: ok");
//   document.execCommand("selectAll");
// }, 8000);

// array untuk trends
const arraytrends = ref([]);
</script>

<template>
  <Headers />
  <NewTweetAndPasteModel
    v-model:newTweet="newTweet"
    v-model:copyAndPaste="copyAndPaste"
    v-bind:arraytrends="arraytrends"
  />
  <ResultsModel
    v-model:results="results"
    :newTweet="newTweet"
    :arraytrends="arraytrends"
  />
</template>
