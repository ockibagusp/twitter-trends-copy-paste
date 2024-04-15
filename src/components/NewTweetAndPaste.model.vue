<script setup>
import { ref, defineModel, computed } from "vue";

// model: newTweet and copyAndPaste
const newTweet = ref("");
// // watch([copyAndPaste, () => newTweet.value], ([newX, newY]) => {...});
function setNewTweetOnSubmit(event, value = event.target.value) {
  newTweet.value = value;

  if (results.value != "") setCarry();
  else results.value = "Tidak ada hasil";
}

const copyAndPaste = ref("");
/**
 * functions that mutate state and trigger updates
 */
// memuat: textarea dari copydanpaste ini
function setCopyAndPasteOnSubmit() {
  selectResults.value = false;
  props.arraytrends = [];
  let trends = "";
  // TODO: function regexTweets
  // regex101.com
  const regex =
    /(Sedang tren dalam topik (.+)|Trending in (.+)|(.+) Popular|(.+) Populer|(.+) Trending|Trending|Sedang tren)\n?\n(.+)\n?\n([\d.,]+.*)?/gm;

  const str = copyAndPaste.value;
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
        // sama, props.arraytrends[i] = {...}
        props.arraytrends.push({
          trending_topics: match,
          name: "",
          url: "",
          tweet_volume: "",
          completed: true,
        });
      }

      // name hash: misalnya, #TimnasIndonesia
      if (groupIndex === 7) {
        props.arraytrends[i].name = match;
        // replace
        let encodedUrl = match.replaceAll("#", "%23");
        // // replace all '%'' to '%25'
        // .replaceAll('%', "%25")
        props.arraytrends[i].url = "https://twitter.com/search?q=" + encodedUrl;

        trends += `${match}, `;
      }
      // jumlah tweet: misalnya, 7,153 Tweets
      if (groupIndex === 8) {
        if (match !== undefined) props.arraytrends[i].tweet_volume = match;
      }
    });

    i++;
  }

  // 'Oknum, Motor, ' ke 'Oknum, Motor'
  if (props.arraytrends.length != 0) {
    selectResults.value = true;
    trends =
      (newTweet.value != "" ? newTweet.value + "\n\n" : "") +
      TAGS +
      trends.substring(0, trends.length - 2);
  } else if (str != "" && props.arraytrends.length == 0) {
    trends = "Tidak ada hasil";
  }

  results.value = trends;
}

const selectResults = ref(false);

const emits = defineEmits(["newTweetSubmitted", "copyAndPasteSubmitted"]);

const props = defineProps({
  arraytrends: {
    type: Array,
    required: true,
  },
});

// button: reset, copy dan `semua kotak centang`
function btnReset() {
  copyAndPaste.value = "";

  // autofocus
  const tmpNewTweetField = document.getElementById("new-tweet");
  tmpNewTweetField.select();

  newTweet.value = "";
  results.value = "";
  selectResults.value = false;
  props.arraytrends = [];
}
</script>

<template>
  <h3>Tweet baru</h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="newTweet"
    id="new-tweet"
    data-test="new-tweet"
    cols="50"
    rows="2"
    placeholder="Test #1 Two THREE"
    @change="setNewTweetOnSubmit"
    autofocus
  ></textarea>
  <br />

  <h3 style="margin-top: -2px">Paste [ctrl + v]...</h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="copyAndPaste"
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
    @change="setCopyAndPasteOnSubmit"
  ></textarea>
  <br />
  <button @click="btnReset" data-test="btn-reset">Reset</button>
  <br />
</template>
