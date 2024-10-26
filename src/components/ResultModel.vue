<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { type Trend, RESULTCODE } from '../interface'
import { TAGS, JOIN } from '../utils/utils'

const props = defineProps({
  initialNewTweet: { type: String, default: '' },
  initialArrayTrends: { type: Array<Trend>, default: [] },
  initialOther: { type: String, default: '' },
  initialResultTrends: { type: String, default: '' },
  initialResultCode: { type: Number, default: 0 }
})

const arrayTrends: Trend[] = []

// model: result
const result = ref<string>('')
const selectResult = ref(false)
const isResult = computed(() => !selectResult.value)
const ok = ref(false)

var i = 0
watchEffect(async () => {
  // ????
  if (props.initialResultCode == RESULTCODE.OK) {
    props.initialArrayTrends.forEach((trend, index) => {
      arrayTrends[index] = trend
    })
    // ??
    ok.value = true

    result.value = toResult()

    count.value = 280 - result.value.length
    allCheckboxesEnabled.value = arrayTrends.length
    copyTweetBoolFunc(true)

    setTimeout(btnCopy, 100)
  } else if (props.initialResultCode == RESULTCODE.ERROR) {
    console.log('props.isResultOpen undefined')
    // result.value = '...'
    // await new Promise((resolve) => setTimeout(resolve, 500))
    result.value = 'No result'
    copyTweetBoolFunc(false)
    count.value = 280
  } else {
    result.value = ''
    copyTweetBoolFunc(false)
    count.value = 280
  }

  console.log(i++)
})

const toResult = function (): string {
  let _newTrends = props.initialNewTweet
  let _tagsResult = props.initialResultTrends == '' ? '' : `${TAGS} ${props.initialResultTrends}`
  let _other = props.initialOther

  if (_newTrends.length != 0 && _tagsResult.length != 0 && _other.length != 0)
    return `${_newTrends}\n\n${_tagsResult}\n\n${_other}`
  else if (_newTrends.length != 0 && _other.length != 0) return `${_newTrends}\n\n${_other}`
  else if (_newTrends.length != 0) return `${_newTrends}\n\n${_tagsResult}`
  else if (_other.length != 0) return `${_tagsResult}\n\n${_other}`
  else return _tagsResult
}

// watch(result, () => {
//   if (result.value == "" || result.value == "Tidak ada hasil") {
//     copyTweetBoolFunc(false);
//     count.value = 280;
//     return;
//   }

//   copyTweetBoolFunc(true);
//   count.value = 280 - result.value?.length;
// });

// function setWatchResult(e, v = e.target.value) {...}
// function setWatchResult() {
//   console.log('setWatchResult')

//   if (result.value == '' || result.value == 'Tidak ada hasil') {
//     copyTweetBoolFunc(false)
//     count.value = 280
//     return
//   }

//   copyTweetBoolFunc(true)
//   count.value = 280 - result.value.length
// }

// button Copy
const selectCopy = ref(false)
const isCopy = computed(() => !selectCopy.value)
function btnCopy() {
  const tmpResultField = document.getElementById('result')
  tmpResultField.select()
  // Untuk perangkat seluler
  tmpResultField.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(result.value)
}
function copyTweetBoolFunc(rule: boolean) {
  selectResult.value = rule
  selectCopy.value = rule
  selectTweet.value = rule
}

// button Tweet
const selectTweet = ref(false)
const isTweet = computed(() => !selectTweet.value)
const count = ref(280)
const selectTags = ref(false)
const isTags = computed(() => !selectTags.value)
const selectCommaMark = ref(false)
const isCommaMark = computed(() => !selectCommaMark.value)
function btnTweetCreate() {
  window.open('https://twitter.com/compose/tweet', '_blank')
}
function btnTweetWebIntent() {
  if (result.value?.length > 280) {
    selectTweet.value = false
    return
  }

  // ???? tqweqr
  const UTF8_hash = result.value.replaceAll('#', '%23')
  window.open('https://twitter.com/intent/tweet?text=' + UTF8_hash, '_blank')
}

