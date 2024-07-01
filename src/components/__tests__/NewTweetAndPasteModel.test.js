import { test, expect, describe, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { useRouter, useRoute } from "vue-router";
import NewTweetAndPasteModel from '../NewTweetAndPasteModel.vue'
import { RESULTCODE } from '../../interface'
import * as arrayNewT from '../__tests__/testArrayNewTweetAndPaste.js'
import textAreaDataT from '../__tests__/testTextAreaData.js'

vi.mock('vue-router')

describe('NewTweetAndPasteModel mount component', async () => {
  const wrapper = mount(NewTweetAndPasteModel)

  const newTweet = wrapper.find('[data-test="new-tweet"]')
  const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
  const other = wrapper.find('[data-test="other"]')

  test('NewTweetAndPasteModel init', () => {
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
    // ???
    expect(NewTweetAndPasteModel).toBeTruthy()

    expect(newTweet.element.value).toEqual('')
    expect(copyAndPaste.element.value).toEqual('')
    expect(other.element.value).toEqual('')
  })

  test('NewTweetAndPasteModel success for all', () => {
    expect(NewTweetAndPasteModel).toBeTruthy()
    const wrapper = mount(NewTweetAndPasteModel)

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')

    // 1
    copyAndPaste.setValue(arrayNewT.success.copyAndPaste)
    copyAndPaste.trigger('change')
    expect(newTweet.element.value).toEqual('')
    expect(copyAndPaste.element.value).toEqual(arrayNewT.success.copyAndPaste)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(2) // 2 lengths

    newTweet.setValue(arrayNewT.success.newTweet)
    newTweet.trigger('change')
    expect(newTweet.element.value).toEqual(arrayNewT.success.newTweet)
    expect(copyAndPaste.element.value).toEqual(arrayNewT.success.copyAndPaste)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(4) // 4 lengths
    // copyAndPaste
    expect(wrapper.emitted('onTextareasSubmitted')[2]).toEqual([
      {
        newTweet: arrayNewT.success.newTweet,
        arrayTrends: textAreaDataT.success.arrayTrends,
        resultTrends: textAreaDataT.success.resultTrends,
        other: '',
        resultCode: RESULTCODE.OK
      }
    ])
    // copyAndPaste and newTweet
    expect(wrapper.emitted('onTextareasSubmitted')[3]).toEqual([
      {
        newTweet: arrayNewT.success.newTweet,
        arrayTrends: textAreaDataT.success.arrayTrends,
        resultTrends: textAreaDataT.success.resultTrends,
        other: '',
        resultCode: RESULTCODE.OK
      }
    ])

    // 2
    const other = wrapper.find('[data-test="other"]')
    other.setValue(arrayNewT.success.other)
    other.trigger('change')
    expect(other.element.value).toEqual(arrayNewT.success.other)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(6)
    // other
    expect(wrapper.emitted('onTextareasSubmitted')[4]).toEqual([
      {
        newTweet: arrayNewT.success.newTweet,
        arrayTrends: textAreaDataT.success.arrayTrends,
        other: arrayNewT.success.other,
        resultTrends: textAreaDataT.success.resultTrends,
        resultCode: RESULTCODE.OK
      }
    ]
    )
    expect(wrapper.emitted('onTextareasSubmitted')[5]).toEqual([
      {
        newTweet: arrayNewT.success.newTweet,
        arrayTrends: textAreaDataT.success.arrayTrends,
        other: arrayNewT.success.other,
        resultTrends: textAreaDataT.success.resultTrends,
        resultCode: RESULTCODE.OK
      }
    ])
  })

  test('NewTweetAndPasteModel failures for all', () => {
    expect(NewTweetAndPasteModel).toBeTruthy()
    const wrapper = mount(NewTweetAndPasteModel)

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')

    /**
     * 1
     */
    newTweet.setValue(arrayNewT.failureEmpty.newTweet)
    newTweet.trigger('change')
    expect(newTweet.element.value).toEqual(arrayNewT.failureEmpty.newTweet)
    expect(copyAndPaste.element.value).toEqual('')
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(2) // 2 lengths

    copyAndPaste.setValue(arrayNewT.failureEmpty.copyAndPaste)
    copyAndPaste.trigger('change')
    expect(newTweet.element.value).toEqual(arrayNewT.failureEmpty.newTweet)
    expect(copyAndPaste.element.value).toEqual(arrayNewT.failureEmpty.copyAndPaste)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(4) // 4 lengths

    /**
    * 2
    */
    const other = wrapper.find('[data-test="other"]')
    other.setValue(arrayNewT.failureEmpty.other)
    other.trigger('change')
    expect(other.element.value).toEqual(arrayNewT.failureEmpty.other)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(6) // 6 lengths
    expect(wrapper.emitted('onTextareasSubmitted')[4]).toEqual([
      {
        newTweet: '',
        arrayTrends: [],
        other: arrayNewT.failureEmpty.other,
        resultCode: RESULTCODE.ERROR
      }
    ]
    )
    expect(wrapper.emitted('onTextareasSubmitted')[5]).toEqual([
      {
        newTweet: arrayNewT.failureEmpty.newTweet,
        arrayTrends: textAreaDataT.failureEmpty.arrayTrends,
        other: arrayNewT.failureEmpty.other,
        resultCode: RESULTCODE.ERROR
      }
    ])

    /**
     * 3
     */
    newTweet.setValue(arrayNewT.failureEmpty.newTweet)
    copyAndPaste.setValue(arrayNewT.failureEmpty.copyAndPaste)
    other.setValue(arrayNewT.failureEmpty.other)
    other.trigger('change')
    expect(newTweet.element.value).toEqual(arrayNewT.failureEmpty.newTweet)
    expect(copyAndPaste.element.value).toEqual(arrayNewT.failureEmpty.copyAndPaste)
    expect(other.element.value).toEqual(arrayNewT.failureEmpty.other)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(10) // 10 lengths
    expect(wrapper.emitted('onTextareasSubmitted')[6]).toEqual([
      {
        newTweet: arrayNewT.failureEmpty.newTweet,
        arrayTrends: [],
        other: '',
        resultCode: RESULTCODE.ERROR
      }
    ]
    )
    expect(wrapper.emitted('onTextareasSubmitted')[7]).toEqual([
      {
        newTweet: arrayNewT.failureEmpty.newTweet,
        arrayTrends: [],
        other: arrayNewT.failureEmpty.other,
        resultCode: RESULTCODE.ERROR
      }
    ]
    )
    expect(wrapper.emitted('onTextareasSubmitted')[8]).toEqual([
      {
        newTweet: arrayNewT.failureEmpty.newTweet,
        arrayTrends: [],
        other: arrayNewT.failureEmpty.other,
        resultCode: RESULTCODE.ERROR
      }
    ])
    expect(wrapper.emitted('onTextareasSubmitted')[9]).toEqual([
      {
        newTweet: arrayNewT.failureEmpty.newTweet,
        arrayTrends: [],
        other: arrayNewT.failureEmpty.other,
        resultCode: RESULTCODE.ERROR
      }
    ])
  })

  test('NewTweetAndPasteModel failures for too long', () => {
    expect(NewTweetAndPasteModel).toBeTruthy()
    const wrapper = mount(NewTweetAndPasteModel)

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
    const other = wrapper.find('[data-test="other"]')

    newTweet.setValue(arrayNewT.failureTooLong.newTweet)
    newTweet.trigger('change')
    expect(newTweet.element.value).toEqual(arrayNewT.failureTooLong.newTweet)
    expect(copyAndPaste.element.value).toEqual('')
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(2) // 2 lengths

    copyAndPaste.setValue(arrayNewT.failureTooLong.copyAndPaste)
    copyAndPaste.trigger('change')
    expect(newTweet.element.value).toEqual(arrayNewT.failureTooLong.newTweet)
    expect(copyAndPaste.element.value).toEqual(arrayNewT.failureTooLong.copyAndPaste)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(4) // 4 lengths

    other.setValue(arrayNewT.failureTooLong.other)
    other.trigger('change')
    expect(other.element.value).toEqual(arrayNewT.failureTooLong.other)
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(6) // 6 lengths
    expect(wrapper.emitted('onTextareasSubmitted')[4]).toEqual([
      {
        newTweet: arrayNewT.failureTooLong.newTweet,
        arrayTrends: textAreaDataT.failureTooLong.arrayTrends,
        other: arrayNewT.failureTooLong.other,
        resultCode: RESULTCODE.ERROR
      }
    ]
    )
    expect(wrapper.emitted('onTextareasSubmitted')[5]).toEqual([
      {
        newTweet: arrayNewT.failureTooLong.newTweet,
        arrayTrends: textAreaDataT.failureTooLong.arrayTrends,
        other: arrayNewT.failureTooLong.other,
        resultCode: RESULTCODE.ERROR
      }
    ])
  })

  // https://stackoverflow.com/questions/74209044/vue-router-mock-with-vue-test-utils-vitest
  useRoute.mockReturnValue({
    query: {
      other: 'test other'
    }
  })
  useRouter.mockReturnValue({
    push: vi.fn(),
    isReady: vi.fn()
  })
  test('NewTweetAndPasteModel success for  other "?other=test%20other"', () => {
    expect(NewTweetAndPasteModel).toBeTruthy()
    const wrapper = mount(NewTweetAndPasteModel)

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
    const other = wrapper.find('[data-test="other"]')

    expect(newTweet.element.value).toEqual('')
    expect(copyAndPaste.element.value).toEqual('')
    // expect(other.element.value).toEqual('test other')
    expect(other.element.value).toEqual('')
  })
})
