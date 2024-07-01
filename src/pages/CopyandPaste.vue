<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// // JS is good, JS analysis is not good
// import { HeaderHtml, NewTweetAndPasteModel, ResultsModel } from '../components'
import HeaderHtml from '../components/HeaderHtml.vue'
import NewTweetAndPasteModel from '../components/NewTweetAndPasteModel.vue'
import ResultModel from '../components/ResultModel.vue'
import { type Trend, type TextAreaData, RESULTCODE } from '../interface'

/**
 * reactive state
 */
// textarea: tweet baru dan hasil
const newTweet = ref<string>('')
let arrayTrends: Trend[] = []
const other = ref<string>('')
const resultTrends = ref<string>('')
const resultCode = ref<number>(RESULTCODE.DEFAULT)

const handleTextAreasSubmitted = (textareasSubmitted: TextAreaData) => {
  newTweet.value = textareasSubmitted.newTweet || ''
  arrayTrends = textareasSubmitted.arrayTrends
  other.value = textareasSubmitted.other || ''
  resultTrends.value = textareasSubmitted.resultTrends || ''
  resultCode.value = textareasSubmitted.resultCode
}

// const router = useRouter()
// const route = useRoute()

// onMounted(() => {
//   getUrlQueryParams()
// })
// const getUrlQueryParams = async () => {
//   await router.isReady()
//   const queryOther = route.query?.other
//   console.log('queryOther', queryOther)
//   if (queryOther != undefined) {
//     other.value = queryOther.toString()
//   }
// }

// // TODO:
// document.execCommand('copy')
// document.execCommand('selectAll')
// setTimeout(() => {
//   console.log('selectAll: ok')
//   document.execCommand('selectAll')
// }, 8000)
</script>

<template>
  <HeaderHtml />
  <NewTweetAndPasteModel @onTextareasSubmitted="handleTextAreasSubmitted" />
  <ResultModel
    :initialNewTweet="newTweet"
    :initialArrayTrends="arrayTrends"
    :initialOther="other"
    :initialResultTrends="resultTrends"
    :initialResultCode="resultCode"
  />
</template>
