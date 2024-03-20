<script setup>
import { ref } from "vue";
import ResultsModel from "../components/Results.model.vue";
import { TAGS } from "../utils/utils.js";

/**
 * reactive state
 */
// textarea: copydanpaste, tweet baru dan hasil
const newTweet = ref("");
const copyandpaste = ref("");
const results = ref("");
const selectResults = ref(false);

// textarea: new-tweet and copydanpaste;
// // watch([copyandpaste, () => newTweet.value], ([newX, newY]) => {...});
function setNewTweet(event, value = event.target.value) {
  newTweet.value = value;

  if (results.value != "") setCarry();
  else results.value = "Tidak ada hasil";
}

/**
 * functions that mutate state and trigger updates
 */
// memuat: textarea dari copydanpaste ini
function setCarry() {
  selectResults.value = false;
  arraytrends.value = [];
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
          tweet_volume: "0",
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

    i++;
  }

  // 'Oknum, Motor, ' ke 'Oknum, Motor'
  if (arraytrends.value.length != 0) {
    selectResults.value = true;
    trends =
      (newTweet.value != "" ? newTweet.value + "\n\n" : "") +
      TAGS +
      trends.substring(0, trends.length - 2);
  } else if (str != "" && arraytrends.value.length == 0) {
    trends = "Tidak ada hasil";
  }

  results.value = trends;
}

// // TODO:
// // document.execCommand('copy');
// // document.execCommand("selectAll");
// setTimeout(() => {
//   console.log("selectAll: ok");
//   document.execCommand("selectAll");
// }, 8000);

// array untuk trends
const arraytrends = ref([]);

// button: reset, copy dan `semua kotak centang`
function btnReset() {
  copyandpaste.value = "";

  // autofocus
  const tmpNewTweetField = document.getElementById("new-tweet");
  tmpNewTweetField.select();

  newTweet.value = "";
  results.value = "";
  selectResults.value = false;
  arraytrends.value = [];
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
    id="new-tweet"
    data-test="new-tweet"
    cols="50"
    rows="2"
    placeholder="Test #1 Two THREE"
    @change="setNewTweet"
    autofocus
  ></textarea>
  <br />

  <h3 style="margin-top: -2px">Paste [ctrl + v]...</h3>
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
    @change="setCarry"
  ></textarea>
  <br />
  <button @click="btnReset" data-test="btn-reset">Reset</button>
  <br />
  <ResultsModel
    v-model:results="results"
    :newTweet="newTweet"
    :arraytrends="arraytrends"
    :isResultsOpen="selectResults"
  />
</template>
