<script setup>
import { ref, defineModel, computed } from "vue";
import { TAGS } from "../utils/utils.js";

// model: results
const results = defineModel("results");
const ok = ref(false);
const selectResults = ref(false);
const isResults = computed(() => {
  if (props.isResultsOpen) {
    if (!ok.value) {
      ok.value = true;
      count.value = 280 - results.value?.length;
      allCheckboxesEnabled.value = props.arraytrends?.length;
      copyTweetBoolFunc(true);

      return !selectResults;
    }

    if (allCheckboxesEnabled.value == 0 || results.value == "Tidak ada hasil") {
      count.value = 280;
      allCheckboxesEnabled.value = 0;
      copyTweetBoolFunc(false);
      return selectResults;
    }

    count.value = 280 - results.value?.length;
    copyTweetBoolFunc(true);
    return !selectResults;
  } else {
    copyTweetBoolFunc(false);
    return selectResults;
  }
});
// watch(results, () => {
//   if (results.value == "" || results.value == "Tidak ada hasil") {
//     copyTweetBoolFunc(false);
//     count.value = 280;
//     return;
//   }

//   copyTweetBoolFunc(true);
//   count.value = 280 - results.value?.length;
// });

// function setWatchResults(e, v = e.target.value) {...}
function setWatchResults() {
  if (results.value == "" || results.value == "Tidak ada hasil") {
    copyTweetBoolFunc(false);
    count.value = 280;
    return;
  }

  copyTweetBoolFunc(true);
  count.value = 280 - results.value?.length;
}

// button Copy
const selectCopy = ref(false);
const isCopy = computed(() => !selectCopy.value);
function btnCopy() {
  const tmpResultsField = document.getElementById("results");
  tmpResultsField.select();
  // Untuk perangkat seluler
  tmpResultsField.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(results.value);
}
function copyTweetBoolFunc(rule) {
  selectResults.value = rule;
  selectCopy.value = rule;
  selectTweet.value = rule;
}

// button Tweet
const selectTweet = ref(false);
const isTweet = computed(() => !selectTweet.value);
const count = ref(280);
function btnTweet() {
  if (results.value?.length > 280) {
    selectTweet.value = false;
    return;
  }
  const UTF8_hash = results.value.replaceAll("#", "%23");
  window.open("https://twitter.com/intent/tweet?text=" + UTF8_hash, "_blank");
}

const props = defineProps(["newTweet", "arraytrends", "isResultsOpen"]);

// pilih `semua kotak centang`: true atau false
const selectCheckBoxAll = ref(false);
// sama GetDayTrends:trendsChanged(event, index)
// berubah dalam array untuk trends
function trendsChanged(event, index) {
  const name = props.arraytrends[index].name;

  if (event.target.checked) {
    if (results.value == "Tidak ada hasil") {
      results.value =
        (props.newTweet != "" ? props.newTweet + "\n\n" : "") + TAGS + name;
      // pilih hasil, button copy dan button tweet: true
      count.value = 280 - results.value?.length;
      allCheckboxesEnabled.value = 1;
      copyTweetBoolFunc(true);
    } else {
      let newArrayTrendsName = "";

      for (const trend of props.arraytrends) {
        if (trend.completed !== false) {
          newArrayTrendsName += `${trend.name}, `;
        }
      }

      results.value =
        (props.newTweet != "" ? props.newTweet + "\n\n" : "") +
        TAGS +
        newArrayTrendsName.substring(0, newArrayTrendsName?.length - 2);

      count.value = 280 - results.value.length;
      allCheckboxesEnabled.value++;
      copyTweetBoolFunc(true);
    }
  } else {
    const rightComma = `${name}, `;
    const leftComma = `, ${name}`;
    const bothComma = `, ${name}, `;

    let release = "";
    if (results.value.includes(rightComma)) {
      release = rightComma;
    } else if (results.value.includes(leftComma)) {
      release = leftComma;
    } else if (results.value.includes(bothComma)) {
      release = bothComma;
    } else {
      // melepas = text
      results.value = "Tidak ada hasil";
      // pilih hasil, button copy dan button tweet: false
      count.value = 280;
      allCheckboxesEnabled.value = 0;
      copyTweetBoolFunc(false);
      return;
    }
    results.value = results.value.replace(release, "");

    count.value = 280 - results.value.length;
    allCheckboxesEnabled.value--;
    copyTweetBoolFunc(true);
  }
}
// `semua kotak centang` diaktifkan
const allCheckboxesEnabled = ref(0);
// adalah button `semua kotak centang`: true atau false
const isCheckBoxAll = computed(() => !selectCheckBoxAll.value);
// button `semua kotak centang`
function btnCheckBoxAll() {
  if (selectCheckBoxAll.value) {
    let newArrayTrendsName = "";
    allCheckboxesEnabled.value = 0;

    for (const arrayts of props.arraytrends) {
      arrayts.completed = true;
      newArrayTrendsName += `${arrayts.name}, `;
      allCheckboxesEnabled.value++;
    }
    selectCheckBoxAll.value = false;
    results.value =
      (props.newTweet != "" ? props.newTweet + "\n\n" : "") +
      TAGS +
      newArrayTrendsName.substring(0, newArrayTrendsName?.length - 2);
    count.value = 280 - results.value?.length;
    copyTweetBoolFunc(true);
  } else {
    props.arraytrends.forEach((val, index) => {
      props.arraytrends[index].completed = false;
    });
    allCheckboxesEnabled.value = 0;
    selectCheckBoxAll.value = true;
    results.value = "Tidak ada hasil";
    count.value = 280;
    copyTweetBoolFunc(false);
  }
}
</script>

<template>
  <h3 style="margin-top: 10px; margin-bottom: 5px">Hasil</h3>
  <textarea
    v-model="results"
    id="results"
    data-test="results"
    rows="5"
    cols="50"
    placeholder="Test #1 Two THREE

Tags: Aksi Cepat Tanggap, Axelsen, Desta, Oknum, Motor, ...
"
    @change="setWatchResults"
    :disabled="isResults"
  ></textarea>
  <br />
  <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
  <button @click="btnTweet" data-test="btn-tweet" :disabled="isTweet">
    Tweet is: <small v-if="results?.length < 280">+</small> {{ count }}
  </button>
  <br />

  <template v-if="props.arraytrends?.length > 0">
    <h4>
      Kotak Centang:
      <button @click="btnCheckBoxAll()" data-test="btn-checkbox-all">
        {{ !isCheckBoxAll ? "diaktifkan" : "tidak diaktifkan" }}
      </button>
    </h4>

    <p
      style="margin-top: -20px; margin-bottom: 5px"
      data-test="all-checkboxes-enabled"
    >
      diaktifkan: {{ allCheckboxesEnabled }}
    </p>

    📌
    <div
      v-for="(trends, index) in props.arraytrends"
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
      <small class="tweet-volume-class">{{
        trends.tweet_volume !== 0 ? `(${trends.tweet_volume})` : ""
      }}</small>
      -
      <small class="trending-topics-class">{{ trends.trending_topics }}</small>
    </div>
  </template>
</template>
