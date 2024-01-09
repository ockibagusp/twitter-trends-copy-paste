<script setup>
import { ref, computed, watch } from "vue";
import ResultsSlots from "../components/Results.slots.vue";

const TAGS = "Tags: ";
// Slots - Vue.js
// https://vuejs.org/guide/components/slots.html#scoped-slots

/**
 * reactive state
 */
// textarea: copydanpaste, tweet baru dan hasil
const newTweet = ref("Test");
const copyandpaste = ref(`
...
>>> Indonesia

Sedang tren dalam topik Indonesia
(Indonesia) Menpan RB
Olahraga · Populer
(Indonesia) #TimnasIndonesia
2.233 rb Tweet
Sedang tren dalam topik Indonesia
(Indonesia) Yayasan Aksi Cepat Tanggap
1.660 Tweet

>>> Inggris
Trending in Indonesia
(Inggris) Menpan RB
Trending in Indonesia
(Inggris) #TimnasIndonesia
10.9K Tweets
Entertainment · Trending
(Inggris) Yayasan Aksi Cepat Tanggap
54.5 Tweets`);

const results = ref("");
// tweet dihasil maks. 280 karakter
const count = ref(280);
// array untuk trends
const arraytrends = ref([]);

// ?
// kotak centang: boolean
const showCheckboxs = ref(false);

// pilih hasil: true atau false
const selectResults = ref(false);
const selectCopy = ref(false);
const selectTweet = ref(false);

// pilih `semua kotak centang`: true atau false
const selectCheckBoxAll = ref(false);

// `semua kotak centang` diaktifkan
const allCheckboxesEnabled = ref(0);

/**
 * computed
 */
// adalah hasil dan button copy: true atau false
const isResults = computed(() => {
  return !selectResults.value;
});
const isCopy = computed(() => !selectCopy.value);
const isTweet = computed(() => !selectTweet.value);
// adalah button `semua kotak centang`: true atau false
const isCheckBoxAll = computed(() => !selectCheckBoxAll.value);

/**
 * watch
 */
// textarea: copydanpaste;
// // watch([copyandpaste, () => newTweet.value], ([newX, newY]) => {
watch([copyandpaste, () => newTweet.value], () => {
  results.value = "Loading...";
  // vue methods: memuat
  carry();
});

// // TODO:
// // document.execCommand('copy');
// // document.execCommand("selectAll");
// setTimeout(() => {
//   console.log("selectAll: ok");
//   document.execCommand("selectAll");
// }, 8000);

/**
 * functions that mutate state and trigger updates
 */
// memuat: dari textarea copydanpaste ini
function carry() {
  arraytrends.value = [];
  allCheckboxesEnabled.value = 0;
  let trends = "";
  // TODO: function regexTweets
  // regex101.com
  const regex =
    /(Sedang tren dalam topik (.+)|Trending in (.+)|(.+) Popular|(.+) Populer|(.+) Trending|Trending|Sedang tren)\n?\n(.+)\n?\n([\d.,]+.*)?/gm;

  const str = copyandpaste.value;
  let m;
  let i = 0;
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      // topik yang sedang tren: TODO
      if (groupIndex === 1) {
        // sama, arraytrends[i] = {...}
        arraytrends.value.push({
          trending_topics: match,
          name: "",
          url: "",
          tweet_volume: 0,
          completed: true,
        });
      }

      // name hash: misalnya, #TimnasIndonesia
      if (groupIndex === 7) {
        arraytrends.value[i].name = match;
        // replace
        let encodedUrl = match.replaceAll("#", "%23");
        // // replace all '%'' to '%25'
        // .replaceAll('%', "%25")
        arraytrends.value[i].url = "https://twitter.com/search?q=" + encodedUrl;

        trends += `${match}, `;
      }
      // jumlah tweet: misalnya, 7,153 Tweets
      if (groupIndex === 8) {
        if (match !== undefined) arraytrends.value[i].tweet_volume = match;
      }
    });

    allCheckboxesEnabled.value++;
    i++;
  }

  // 'Oknum, Motor, ' ke 'Oknum, Motor'
  if (arraytrends.value.length != 0) {
    trends =
      (newTweet.value != "" ? newTweet.value + "\n\n" : "") +
      TAGS +
      trends.substring(0, trends.length - 2);
    selectResults.value = true;
    selectCopy.value = true;
    selectTweet.value = true;
    count.value = 280 - trends.length;
  } else if (str != "" && arraytrends.value.length == 0) {
    trends = "Tidak ada hasil";
    selectResults.value = false;
    selectCopy.value = false;
    selectTweet.value = false;
    count.value = 280;
  }

  results.value = trends;
  isCopyAndCountTweet();
}

// button: reset, copy dan `semua kotak centang`
function btnReset() {
  copyandpaste.value = "";
  // autofocus
  // this.$nextTick(() => {
  //   this.$refs.copyandpaste.focus();
  // });
  results.value = "";
  selectCopy.value = false;
  selectTweet.value = false;
  arraytrends.value = [];
  count.value = 280;
}

// sama GetDayTrends:btnCopy()
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

