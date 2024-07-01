import { test, expect, beforeAll, afterAll, describe } from 'vitest'

import { mount } from '@vue/test-utils'
import ResultModel from '../ResultModel.vue'
import { RESULTCODE } from '../../interface'
import { TAGS } from '../../utils/utils'
import * as arrayNewT from './testArrayNewTweetAndPaste.js'
import textAreaDataT from './testTextAreaData.js'
import * as resultT from './testResult.js'

describe('ResultModel mount component', async () => {
  const wrapper = mount(ResultModel, {
    props: {
      initialNewTweet: '',
      initialArrayTrends: [],
      initialOther: '',
      initialResultTrends: '',
      initialResultCode: RESULTCODE.PENDING
    }
  })

  const result = wrapper.find('[data-test="result"]')
  // button: btnCopy dan btnTweet
  const btnCopy = wrapper.find('[data-test="btn-copy"]')
  const btnTweetCreate = wrapper.find('[data-test="btn-tweet-create"]')
  const btnTweetWebIntent = wrapper.find('[data-test="btn-tweet-web-intent"]')
  const count = wrapper.find('[data-test="count"]')

  test('ResultModel init', () => {
    // let wrapper = null;
    // beforeAll(async () => {
    //   wrapper = shallowMount(ResultModel, {
    //     props: {
    //       ...
    //     }
    //   })
    // })

    // afterAll(() => {
    //   wrapper.unmount()
    // })

    expect(ResultModel).toBeTruthy()
    expect(result.element.value).toEqual('')

    const newTweetProp = wrapper.props('initialNewTweet')
    expect(newTweetProp).toEqual('')

    expect(result.attributes().disabled).toBe('')
    expect(btnCopy.attributes().disabled).toBe('')
    expect(btnTweetCreate.attributes().disabled).toBe('')
    expect(btnTweetWebIntent.attributes().disabled).toBe('')
    // why +280?
    expect(count.text()).toEqual('280')

    const arrayTrendsProp = wrapper.props('initialArrayTrends')
    expect(arrayTrendsProp).toEqual([])
  })

  test('ResultModel failure', async () => {
    await wrapper.setProps({
      initialNewTweet: '',
      initialArrayTrends: [],
      initialOther: '',
      initialResultTrends: '',
      initialResultCode: RESULTCODE.ERROR
    })

    expect(result.element.value).toEqual(resultT.failureText)

    const newTweetProp = wrapper.props('initialNewTweet')
    expect(newTweetProp).toEqual('')

    expect(btnCopy.attributes().disabled).toBe('')
    expect(btnTweetCreate.attributes().disabled).toBe('')
    expect(btnTweetWebIntent.attributes().disabled).toBe('')
    // why +280?
    expect(count.text()).toEqual('280')

    const arrayTrendsProp = wrapper.props('initialArrayTrends')
    expect(arrayTrendsProp).toEqual([])
  })

  test('ResultModel success: props not a newTweet', async () => {
    await wrapper.setProps({
      initialNewTweet: '',
      initialArrayTrends: textAreaDataT.success.arrayTrends,
      initialOther: '',
      initialResultTrends: textAreaDataT.success.resultTrends,
      initialResultCode: RESULTCODE.OK
    })

    expect(result.element.value).toEqual(resultT.success)

    const newTweetProp = wrapper.props('initialNewTweet')
    const arrayTrendsProp = wrapper.props('initialArrayTrends')
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]')
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetProp).toEqual('')
    expect(btnCheckBoxAll.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAll.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsProp).toEqual(textAreaDataT.success.arrayTrends)
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < arrayTrendsProp.length; i++) {
      expect(arrayTrendsProp.at(i)).toEqual(textAreaDataT.success.arrayTrends.at(i))
    }
  })

  test('ResultModel success: props not a newTweet and props a newTweet', async () => {
    // Test 1
    await wrapper.setProps({
      initialNewTweet: '',
      initialArrayTrends: textAreaDataT.success.arrayTrends,
      initialOther: '',
      initialResultTrends: textAreaDataT.success.resultTrends,
      initialResultCode: RESULTCODE.OK
    })

    const resultA = wrapper.find('[data-test="result"]')
    expect(resultA.element.value).toEqual(resultT.success)

    const newTweetPropA = wrapper.props('initialNewTweet')
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAllA = wrapper.find('[data-test="btn-checkbox-all"]')
    const arrayTrendsPropA = wrapper.props('initialArrayTrends')
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabledA = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetPropA).toEqual('')
    expect(btnCheckBoxAllA.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAllA.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsPropA).toEqual(textAreaDataT.success.arrayTrends)
    expect(allCheckboxesEnabledA.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < 5; i++) {
      expect(arrayTrendsPropA.at(i)).toEqual(textAreaDataT.success.arrayTrends.at(i))
    }

    // Test 2
    await wrapper.setProps({
      initialNewTweet: textAreaDataT.success.newTweet,
      initialArrayTrends: textAreaDataT.success.arrayTrends,
      initialOther: textAreaDataT.success.other,
      initialResultTrends: textAreaDataT.success.resultTrends,
      initialResultCode: RESULTCODE.OK
    })

    const newTweetPropB = wrapper.props('initialNewTweet')
    const resultPropB = wrapper.props('initialResultTrends')
    const otherPropB = wrapper.props('initialOther')
    const arrayTrendsPropB = wrapper.props('initialArrayTrends')

    const resultB = wrapper.find('[data-test="result"]')
    expect(resultB.element.value).toEqual(`${newTweetPropB}\n\n${TAGS} ${resultPropB}\n\n${otherPropB}`)

    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAllB = wrapper.find('[data-test="btn-checkbox-all"]')
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabledB = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetPropB).toEqual(newTweetPropB)
    expect(otherPropB).toEqual(otherPropB)
    expect(btnCheckBoxAllB.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAllB.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsPropB).toEqual(textAreaDataT.success.arrayTrends)
    expect(allCheckboxesEnabledB.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < 5; i++) {
      expect(arrayTrendsPropB.at(i)).toEqual(textAreaDataT.success.arrayTrends.at(i))
    }

    expect(btnCopy.attributes().disabled).toBe(undefined)
    expect(btnTweetCreate.attributes().disabled).toBe(undefined)
    expect(btnTweetWebIntent.attributes().disabled).toBe(undefined)
    expect(count.text()).toEqual('171')
  })

  test('ResultModel success: props all', async () => {
    await wrapper.setProps({
      initialNewTweet: arrayNewT.success.newTweet,
      initialArrayTrends: textAreaDataT.success.arrayTrends,
      initialOther: textAreaDataT.success.other,
      initialResultTrends: textAreaDataT.success.resultTrends,
      initialResultCode: RESULTCODE.OK
    })

    const resultTextSuccess = `${arrayNewT.success.newTweet}\n\n${resultT.success}\n\nother success (TextAreaData)`
    expect(result.element.value).toEqual(resultTextSuccess)

    const newTweetProp = wrapper.props('initialNewTweet')
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]')
    const arrayTrendsProp = wrapper.props('initialArrayTrends')
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetProp).toEqual(arrayNewT.success.newTweet)
    expect(btnCheckBoxAll.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAll.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsProp).toEqual(textAreaDataT.success.arrayTrends)
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < arrayTrendsProp.length; i++) {
      expect(arrayTrendsProp.at(i)).toEqual(textAreaDataT.success.arrayTrends.at(i))
    }
  })

  // test('ResultModel failure: the character limit', async () => {
  //   const TESTFAILURE = 'Test Failure'
  //   await wrapper.setProps({
  //     initialNewTweet: TESTFAILURE,
  //     initialArrayTrends: textAreaDataT.failureTags.arrayTrends,
  //     initialOther: '',
  //     initialResultTrends: '',
  //     initialResultCode: RESULTCODE.ERROR
  //   })

  //   // Test 1
  //   let result = wrapper.find('[data-test="result"]')
  //   result.setValue(TESTFAILURE + '\n\n' + resultT.failureTags)
  //   await result.trigger('change')

  //   let newTweetProp = wrapper.props('initialNewTweet')
  //   let arrayTrendsProp = wrapper.props('initialArrayTrends')

  //   expect(newTweetProp).toEqual(TESTFAILURE)
  //   expect(result.element.value).toEqual(TESTFAILURE + '\n\n' + resultT.failureTags)
  //   expect(arrayTrendsProp).toEqual(textAreaDataT.failureTags)

  //   expect(btnCopy.attributes().disabled).toBe('')
  //   expect(btnTweetCreate.attributes().disabled).toBe('')
  //   expect(btnTweetWebIntent.attributes().disabled).toBe('')
  //   expect(btnTweetWebIntent.text()).toEqual('Tweet Web Intent')
  //   expect(count.text()).toEqual('-195')

  //   // init
  //   await wrapper.setProps({
  //     initialNewTweet: '',
  //     initialArrayTrends: [],
  //     initialOther: '',
  //     initialResultTrends: '',
  //     initialResultCode: RESULTCODE.ERROR
  //   })
  //   newTweetProp = wrapper.props('initialNewTweet')
  //   expect(newTweetProp).toEqual('')

  //   result.setValue('')
  //   await result.trigger('change')
  //   expect(result.element.value).toEqual('')
  //   // ?
  //   // expect(btnTweet.text()).toEqual('Tweet is: +280')

  //   // Test 2
  //   await wrapper.setProps({
  //     initialNewTweet: TESTFAILURE + '#',
  //     initialArrayTrends: textAreaDataT.failureTags.arrayTrends,
  //     initialOther: '',
  //     initialResultTrends: '',
  //     initialResultCode: RESULTCODE.ERROR
  //   })

  //   newTweetProp = wrapper.props('newTweet')
  //   expect(newTweetProp).toEqual('Test Failure#')
  //   console.log('#Tweet is', btnTweetWebIntent.text())

  //   result.setValue(TESTFAILURE + '#\n\n' + resultT.failureTags)
  //   await result.trigger('change')
  //   expect(result.element.value).toEqual(TESTFAILURE + '#\n\n' + resultT.failureTags)

  //   expect(btnCopy.attributes().disabled).toBe('')
  //   expect(btnTweetCreate.attributes().disabled).toBe('')
  //   expect(btnTweetWebIntent.attributes().disabled).toBe('')
  //   expect(count.text()).toEqual('-195')
  // })

  // test('ResultModel success: checkbox or uncheckbox Tags and Comma Mark', async () => {
  //   const wrapper = mount(ResultModel, {
  //     props: {
  //       initialNewTweet: '',
  //       initialArrayTrends: textAreaDataT.success.arrayTrends,
  //       initialOther: '',
  //       initialResultTrends: textAreaDataT.success.resultTrends,
  //       initialResultCode: RESULTCODE.ERROR
  //     }
  //   })

  //   const isTags = wrapper.find('[data-test="is-tags"]')
  //   const isCommaMark = wrapper.find('[data-test="is-comma-mark"')

  //   const resultTextSuccess = `Author 2\n\n${resultT.success}`
  //   result.setValue(resultTextSuccess)
  //   expect(result.element.value).toEqual(resultTextSuccess)

  //   await result.trigger('change')

  //   const arrayTrendsProp = wrapper.props('initialArrayTrends')
  //   for (let i = 0; i < arrayTrendsProp.length; i++) {
  //     expect(arrayTrendsProp.at(i)).toEqual(textAreaDataT.success.arrayTrends.at(i))
  //   }

  //   isTags.text()
  // })

  test('ResultModel success: btnCheckBoxAll is enabled and disabled', async () => {
    await wrapper.setProps({
      initialNewTweet: 'Test: btnCheckBoxAll is enabled and disabled',
      initialArrayTrends: textAreaDataT.success.arrayTrends,
      initialOther: '',
      initialResultTrends: textAreaDataT.success.resultTrends,
      initialResultCode: RESULTCODE.OK
    })

    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]')
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

    console.debug('btnCheckBoxAll is enabled')
    await btnCheckBoxAll.trigger('click')
    expect(btnCheckBoxAll.text()).toEqual('diaktifkan')
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 0')

    console.debug('btnCheckBoxAll is disabled')
    await btnCheckBoxAll.trigger('click')
    expect(btnCheckBoxAll.text()).toEqual('tidak diaktifkan')
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 5')

    console.debug('btnCheckBoxAll is enabled')
    await btnCheckBoxAll.trigger('click')
    expect(btnCheckBoxAll.text()).toEqual('diaktifkan')
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 0')
  })

  // test('ResultModel success: allCheckboxesEnabled is disabled and enabled', async () => {
  //   await wrapper.setProps({
  //     initialNewTweet: '',
  //     initialArrayTrends: textAreaDataT.success.arrayTrends,
  //     initialOther: '',
  //     initialResultTrends: textAreaDataT.success.resultTrends,
  //     initialResultCode: RESULTCODE.OK
  //   })

  //   // // ?
  //   // await wrapper.setProps({
  //   //   newTweet: "",
  //   //   arraytrends: arrayT.success,
  //   //   isResultOpen: true
  //   // })

  //   // button: btnCopy dan btnTweet
  //   const btnCopy = wrapper.find('[data-test="btn-copy"]')
  //   const btnTweetCreate = wrapper.find('[data-test="btn-tweet-create"]')
  //   const btnTweetWebIntent = wrapper.find('[data-test="btn-tweet-web-intent"]')
  //   const count = wrapper.find('[data-test="count"]')

  //   const newTweetProp = wrapper.props('initialNewTweet')
  //   const arrayTrendsProp = wrapper.props('initialArrayTrends')
  //   const checkboxTrends = wrapper.findAll('[data-test="trends-checkbox"]')
  //   // `semua kotak centang` diaktifkan
  //   const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

  //   expect(newTweetProp).toEqual('')
  //   expect(result.element.value).toEqual(resultT.success)
  //   expect(btnTweetCreate.attributes().disabled).toBe(undefined)
  //   expect(btnTweetWebIntent.attributes().disabled).toBe(undefined)
  //   expect(btnTweetWebIntent.text()).toEqual('Tweet Web Intent')
  //   expect(count.text()).toEqual('232')

  //   // test cases
  //   const testCases = [
  //     // unchecked
  //     {
  //       name: 'unchecked ke-Test 2',
  //       index: 2,
  //       checkbox: false,
  //       listBool: [true, true, false, true, true],
  //       result: 'Tags: Test Zero, Test 1, #Test3, #Test 4',
  //       isResult: undefined,
  //       countIs: '240',
  //       // `semua kotak centang` diaktifkan
  //       allCheckboxesEnabled: 'diaktifkan: 4',
  //       btnCopy: true,
  //       btnTweet: true
  //     },
  //     {
  //       name: 'unchecked ke-#Test 4',
  //       index: 4,
  //       checkbox: false,
  //       listBool: [true, true, false, true, false],
  //       result: 'Tags: Test Zero, Test 1, #Test3',
  //       isResult: undefined,
  //       countIs: '249',
  //       allCheckboxesEnabled: 'diaktifkan: 3',
  //       btnCopy: true,
  //       btnTweet: true
  //     },
  //     {
  //       name: 'unchecked ke-Test 1',
  //       index: 1,
  //       checkbox: false,
  //       listBool: [true, false, false, true, false],
  //       result: 'Tags: Test Zero, #Test3',
  //       isResult: undefined,
  //       countIs: '257',
  //       allCheckboxesEnabled: 'diaktifkan: 2',
  //       btnCopy: true,
  //       btnTweet: true
  //     },
  //     {
  //       name: 'unchecked ke-#Test3',
  //       index: 3,
  //       checkbox: false,
  //       listBool: [true, false, false, false, false],
  //       result: 'Tags: Test Zero',
  //       isResult: undefined,
  //       countIs: '265',
  //       allCheckboxesEnabled: 'diaktifkan: 1',
  //       btnCopy: true,
  //       btnTweet: true
  //     },
  //     {
  //       name: 'unchecked ke-Test Zero',
  //       index: 0,
  //       checkbox: false,
  //       listBool: [false, false, false, false, false],
  //       result: 'Tidak ada hasil',
  //       isResult: '',
  //       countIs: '280',
  //       allCheckboxesEnabled: 'diaktifkan: 0',
  //       btnCopy: false,
  //       btnTweet: false
  //     },
  //     // checked
  //     {
  //       name: 'checked ke-#Test3',
  //       index: 3,
  //       checkbox: true,
  //       listBool: [false, false, false, true, false],
  //       result: 'Tags: #Test3',
  //       isResult: undefined,
  //       btnCopy: true,
  //       countIs: '268',
  //       allCheckboxesEnabled: 'diaktifkan: 1',
  //       btnTweet: true
  //     },
  //     {
  //       name: 'checked ke-Test 1',
  //       index: 1,
  //       checkbox: true,
  //       listBool: [false, true, false, true, false],
  //       result: 'Tags: Test 1, #Test3',
  //       isResult: undefined,
  //       countIs: '260',
  //       allCheckboxesEnabled: 'diaktifkan: 2',
  //       btnCopy: true,
  //       btnTweet: true
  //     }
  //   ]

  //   for (let test of testCases) {
  //     console.debug(test.name)
  //     await checkboxTrends.at(test.index).setValue(test.checkbox)
  //     for (let i = 0; i < test.listBool.length; i++) {
  //       if (test.listBool[i]) {
  //         expect(arrayTrendsProp.at(i).completed).toEqual(true)
  //       } else {
  //         expect(arrayTrendsProp.at(i).completed).toEqual(false)
  //       }
  //     }

  //     expect(result.element.value).toEqual(test.result)
  //     expect(result.attributes().disabled).toBe(test.isResult)
  //     expect(count.text()).toEqual(test.countIs)
  //     // `semua kotak centang` diaktifkan
  //     expect(allCheckboxesEnabled.text()).toEqual(test.allCheckboxesEnabled)

  //     if (test.btnCopy) {
  //       expect(btnCopy.attributes().disabled).toBe(undefined)
  //     } else {
  //       expect(btnCopy.attributes().disabled).toBe('')
  //     }
  //   }
  // })
})
