<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as intr from '../interface'
import { REGEXTWEETS, HOST } from '../utils/utils'

// model: newTweet and copyAndPaste
const newTweet = ref<string>('')
const copyAndPaste = ref<string>('')
const other = ref<string>('')
let arrayTrends: intr.Trend[] = []

const onSubmit = (): void => {
  let textAreasData: intr.TextAreaData = {
    newTweet: newTweet.value,
    arrayTrends: [],
    other: other.value,
    resultCode: intr.RESULTCODE.PENDING
  }

  if (!copyAndPaste.value) {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  // TODO: function regexTweets
  // regex101.com
  const regex = RegExp(REGEXTWEETS, 'gm')

  let str = copyAndPaste.value
  let regExacArray: RegExpExecArray | null
  let index: number = 0

  while ((regExacArray = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (regExacArray.index === regex.lastIndex) regex.lastIndex++

    // The result can be accessed through the `m`-variable.
    regExacArray.forEach((match: string, groupIndex: number) => {
      // topik yang sedang tren: TODO
      if (groupIndex === 1) {
        // sama, trends[i] = {...}
        arrayTrends[index] = {
          trendingTopic: match,
          name: '',
          url: '',
          tweetVolume: '',
          completed: true
        }
      }

      // name hash: misalnya, #TimnasIndonesia
      if (groupIndex === 7) {
        arrayTrends[index].name = match
        // replace
        let encodedUrl = match.replaceAll('#', '%23')
        // // replace all '%'' to '%25'
        // .replaceAll('%', "%25")
        arrayTrends[index].url = `https://${HOST}/search?q=` + encodedUrl
      }
      // jumlah tweet: misalnya, 7,153 Tweets
      if (groupIndex === 8) {
        if (match !== undefined) arrayTrends[index].tweetVolume = match
      }
    })
    index++
  }

  textAreasData.arrayTrends = arrayTrends

  const resultTrends = setTrendsJoinName()
  if ((str != '' && arrayTrends.length == 0) || 280 < resultTrends.length) {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  textAreasData.resultTrends = resultTrends
  textAreasData.resultCode = intr.RESULTCODE.OK
  emits('onTextareasSubmitted', textAreasData)
}

// TODO: ', ' or ' '
function setTrendsJoinName(join = ', ') {
  let newTrendsName: any[] = []
  arrayTrends.forEach((trend) => {
    newTrendsName.push(trend.name)
  })

  return newTrendsName.join(join)
}

const emits = defineEmits(['onTextareasSubmitted'])

// button: reset, copy dan `semua kotak centang`
async function btnReset() {
  // autofocus
  const tmpNewTweetField = document.getElementById('new-tweet')
  tmpNewTweetField.select()

  newTweet.value = ''
  copyAndPaste.value = ''

  if (!(await getUrlQueryParams())) {
    other.value = ''
  }

  arrayTrends = []

  const textAreasData: intr.TextAreaData = {
    newTweet: '',
    arrayTrends: [],
    other: '',
    resultTrends: '',
    resultCode: intr.RESULTCODE.PENDING
  }

  emits('onTextareasSubmitted', textAreasData)
}

// TODO: to CopyAndPaste.vue
const router = useRouter()
const route = useRoute()

onMounted(() => {
  getUrlQueryParams()
})
const getUrlQueryParams = async (): Promise<boolean> => {
  await router.isReady()
  const queryOther = route.query?.other
  if (queryOther != undefined) {
    other.value = queryOther.toString()
    return true
  }
  return false
}

// // watch([copyAndPaste, () => newTweet.value], ([newX, newY]) => {...});
// function setNewTweet(event: Event, value: string = (event!.target as HTMLInputElement)!.value) {
//   newTweet.value = value
//   setCopyAndPaste()
// }

// memuat: textarea dari copydanpaste ini
/*
Trending in Indonesia
#TimnasDay
Trending with #KuisAlfamartTimnas, #TimnasIndonesia
...
*/
</script>

<template>
  <h3 style="margin-top: 10px">New Tweet</h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="newTweet"
    id="new-tweet"
    data-test="new-tweet"
    cols="50"
    rows="2"
    placeholder="Author #1 One ONE"
    @change="onSubmit"
    autofocus
  ></textarea>

  <h3 style="margin-top: -2px">Paste [ctrl + v]... <sup style="color: red">(required)</sup></h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="copyAndPaste"
    id="copy-and-paste"
    data-test="copy-and-paste"
    cols="50"
    rows="8"
    placeholder="Tren
Sedang tren dalam topik Indonesia
Test 1
10,3 rb Tweet
Sedang tren dalam topik Indonesia
Test Two
3.581 Tweet
Sedang tren dalam topik Indonesia
#Test THREE
44,9 rb Tweet ..."
    @change="onSubmit"
  ></textarea>

  <h3 style="margin-top: -2px">Other...</h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="other"
    id="other"
    data-test="other"
    cols="50"
    rows="1"
    placeholder="Other..."
    @change="onSubmit"
  ></textarea>
  <br />
  <button @click="btnReset" data-test="btn-reset">Reset</button>
</template>
