<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as intr from '../interface'
import * as lib from '../library'
import { REGEXTWEETS, HOST } from '../utils/utils'

// model: newTweet, copyAndPaste and other
const newTweet = ref<string>('')
const copyAndPaste = ref<string>('')
const other = ref<string>('')
// const arrayTrends.list (ref{list: []})
let arrayTrends: intr.Trend[] = []

let textAreasData: intr.TextAreaData = {
  newTweet: '',
  arrayTrends: [],
  other: '',
  resultTrends: '',
  resultCode: intr.RESULTCODE.DEFAULT
}

const onSubmitNewTweet = async (): Promise<void> => {
  textAreasData.newTweet = newTweet.value
  if (isDefault()) return

  const regExpYouTube = new lib.RegExpYouTube()
  regExpYouTube.setNewTweet(newTweet.value)
  if (await regExpYouTube.isYoutube()) {
    const oldNewTweet = newTweet.value
    newTweet.value = 'Loading...'
    other.value = 'Loading...'

    const titleOnYouTube = await regExpYouTube.getYoutubeInVideoTitle()
    if (titleOnYouTube instanceof Error) {
      newTweet.value = oldNewTweet
      other.value = ''
      // ?
      textAreasData.resultCode = intr.RESULTCODE.ERROR
      emits('onTextareasSubmitted', textAreasData)
      return
    } else {
      newTweet.value = titleOnYouTube
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
      other.value = regExpYouTube.getYoutubeInVideoUrl()

      textAreasData.newTweet = newTweet.value
      textAreasData.other = other.value
      textAreasData.resultCode = intr.RESULTCODE.OK
      emits('onTextareasSubmitted', textAreasData)
      return
    }
  } else {
  }

  if (!copyAndPaste.value && newTweet.value == '') {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  if (!copyAndPaste.value && arrayTrends.length == 0) {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  if (textAreasData.resultTrends.length == 0) {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  textAreasData.resultCode = intr.RESULTCODE.DEFAULT
  emits('onTextareasSubmitted', textAreasData)
}

const onSubmitCopyAndPaste = async (): Promise<void> => {
  if (isDefault()) return

  if (!copyAndPaste.value) {
    arrayTrends = []
    textAreasData.arrayTrends = []
    textAreasData.resultTrends = ''
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  if (!copyAndPaste.value && arrayTrends.length == 0) {
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
  textAreasData.other = other.value

  const resultTrends = setTrendsJoinName()
  if ((str != '' && arrayTrends.length == 0) || 280 < resultTrends.length) {
    textAreasData.resultTrends = ''
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  textAreasData.resultTrends = resultTrends
  textAreasData.resultCode = intr.RESULTCODE.OK
  emits('onTextareasSubmitted', textAreasData)

  // // ??
  // textAreasData.resultCode = intr.RESULTCODE.DEFAULT
  // emits('onTextareasSubmitted', textAreasData)
}

const onSubmitOther = async (): Promise<void> => {
  textAreasData.other = other.value

  if (isDefault()) return

  // ??
  if (copyAndPaste.value != '' && arrayTrends.length == 0) {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  if (!copyAndPaste.value && other.value == '') {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  if (textAreasData.resultTrends.length == 0) {
    textAreasData.resultCode = intr.RESULTCODE.ERROR
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  if (other.value != '') {
    textAreasData.resultCode = intr.RESULTCODE.OK
    emits('onTextareasSubmitted', textAreasData)
    return
  }

  textAreasData.resultCode = intr.RESULTCODE.DEFAULT
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

function isDefault(): boolean {
  if (!newTweet.value && !copyAndPaste.value && !other.value) {
    arrayTrends = []
    emits('onTextareasSubmitted', {
      newTweet: '',
      arrayTrends: [],
      other: '',
      resultTrends: '',
      resultCode: intr.RESULTCODE.DEFAULT
    })
    return true
  }

  return false
}

// button: reset, copy dan `semua kotak centang`
async function btnReset() {
  // autofocus
  const tmpNewTweetField = document.getElementById('new-tweet')
  tmpNewTweetField?.select()

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
    resultCode: intr.RESULTCODE.DEFAULT
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
...
*/
</script>

<template>
  <h3 style="margin-top: 10px">New Tweet <sup>(youtube watching or nothing)</sup></h3>
  <textarea
    style="margin-top: -15px; margin-bottom: 5px"
    v-model="newTweet"
    id="new-tweet"
    data-test="new-tweet"
    cols="50"
    rows="2"
    placeholder="Author #1 One ONE"
    @change="onSubmitNewTweet"
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
    @change="onSubmitCopyAndPaste"
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
    @change="onSubmitOther"
  ></textarea>
  <br />
  <button @click="btnReset" data-test="btn-reset">Reset</button>
</template>