// sama GetDayTrends:btnTweet()
function btnTweet() {
  if (results.value.length > 280) {
    selectTweet.value = false;
    return;
  }
  const UTF8_hash = results.value.replaceAll("#", "%23");
  window.open("https://twitter.com/intent/tweet?text=" + UTF8_hash, "_blank");
}
// sama GetDayTrends:btnCheckBoxAll()

// button `semua kotak centang`
function btnCheckBoxAll() {
  if (selectCheckBoxAll.value) {
    let newArrayTrendsName = "";
    allCheckboxesEnabled.value = 0;

    for (const arrayts of arraytrends.value) {
      arrayts.completed = true;
      newArrayTrendsName += `${arrayts.name}, `;
      allCheckboxesEnabled.value++;
    }
    selectResults.value = true;
    selectCopy.value = true;
    selectTweet.value = true;

    selectCheckBoxAll.value = false;

    results.value =
      (newTweet.value != "" ? newTweet.value + "\n\n" : "") +
      TAGS +
      newArrayTrendsName.substring(0, newArrayTrendsName.length - 2);
    count.value = 280 - results.value.length;
    isCopyAndCountTweet();
  } else {
    arraytrends.value.forEach((val, index) => {
      arraytrends.value[index].completed = false;
    });
    count.value = 280;
    results.value = "Tidak ada hasil";
    isCopyAndCountTweet();
    allCheckboxesEnabled.value = 0;

    selectResults.value = false;
    selectCopy.value = false;
    selectTweet.value = false;
    selectCheckBoxAll.value = true;
  }
}
// sama GetDayTrends:trendsChanged(event, index)
// berubah dalam array untuk trends
function trendsChanged(event, index) {
  const name = arraytrends.value[index].name;

  if (event.target.checked) {
    if (results.value == "Tidak ada hasil") {
      results.value = newTweet.value + "\n\n" + TAGS + name;
      // pilih hasil, button copy dan button tweet: true
      selectResults.value = true;
      selectCopy.value = true;
      selectTweet.value = true;

      allCheckboxesEnabled.value = 1;
    } else {
      let newArrayTrendsName = "";

      for (const trend of arraytrends.value) {
        if (trend.completed !== false) {
          newArrayTrendsName += `${trend.name}, `;
        }
      }

      results.value =
        (newTweet.value != "" ? newTweet.value + "\n\n" : "") +
        TAGS +
        newArrayTrendsName.substring(0, newArrayTrendsName.length - 2);
      isCopyAndCountTweet();

      allCheckboxesEnabled.value++;
    }

    count.value = 280 - results.value.length;
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
      selectResults.value = false;
      selectCopy.value = false;
      selectTweet.value = false;
      count.value = 280;

      allCheckboxesEnabled.value = 0;
      return;
    }
    results.value = results.value.replace(release, "");

    count.value = 280 - results.value.length;
    isCopyAndCountTweet();

    allCheckboxesEnabled.value--;
  }
}

// sama GetDayTrends:isCountTweet()
// adalah textarea hitungan dan tombol tweet
function isCopyAndCountTweet() {
  if (
    results.value == "" ||
    results.value == "Tidak ada hasil" ||
    results.value.length > 280
  ) {
    selectCopy.value = false;
    selectTweet.value = false;
  } else {
    selectCopy.value = true;
    selectTweet.value = true;
  }
}
</script>

<template>
  <h2 style="margin-top: 10px; margin-bottom: 25px">
    Twitter Trends (Indonesia atau Inggris)
  </h2>
  <h3 style="margin-top: -25px; margin-bottom: 25px">>> Copy dan Paste!</h3>

  <p style="margin-top: -18px; margin-bottom: 5px">
    <a href="https://twitter.com/i/trends" target="_blank"
      >twitter.com/i/trends</a
    >
    + (Select All [ctrl + a] dan Copy [ctrl + c])
  </p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: green">
    web browser (PC, Laptop, Android dan iOS: Chrome, Firefox, dll) ✅
  </p>
  <p style="margin-top: -5px; margin-bottom: 5px; color: red">
    aplikasi Android dan iOS ❌
  </p>

  <h3>Tweet baru</h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="newTweet"
    data-test="new-tweet"
    cols="50"
    rows="2"
    placeholder="Test #1 Two THREE"
  ></textarea>
  <br />

  <h3>Paste [ctrl + v]...</h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="copyandpaste"
    id="copyandpaste"
    data-test="copyandpaste"
    cols="50"
    rows="8"
    placeholder="Tren
Sedang tren dalam topik Indonesia
Aksi Cepat Tanggap
10,3 rb Tweet
Sedang tren dalam topik Indonesia
Oknum
3.581 Tweet
Sedang tren dalam topik Indonesia
Motor
44,9 rb Tweet ..."
    autofocus
  ></textarea>
  <br />
  <button @click="btnReset" data-test="btn-reset">Reset</button>
  <br />

  <ResultsSlots :results="results" />

  <template v-if="arraytrends.length > 0">
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
      <small class="tweet-volume-class">{{
        trends.tweet_volume !== 0 ? `(${trends.tweet_volume})` : ""
      }}</small>
      -
      <small class="trending-topics-class">{{ trends.trending_topics }}</small>
    </div>
  </template>
</template>