// pilih `semua kotak centang`: true atau false
const selectCheckBoxAll = ref(false)
// sama GetDayTrends:trendsChanged(event, index)
// berubah dalam array untuk trends
function trendsChanged(event, index) {
  const name = arrayTrends[index].name

  if (event.target.checked) {
    if (result.value == 'Tidak ada hasil') {
      result.value =
        (props.initialNewTweet != '' ? props.initialNewTweet + '\n\n' : '') + TAGS + name
      // pilih hasil, button copy dan button tweet: true
      count.value = 280 - result.value?.length
      allCheckboxesEnabled.value = 1
      copyTweetBoolFunc(true)
    } else {
      let newArrayTrendsName = ''

      for (const trend of arrayTrends.value) {
        if (trend.completed !== false) {
          newArrayTrendsName += `${trend.name}, `
        }
      }

      result.value =
        (props.initialNewTweet != '' ? props.initialNewTweet + '\n\n' : '') +
        TAGS +
        newArrayTrendsName.substring(0, newArrayTrendsName?.length - 2)

      count.value = 280 - result.value.length
      allCheckboxesEnabled.value++
      copyTweetBoolFunc(true)
    }
  } else {
    const rightComma = `${name}, `
    const leftComma = `, ${name}`
    const bothComma = `, ${name}, `

    let release = ''
    if (result.value.includes(rightComma)) {
      release = rightComma
    } else if (result.value.includes(leftComma)) {
      release = leftComma
    } else if (result.value.includes(bothComma)) {
      release = bothComma
    } else {
      // melepas = text
      result.value = 'Tidak ada hasil'
      // pilih hasil, button copy dan button tweet: false
      count.value = 280
      allCheckboxesEnabled.value = 0
      copyTweetBoolFunc(false)
      return
    }
    result.value = result.value.replace(release, '')

    count.value = 280 - result.value.length
    allCheckboxesEnabled.value--
    copyTweetBoolFunc(true)
  }
}
// `semua kotak centang` diaktifkan
const allCheckboxesEnabled = ref(0)
// adalah button `semua kotak centang`: true atau false
const isCheckBoxAll = computed(() => !selectCheckBoxAll.value)
// button `semua kotak centang`
function btnCheckBoxAll() {
  // ???
  if (selectCheckBoxAll.value) {
    let newArrayTrendsName = ''
    allCheckboxesEnabled.value = 0

    for (const arrayts of arrayTrends) {
      arrayts.completed = true
      newArrayTrendsName += `${arrayts.name}, `
      allCheckboxesEnabled.value++
    }
    selectCheckBoxAll.value = false
    result.value =
      (props.initialNewTweet != '' ? props.initialNewTweet + '\n\n' : '') +
      TAGS +
      newArrayTrendsName.substring(0, newArrayTrendsName?.length - 2)
    count.value = 280 - result.value?.length
    copyTweetBoolFunc(true)
  } else {
    arrayTrends.forEach((val, index) => {
      arrayTrends[index].completed = false
    })
    allCheckboxesEnabled.value = 0
    selectCheckBoxAll.value = true
    result.value = 'No result'
    count.value = 280
    copyTweetBoolFunc(false)
  }
}
</script>

<template>
  <h3 style="margin-top: 10px; margin-bottom: 5px">Result</h3>
  <textarea
    v-model="result"
    id="result"
    data-test="result"
    rows="7"
    cols="50"
    placeholder="Author #1 One ONE

Tags: Test 1, Test Two, #Test THREE, ...

Other...
"
    @change="toResult"
    :disabled="isResult"
  ></textarea>
  <br />
  <button @click="btnCopy" data-test="btn-copy" :disabled="isCopy">Copy</button>
  <button @click="btnTweetCreate" data-test="btn-tweet-create" :disabled="isTweet">
    Tweet Create
  </button>
  <button @click="btnTweetWebIntent" data-test="btn-tweet-web-intent" :disabled="isTweet">
    Tweet Web Intent
  </button>

  <small style="margin-left: 5px" v-if="result?.length < 280">+</small>
  <ins data-test="count">{{ count }}</ins>

  <br />

  <template v-if="props.initialArrayTrends.length != 0 && props.initialResultTrends.length != 0">
    ✂️
    <input style="margin-top: 12px" type="checkbox" v-model="isTags" data-test="is-tags" />
    <s>Tags:</s> ...
    <input type="checkbox" v-model="isCommaMark" data-test="is-comma-mark" />
    <s>,</s> ...
    <br />
    <h4>
      Kotak Centang:
      <button @click="btnCheckBoxAll()" data-test="btn-checkbox-all">
        {{ !isCheckBoxAll ? 'diaktifkan' : 'tidak diaktifkan' }}
      </button>
    </h4>

    <p style="margin-top: -20px; margin-bottom: 5px" data-test="all-checkboxes-enabled">
      diaktifkan: {{ allCheckboxesEnabled }}
    </p>

    <!-- const foo = {a: '', b: '', c: '', ...} -->
    <!-- ... v-for="{a, b, c, ...} in foo" ...-->

    📌
    <div
      v-for="(trends, index) in arrayTrends"
      :key="trends.name"
      data-test="array-trends"
      :class="[trends.completed ? 'completed' : '']"
      @change="trendsChanged($event, index)"
    >
      <input type="checkbox" v-model="trends.completed" data-test="trends-checkbox" />
      <a :href="trends.url" target="_blank">{{ trends.name }}</a>
      <small class="tweet-volume-class">{{
        trends.tweetVolume !== '' ? `(${trends.tweetVolume})` : ''
      }}</small>
      -
      <small class="trending-topics-class">{{ trends.trendingTopic }}</small>
    </div>
  </template>
</template>
