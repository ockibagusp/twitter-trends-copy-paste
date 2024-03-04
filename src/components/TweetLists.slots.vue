<script setup>
import { ref, defineModel, watch, computed } from "vue";

const newTweet = defineModel("new-tweet");
const copyandpaste = defineModel("copy-and-paste");
</script>

<template>
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
    v-bind="copyandpaste"
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
</template>
