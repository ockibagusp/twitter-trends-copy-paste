import { test, expect, beforeAll, afterAll, describe } from 'vitest'

import { mount } from '@vue/test-utils'
import ResultsModel from '../Results.model.vue'
import arrayT from './arraytrends.js'
import resultsT from './resultsText.js'

describe('ResultsModel mount component', async () => {
  const wrapper = mount(ResultsModel, {
    props: {
      newTweet: '',
      arraytrends: [],
      isResultsOpen: false
    }
  })

  const results = wrapper.find('[data-test="results"]')
  // button: btnCopy dan btnTweet
  const btnCopy = wrapper.find('[data-test="btn-copy"]')
  const btnTweetCreate = wrapper.find('[data-test="btn-tweet-create"]')
  const btnTweetWebIntent = wrapper.find('[data-test="btn-tweet-web-intent"]')
  const count = wrapper.find('[data-test="count"]')

  test('ResultsModel init', () => {
    // let wrapper = null;
    // beforeAll(async () => {
    //   wrapper = shallowMount(ResultsModel, {
    //     props: {
    //       ...
    //     }
    //   })
    // })

    // afterAll(() => {
    //   wrapper.unmount()
    // })

    expect(ResultsModel).toBeTruthy()
    expect(results.element.value).toEqual('');

    const newTweetProp = wrapper.props('newTweet')
    expect(newTweetProp).toEqual('')

    expect(results.attributes().disabled).toBe('')
    expect(btnCopy.attributes().disabled).toBe('')
    expect(btnTweetCreate.attributes().disabled).toBe('')
    expect(btnTweetWebIntent.attributes().disabled).toBe('')
    // why +280?
    expect(count.text()).toEqual('280')

    const arrayTrendsProp = wrapper.props('arraytrends')
    expect(arrayTrendsProp).toEqual([])
  })

  test('ResultsModel failure', () => {
    results.setValue(resultsT.failureText)
    expect(results.element.value).toEqual(resultsT.failureText);

    const newTweetProp = wrapper.props('newTweet')
    expect(newTweetProp).toEqual('')

    expect(btnCopy.attributes().disabled).toBe('')
    expect(btnTweetCreate.attributes().disabled).toBe('')
    expect(btnTweetWebIntent.attributes().disabled).toBe('')
    // why +280?
    expect(count.text()).toEqual('280')

    const arrayTrendsProp = wrapper.props('arraytrends')
    expect(arrayTrendsProp).toEqual([])
  })

  test('ResultsModel success: props not a newTweet', async () => {
    await wrapper.setProps({
      newTweet: "",
      arraytrends: arrayT.success,
      isResultsOpen: true
    });

    results.setValue(resultsT.success)
    expect(results.element.value).toEqual(resultsT.success);

    await results.trigger('change')

    const newTweetProp = wrapper.props("newTweet")
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]')
    const arrayTrendsProp = wrapper.props("arraytrends")
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetProp).toEqual("")
    expect(btnCheckBoxAll.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAll.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsProp).toEqual(arrayT.success)
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < arrayTrendsProp.length; i++) {
      expect(arrayTrendsProp.at(i)).toEqual(arrayT.success.at(i))
    }
  });

  test("ResultsModel success: props all", async () => {
    await wrapper.setProps({
      newTweet: "Author 1",
      arraytrends: arrayT.success,
      isResultsOpen: true
    })

    const resultsTextSuccess = `Author 1\n\n${resultsT.success}`;
    results.setValue(resultsTextSuccess)
    expect(results.element.value).toEqual(resultsTextSuccess);

    await results.trigger('change')

    const newTweetProp = wrapper.props("newTweet")
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]')
    const arrayTrendsProp = wrapper.props("arraytrends")
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetProp).toEqual("Author 1")
    expect(btnCheckBoxAll.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAll.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsProp).toEqual(arrayT.success)
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < arrayTrendsProp.length; i++) {
      expect(arrayTrendsProp.at(i)).toEqual(arrayT.success.at(i))
    }
  })

  test('ResultsModel success: props not a newTweet', async () => {
    await wrapper.setProps({
      newTweet: "",
      arraytrends: arrayT.success,
      isResultsOpen: true
    })

    results.setValue(resultsT.success)
    expect(results.element.value).toEqual(resultsT.success);

    await results.trigger('change')

    const newTweetProp = wrapper.props("newTweet")
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]')
    const arrayTrendsProp = wrapper.props("arraytrends")
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetProp).toEqual("")
    expect(btnCheckBoxAll.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAll.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsProp).toEqual(arrayT.success)
    expect(allCheckboxesEnabled.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < 5; i++) {
      expect(arrayTrendsProp.at(i)).toEqual(arrayT.success.at(i))
    }
  });

  test('ResultsModel success: props not a newTweet and props a newTweet', async () => {
    // Test 1
    await wrapper.setProps({
      newTweet: "",
      arraytrends: arrayT.success,
      isResultsOpen: true
    })

    const resultsA = wrapper.find('[data-test="results"]')
    resultsA.setValue(resultsT.success)
    await resultsA.trigger('change')

    const newTweetPropA = wrapper.props("newTweet")
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAllA = wrapper.find('[data-test="btn-checkbox-all"]')
    const arrayTrendsPropA = wrapper.props("arraytrends")
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabledA = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetPropA).toEqual("")
    expect(btnCheckBoxAllA.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAllA.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsPropA).toEqual(arrayT.success)
    expect(allCheckboxesEnabledA.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < 5; i++) {
      expect(arrayTrendsPropA.at(i)).toEqual(arrayT.success.at(i))
    }

    // Test 2
    await wrapper.setProps({
      newTweet: "Test",
      arraytrends: arrayT.success,
      isResultsOpen: true
    })

    const resultsB = wrapper.find('[data-test="results"]')
    resultsB.setValue(resultsT.success)
    await resultsB.trigger('change')

    const newTweetPropB = wrapper.props("newTweet")
    // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
    const btnCheckBoxAllB = wrapper.find('[data-test="btn-checkbox-all"]')
    const arrayTrendsPropB = wrapper.props("arraytrends")
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabledB = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetPropB).toEqual("Test")
    expect(btnCheckBoxAllB.attributes().disabled).toBeUndefined() // enabled
    expect(btnCheckBoxAllB.text()).toEqual('tidak diaktifkan')
    expect(arrayTrendsPropB).toEqual(arrayT.success)
    expect(allCheckboxesEnabledB.text()).toEqual('diaktifkan: 5')

    for (let i = 0; i < 5; i++) {
      expect(arrayTrendsPropB.at(i)).toEqual(arrayT.success.at(i))
    }

    expect(btnCopy.attributes().disabled).toBe(undefined)
    expect(btnTweetCreate.attributes().disabled).toBe(undefined)
    expect(btnTweetWebIntent.attributes().disabled).toBe(undefined)
    expect(count.text()).toEqual('232')
  });

  test('ResultsModel failure: the character limit', async () => {
    const TESTFAILURE = "Test Failure"
    await wrapper.setProps({
      newTweet: TESTFAILURE,
      arraytrends: arrayT.failureTags,
      isResultsOpen: true
    })

    // Test 1
    let results = wrapper.find('[data-test="results"]')
    results.setValue(TESTFAILURE + '\n\n' + resultsT.failureTags)
    await results.trigger('change')

    let newTweetProp = wrapper.props("newTweet")
    let arrayTrendsProp = wrapper.props("arraytrends")

    expect(newTweetProp).toEqual(TESTFAILURE)
    expect(results.element.value).toEqual(TESTFAILURE + '\n\n' + resultsT.failureTags)
    expect(arrayTrendsProp).toEqual(arrayT.failureTags)

    expect(btnCopy.attributes().disabled).toBe('')
    expect(btnTweetCreate.attributes().disabled).toBe('')
    expect(btnTweetWebIntent.attributes().disabled).toBe('')
    expect(btnTweetWebIntent.text()).toEqual('Tweet Web Intent')
    expect(count.text()).toEqual('-195')

    // init
    await wrapper.setProps({
      newTweet: '',
      arraytrends: [],
      isResultsOpen: true
    })
    newTweetProp = wrapper.props('newTweet')
    expect(newTweetProp).toEqual('')

    results.setValue('')
    await results.trigger('change')
    expect(results.element.value).toEqual('');
    // ?
    // expect(btnTweet.text()).toEqual('Tweet is: +280')

    // Test 2
    await wrapper.setProps({
      newTweet: TESTFAILURE + '#',
      arraytrends: arrayT.failureTags,
      isResultsOpen: true
    })

    newTweetProp = wrapper.props('newTweet')
    expect(newTweetProp).toEqual('Test Failure#')
    console.log('#Tweet is', btnTweetWebIntent.text());

    results.setValue(TESTFAILURE + '#\n\n' + resultsT.failureTags)
    await results.trigger('change')
    expect(results.element.value).toEqual(TESTFAILURE + '#\n\n' + resultsT.failureTags)

    expect(btnCopy.attributes().disabled).toBe('')
    expect(btnTweetCreate.attributes().disabled).toBe('')
    expect(btnTweetWebIntent.attributes().disabled).toBe('')
    expect(count.text()).toEqual('-195')
  });

  test("ResultsModel success: checkbox or uncheckbox Tags and Comma Mark", async () => {
    const wrapper = mount(ResultsModel, {
      props: {
        newTweet: '',
        arraytrends: arrayT.success,
        isResultsOpen: true
      }
    })

    const isTags = wrapper.find('[data-test="is-tags"]')
    const isCommaMark = wrapper.find('[data-test="is-comma-mark"')

    const resultsTextSuccess = `Author 2\n\n${resultsT.success}`;
    results.setValue(resultsTextSuccess)
    expect(results.element.value).toEqual(resultsTextSuccess);

    await results.trigger('change')

    const arrayTrendsProp = wrapper.props("arraytrends")
    for (let i = 0; i < arrayTrendsProp.length; i++) {
      expect(arrayTrendsProp.at(i)).toEqual(arrayT.success.at(i))
    }

  })

  test('ResultsModel success: allCheckboxesEnabled is disabled and enabled', async () => {
    const wrapper = mount(ResultsModel, {
      props: {
        newTweet: '',
        arraytrends: arrayT.success,
        isResultsOpen: true
      }
    })

    // // ?
    // await wrapper.setProps({
    //   newTweet: "",
    //   arraytrends: arrayT.success,
    //   isResultsOpen: true
    // })

    const results = wrapper.find('[data-test="results"]')
    // button: btnCopy dan btnTweet
    const btnCopy = wrapper.find('[data-test="btn-copy"]')
    const btnTweetCreate = wrapper.find('[data-test="btn-tweet-create"]')
    const btnTweetWebIntent = wrapper.find('[data-test="btn-tweet-web-intent"]')
    const count = wrapper.find('[data-test="count"]')

    results.setValue(resultsT.success)
    await results.trigger('change')

    const newTweetProp = wrapper.props("newTweet")
    const arrayTrendsProp = wrapper.props("arraytrends")
    const checkboxTrends = wrapper.findAll('[data-test="trends-checkbox"]')
    // `semua kotak centang` diaktifkan
    const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

    expect(newTweetProp).toEqual('')
    expect(results.element.value).toEqual('Tags: Test Zero, Test 1, Test 2, #Test3, #Test 4')
    expect(btnTweetCreate.attributes().disabled).toBe(undefined)
    expect(btnTweetWebIntent.attributes().disabled).toBe(undefined)
    expect(btnTweetWebIntent.text()).toEqual('Tweet Web Intent')
    expect(count.text()).toEqual('232')

    // test cases
    const testCases = [
      // unchecked
      {
        name: 'unchecked ke-Test 2',
        index: 2,
        checkbox: false,
        listBool: [true, true, false, true, true],
        results: 'Tags: Test Zero, Test 1, #Test3, #Test 4',
        isResults: undefined,
        countIs: '240',
        // `semua kotak centang` diaktifkan
        allCheckboxesEnabled: 'diaktifkan: 4',
        btnCopy: true,
        btnTweet: true
      },
      {
        name: 'unchecked ke-#Test 4',
        index: 4,
        checkbox: false,
        listBool: [true, true, false, true, false],
        results: 'Tags: Test Zero, Test 1, #Test3',
        isResults: undefined,
        countIs: '249',
        allCheckboxesEnabled: 'diaktifkan: 3',
        btnCopy: true,
        btnTweet: true
      },
      {
        name: 'unchecked ke-Test 1',
        index: 1,
        checkbox: false,
        listBool: [true, false, false, true, false],
        results: 'Tags: Test Zero, #Test3',
        isResults: undefined,
        countIs: '257',
        allCheckboxesEnabled: 'diaktifkan: 2',
        btnCopy: true,
        btnTweet: true
      },
      {
        name: 'unchecked ke-#Test3',
        index: 3,
        checkbox: false,
        listBool: [true, false, false, false, false],
        results: 'Tags: Test Zero',
        isResults: undefined,
        countIs: '265',
        allCheckboxesEnabled: 'diaktifkan: 1',
        btnCopy: true,
        btnTweet: true
      },
      {
        name: 'unchecked ke-Test Zero',
        index: 0,
        checkbox: false,
        listBool: [false, false, false, false, false],
        results: 'Tidak ada hasil',
        isResults: '',
        countIs: '280',
        allCheckboxesEnabled: 'diaktifkan: 0',
        btnCopy: false,
        btnTweet: false
      },
      // checked
      {
        name: 'checked ke-#Test3',
        index: 3,
        checkbox: true,
        listBool: [false, false, false, true, false],
        results: 'Tags: #Test3',
        isResults: undefined,
        btnCopy: true,
        countIs: '268',
        allCheckboxesEnabled: 'diaktifkan: 1',
        btnTweet: true
      },
      {
        name: 'checked ke-Test 1',
        index: 1,
        checkbox: true,
        listBool: [false, true, false, true, false],
        results: 'Tags: Test 1, #Test3',
        isResults: undefined,
        countIs: '260',
        allCheckboxesEnabled: 'diaktifkan: 2',
        btnCopy: true,
        btnTweet: true
      },
    ]

    for (let test of testCases) {
      console.debug(test.name)
      await checkboxTrends.at(test.index).setValue(test.checkbox)

      for (let i = 0; i < test.listBool.length; i++) {
        if (test.listBool[i]) {
          expect(arrayTrendsProp.at(i).completed).toEqual(true)
        } else {
          expect(arrayTrendsProp.at(i).completed).toEqual(false)
        }
      }

      expect(results.element.value).toEqual(test.results)
      expect(results.attributes().disabled).toBe(test.isResults)
      expect(count.text()).toEqual(test.countIs)
      // `semua kotak centang` diaktifkan
      expect(allCheckboxesEnabled.text()).toEqual(test.allCheckboxesEnabled)

      if (test.btnCopy) {
        expect(btnCopy.attributes().disabled).toBe(undefined)
      } else {
        expect(btnCopy.attributes().disabled).toBe('')
      }
    }
  })

  test('ResultsModel success: btnCheckBoxAll is enabled and disabled', async () => {
    await wrapper.setProps({
      newTweet: "Test",
      arraytrends: arrayT.success,
      isResultsOpen: true
    })

    results.setValue(resultsT.success)
    await results.trigger('change')

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
})
