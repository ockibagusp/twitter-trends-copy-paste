import { describe, test, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { shallowMount, mount } from '@vue/test-utils'
import { useRouter, useRoute } from 'vue-router'
import NewTweetAndPasteModel from '../NewTweetAndPasteModel.vue'
import { RESULTCODE } from '../../interface'
import * as arrayNewT from '../__tests__/testArrayNewTweetAndPaste.js'
import textAreaDataT from '../__tests__/testTextAreaData.js'

import axios from 'axios'

const RegExpYouTube = vi.fn()
RegExpYouTube.prototype.getYoutubeInVideoUrl = vi.fn(() => 'youtu.be/00-success')
RegExpYouTube.prototype.getYoutubeInFullVideoUrl = vi
  .fn(() => 'https://www.youtube.com/watch?v=00-success')
  .mockImplementation(() => 'https://www.youtube.com/shorts/00-success')
  .mockRejectedValue('not found this this.isYoutube()')
RegExpYouTube.prototype.getYoutubeInVideoTitle = vi
  .fn(() => 'Test Watch - Author One Two Three')
  .mockImplementation(() => 'Test Shorts - Author One Two Three')
  .mockRejectedValue('YouTube not found')
RegExpYouTube.prototype.getYoutubeWatch = vi
  .fn()
  .mockImplementation(() => 'https://www.youtube.com/watch?v=failure-01')
RegExpYouTube.prototype.objYoutubeInVideoUrl = vi.fn()
// .mockRejectedValue('objYoutubeInVideoUrl: YouTube not found')
RegExpYouTube.prototype.isYoutube = vi.fn()

vi.mock('axios')
window.alert = vi.fn()

function mountModel() {
  const wrapper = mount(NewTweetAndPasteModel)
  return wrapper
}

describe('NewTweetAndPasteModel mount component', async () => {
  // ts: let wrapper: any = null
  let wrapper = null
  beforeEach(() => {
    wrapper = shallowMount(NewTweetAndPasteModel)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  test('should succeed first default if all being empty', async () => {
    const wrapper = mountModel()

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
    const other = wrapper.find('[data-test="other"]')
    const btnReset = wrapper.find('[data-test="btn-reset"]')

    expect(NewTweetAndPasteModel).toBeTruthy()
    expect(newTweet.element.value).toEqual('')
    expect(copyAndPaste.element.value).toEqual('')
    expect(other.element.value).toEqual('')
    expect(btnReset.isVisible()).toBe(true)

    wrapper.unmount()
  })

  const mockRegExpYouTube = new RegExpYouTube()
  const mockYoutube = mockRegExpYouTube.getYoutubeInFullVideoUrl
  const mockYoutubeFail = mockRegExpYouTube.getYoutubeWatch

  // ?????
  const mockObjYoutubeInVideoUrl = mockRegExpYouTube.objYoutubeInVideoUrl.mockRejectedValue(
    new Error('objYoutubeInVideoUrl: YouTube not found')
  )
  expect(mockObjYoutubeInVideoUrl).rejects.toThrow(
    new Error('objYoutubeInVideoUrl: YouTube not found')
  )

  test('should update textarea: newTweet success to get a YouTube Video', async () => {
    expect(await mockYoutube()).toEqual('https://www.youtube.com/shorts/00-success')
    expect(mockYoutube).toHaveBeenCalledTimes(1)

    // await mockYoutube.mockImplementationOnce(() => 'access-restricted')
    // expect(mockYoutube()).toEqual('access-restricted')

    // expect(mockYoutube).toHaveBeenCalledTimes(2)

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const other = wrapper.find('[data-test="other"]')
    expect(NewTweetAndPasteModel).toBeTruthy()

    await newTweet.setValue('https://www.youtube.com/shorts/00-success')
    await newTweet.trigger('change')

    expect(newTweet.element.value).toEqual('Loading...')

    // Wait until the DOM updates.
    // await flushPromises()

    // expect(axios.get).toHaveBeenCalledTimes(1)
    // expect(axios.get).toHaveBeenCalledWith('/youtube/shorts/00-success')

    expect(newTweet.element.value).toEqual(arrayNewT.successTitleOfYoutube.newTweet)
    expect(other.element.value).toEqual(textAreaDataT.successTitleOfYoutube.other)

    expect(newTweet.element.value).toEqual(arrayNewT.successTitleOfYoutube.newTweet)
    expect(other.element.value).toEqual(textAreaDataT.successTitleOfYoutube.other)

    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(1)
    expect(wrapper.emitted('onTextareasSubmitted')[0]).toEqual([
      {
        newTweet: arrayNewT.successTitleOfYoutube.newTweet,
        arrayTrends: [],
        other: textAreaDataT.successTitleOfYoutube.other,
        resultTrends: '',
        resultCode: RESULTCODE.OK
      }
    ])
  })

  test('should update textarea: newTweet failure if not get a YouTube Video', async () => {
    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const other = wrapper.find('[data-test="other"]')
    expect(NewTweetAndPasteModel).toBeTruthy()

    const failure01 = 'https://www.youtube.com/watch?v=failure-01'
    expect(await mockYoutubeFail()).toEqual(failure01)
    expect(mockYoutubeFail).toHaveBeenCalledTimes(1)
    await newTweet.setValue(failure01)
    await newTweet.trigger('change')
    // await flushPromises()

    expect(newTweet.element.value).toEqual(failure01)
    expect(other.element.value).toEqual('')

    // expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(1)
    // expect(wrapper.emitted('onTextareasSubmitted')[0]).toEqual([
    //   {
    //     newTweet: failure01,
    //     arrayTrends: [],
    //     other: '',
    //     resultTrends: '',
    //     resultCode: RESULTCODE.ERROR
    //   }
    // ])
    // expect(wrapper.emitted('onTextareasSubmitted')[6]).toEqual([
    //   {
    //     newTweet: failure01,
    //     arrayTrends: [],
    //     other: '',
    //     resultTrends: '',
    //     resultCode: RESULTCODE.ERROR
    //   }
    // ])
  })

  // test('should update textarea: newTweet if called without an arg', () => {
  //   expect(NewTweetAndPasteModel).toBeTruthy()
  //   window.alert = vi.fn()

  //   const wrapper = mount(NewTweetAndPasteModel)
  //   const newTweet = wrapper.find('[data-test="new-tweet"]')
  //   const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')

  //   // ?
  //   // using text area 1
  //   copyAndPaste.setValue(arrayNewT.success.copyAndPaste)
  //   copyAndPaste.trigger('change')
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(2)
  //   expect(wrapper.emitted('onTextareasSubmitted')[0]).toEqual([
  //     {
  //       newTweet: '',
  //       arrayTrends: textAreaDataT.success.arrayTrends,
  //       other: '',
  //       resultTrends: textAreaDataT.success.resultTrends,
  //       resultCode: RESULTCODE.OK
  //     }
  //   ])
  //   expect(wrapper.emitted('onTextareasSubmitted')[1]).toEqual([
  //     {
  //       newTweet: '',
  //       arrayTrends: textAreaDataT.success.arrayTrends,
  //       other: '',
  //       resultTrends: textAreaDataT.success.resultTrends,
  //       resultCode: RESULTCODE.OK
  //     }
  //   ])
  //   expect(newTweet.element.value).toEqual('')
  //   expect(copyAndPaste.element.value).toEqual(arrayNewT.success.copyAndPaste)

  //   // using text area 2
  //   newTweet.setValue(arrayNewT.success.newTweet)
  //   newTweet.trigger('change')
  //   expect(newTweet.element.value).toEqual(arrayNewT.success.newTweet)
  //   expect(copyAndPaste.element.value).toEqual(arrayNewT.success.copyAndPaste)
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(2)
  //   expect(wrapper.emitted('onTextareasSubmitted')[0]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: textAreaDataT.success.arrayTrends,
  //       other: '',
  //       resultTrends: 'Test Zero, Test 1, Test 2, #Test3, #Test 4',
  //       resultCode: RESULTCODE.OK
  //     }
  //   ])
  //   expect(wrapper.emitted('onTextareasSubmitted')[1]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: textAreaDataT.success.arrayTrends,
  //       other: '',
  //       resultTrends: 'Test Zero, Test 1, Test 2, #Test3, #Test 4',
  //       resultCode: RESULTCODE.OK
  //     }
  //   ])

  //   // using text area 3
  //   const other = wrapper.find('[data-test="other"]')
  //   other.setValue(arrayNewT.success.other)
  //   other.trigger('change')
  //   expect(other.element.value).toEqual(arrayNewT.success.other)
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(4)
  //   // other
  //   expect(wrapper.emitted('onTextareasSubmitted')[2]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: textAreaDataT.success.arrayTrends,
  //       other: arrayNewT.success.other,
  //       resultTrends: textAreaDataT.success.resultTrends,
  //       resultCode: RESULTCODE.OK
  //     }
  //   ]
  //   )
  //   expect(wrapper.emitted('onTextareasSubmitted')[3]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: textAreaDataT.success.arrayTrends,
  //       other: arrayNewT.success.other,
  //       resultTrends: textAreaDataT.success.resultTrends,
  //       resultCode: RESULTCODE.OK
  //     }
  //   ])

  //   // empty text area 2
  //   copyAndPaste.setValue('')
  //   copyAndPaste.trigger('change')
  //   expect(copyAndPaste.element.value).toEqual('')
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(6)
  //   expect(wrapper.emitted('onTextareasSubmitted')[4]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: [],
  //       other: arrayNewT.success.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ]
  //   )
  //   expect(wrapper.emitted('onTextareasSubmitted')[5]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: [],
  //       other: arrayNewT.success.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ])

  //   // empty text area 3
  //   other.setValue('')
  //   other.trigger('change')
  //   expect(other.element.value).toEqual('')
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(8)
  //   expect(wrapper.emitted('onTextareasSubmitted')[6]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: [],
  //       other: '',
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ]
  //   )
  //   expect(wrapper.emitted('onTextareasSubmitted')[7]).toEqual([
  //     {
  //       newTweet: arrayNewT.success.newTweet,
  //       arrayTrends: [],
  //       other: '',
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ])

  //   // empty text area 1
  //   newTweet.setValue('')
  //   newTweet.trigger('change')
  //   expect(newTweet.element.value).toEqual('')
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(10)
  //   expect(wrapper.emitted('onTextareasSubmitted')[8]).toEqual([
  //     {
  //       newTweet: '',
  //       arrayTrends: [],
  //       other: '',
  //       resultTrends: '',
  //       resultCode: RESULTCODE.DEFAULT
  //     }
  //   ]
  //   )
  //   expect(wrapper.emitted('onTextareasSubmitted')[9]).toEqual([
  //     {
  //       newTweet: '',
  //       arrayTrends: [],
  //       other: '',
  //       resultTrends: '',
  //       resultCode: RESULTCODE.DEFAULT
  //     }
  //   ])
  // })

  // test('NewTweetAndPasteModel success for new tweet', async () => {
  //   vi.spyOn(axios, 'get').mockResolvedValueOnce({
  //     data: '<meta name="title" content="Test One - Author One Two Three"><meta name="description" content=',
  //     status: 200
  //   })

  //   expect(NewTweetAndPasteModel).toBeTruthy()
  //   const wrapper = mount(NewTweetAndPasteModel)

  //   const newTweet = wrapper.find('[data-test="new-tweet"]')
  //   const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
  //   const other = wrapper.find('[data-test="other"]')

  //   await newTweet.setValue('https://www.youtube.com/shorts/00-success')
  //   expect(newTweet.element.value).toEqual('Loading...')
  //   await newTweet.trigger('change')

  //   expect(axios.get).toHaveBeenCalledTimes(1)
  //   expect(axios.get).toHaveBeenCalledWith('/youtube/shorts/00-success')

  //   // Wait until the DOM updates.
  //   await flushPromises()

  //   expect(newTweet.element.value).toEqual(arrayNewT.successTitleOfYoutube.newTweet)
  //   expect(copyAndPaste.element.value).toEqual('')
  //   expect(other.element.value).toEqual(textAreaDataT.successTitleOfYoutube.other)
  // })

  // test('NewTweetAndPasteModel failure for new tweet', async () => {
  //   vi.spyOn(axios, 'get').mockResolvedValueOnce({
  //     data: `This video isn't available anymore`,
  //     status: 200
  //   })

  //   const wrapper = mount(NewTweetAndPasteModel)

  //   const newTweet = wrapper.find('[data-test="new-tweet"]')
  //   const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
  //   const other = wrapper.find('[data-test="other"]')
  //   // ?? how? 1
  //   expect(other.element.value).toEqual('')

  //   const failure01 = 'https://www.youtube.com/watch?v=failure-01'
  //   await newTweet.setValue(failure01)
  //   expect(newTweet.element.value).toEqual('Loading...')
  //   await newTweet.trigger('change')

  //   expect(newTweet.element.value).toEqual(failure01)
  //   expect(copyAndPaste.element.value).toEqual('')
  //   // ?? how? 1
  //   await other.setValue('test other')
  //   expect(other.element.value).toEqual('test other')

  //   // Wait until the DOM updates.
  //   await flushPromises()

  //   vi.spyOn(axios, 'get').mockResolvedValueOnce({
  //     data: '',
  //     status: 404
  //   })

  //   const failure02 = 'https://www.youtube.com/shorts/failure-02'
  //   await newTweet.setValue(failure02)
  //   expect(newTweet.element.value).toEqual('Loading...')
  //   await newTweet.trigger('change')

  //   expect(newTweet.element.value).toEqual(failure02)
  //   // Wait until the DOM updates.
  //   await flushPromises()

  //   expect(newTweet.element.value).toEqual(failure02)
  //   expect(copyAndPaste.element.value).toEqual('')
  //   // ?? how? 1
  //   await other.setValue('test other')
  //   expect(other.element.value).toEqual('test other')
  // })

  // test('NewTweetAndPasteModel failures for all', () => {
  //   expect(NewTweetAndPasteModel).toBeTruthy()
  //   const wrapper = mount(NewTweetAndPasteModel)

  //   const newTweet = wrapper.find('[data-test="new-tweet"]')
  //   const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')

  //   /**
  //    * 1
  //    */
  //   newTweet.setValue(arrayNewT.failureEmpty.newTweet)
  //   newTweet.trigger('change')
  //   expect(newTweet.element.value).toEqual(arrayNewT.failureEmpty.newTweet)
  //   expect(copyAndPaste.element.value).toEqual('')

  //   copyAndPaste.setValue(arrayNewT.failureEmpty.copyAndPaste)
  //   copyAndPaste.trigger('change')
  //   expect(newTweet.element.value).toEqual(arrayNewT.failureEmpty.newTweet)
  //   expect(copyAndPaste.element.value).toEqual(arrayNewT.failureEmpty.copyAndPaste)
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(4)

  //   /**
  //   * 2
  //   */
  //   const other = wrapper.find('[data-test="other"]')
  //   other.setValue(arrayNewT.failureEmpty.other)
  //   other.trigger('change')
  //   expect(other.element.value).toEqual(arrayNewT.failureEmpty.other)
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(6)
  //   expect(wrapper.emitted('onTextareasSubmitted')[4]).toEqual([
  //     {
  //       newTweet: '',
  //       arrayTrends: [],
  //       other: arrayNewT.failureEmpty.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ]
  //   )
  //   expect(wrapper.emitted('onTextareasSubmitted')[5]).toEqual([
  //     {
  //       newTweet: '',
  //       arrayTrends: [],
  //       other: arrayNewT.failureEmpty.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ])

  //   /**
  //    * 3
  //    */
  //   newTweet.setValue(arrayNewT.failureWrong.newTweet)
  //   copyAndPaste.setValue(arrayNewT.failureWrong.copyAndPaste)
  //   other.setValue(arrayNewT.failureWrong.other)
  //   other.trigger('change')
  //   expect(newTweet.element.value).toEqual(arrayNewT.failureWrong.newTweet)
  //   expect(copyAndPaste.element.value).toEqual(arrayNewT.failureWrong.copyAndPaste)
  //   expect(other.element.value).toEqual(arrayNewT.failureWrong.other)
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(9) // 9 lengths
  //   expect(wrapper.emitted('onTextareasSubmitted')[7]).toEqual([
  //     {
  //       newTweet: arrayNewT.failureWrong.newTweet,
  //       arrayTrends: [],
  //       other: arrayNewT.failureWrong.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ]
  //   )
  //   expect(wrapper.emitted('onTextareasSubmitted')[8]).toEqual([
  //     {
  //       newTweet: arrayNewT.failureWrong.newTweet,
  //       arrayTrends: [],
  //       other: arrayNewT.failureWrong.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ]
  //   )
  // })

  // test('NewTweetAndPasteModel failures for too long', () => {
  //   expect(NewTweetAndPasteModel).toBeTruthy()
  //   const wrapper = mount(NewTweetAndPasteModel)

  //   const newTweet = wrapper.find('[data-test="new-tweet"]')
  //   const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
  //   const other = wrapper.find('[data-test="other"]')

  //   newTweet.setValue(arrayNewT.failureTooLong.newTweet)
  //   newTweet.trigger('change')
  //   expect(newTweet.element.value).toEqual(arrayNewT.failureTooLong.newTweet)
  //   expect(copyAndPaste.element.value).toEqual('')

  //   copyAndPaste.setValue(arrayNewT.failureTooLong.copyAndPaste)
  //   copyAndPaste.trigger('change')
  //   expect(newTweet.element.value).toEqual(arrayNewT.failureTooLong.newTweet)
  //   expect(copyAndPaste.element.value).toEqual(arrayNewT.failureTooLong.copyAndPaste)
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(2) // 2 lengths

  //   other.setValue(arrayNewT.failureTooLong.other)
  //   other.trigger('change')
  //   expect(other.element.value).toEqual(arrayNewT.failureTooLong.other)
  //   expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(4) // 4 lengths
  //   expect(wrapper.emitted('onTextareasSubmitted')[2]).toEqual([
  //     {
  //       newTweet: arrayNewT.failureTooLong.newTweet,
  //       arrayTrends: textAreaDataT.failureTooLong.arrayTrends,
  //       other: arrayNewT.failureTooLong.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ]
  //   )
  //   expect(wrapper.emitted('onTextareasSubmitted')[3]).toEqual([
  //     {
  //       newTweet: arrayNewT.failureTooLong.newTweet,
  //       arrayTrends: textAreaDataT.failureTooLong.arrayTrends,
  //       other: arrayNewT.failureTooLong.other,
  //       resultTrends: '',
  //       resultCode: RESULTCODE.ERROR
  //     }
  //   ])
  // })
})

vi.mock('vue-router')
describe('NewTweetAndPasteModel success for other', () => {
  // https://stackoverflow.com/questions/65218291/mocking-vue-routers-useroute-in-jest-tests-in-vue-3
  useRoute.mockReturnValue({ other: 'test other' })

  it('NewTweetAndPasteModel success for other "?other=test%20other"', () => {
    expect(NewTweetAndPasteModel).toBeTruthy()
    const wrapper = mount(NewTweetAndPasteModel)

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
    const other = wrapper.find('[data-test="other"]')

    expect(newTweet.element.value).toEqual('')
    expect(copyAndPaste.element.value).toEqual('')
    // ??
    other.setValue('test other')
    expect(other.element.value).toEqual('test other')

    // ??
    // expect(useRouter().isReady).toHaveBeenCalled({
    //   query: {
    //     other: 'test other'
    //   }
    // })
    expect(other.element.value).toEqual('test other')
  })

  it('NewTweetAndPasteModel btn Reset success', async () => {
    expect(NewTweetAndPasteModel).toBeTruthy()
    const wrapper = mount(NewTweetAndPasteModel)

    const newTweet = wrapper.find('[data-test="new-tweet"]')
    const copyAndPaste = wrapper.find('[data-test="copy-and-paste"]')
    const other = wrapper.find('[data-test="other"]')

    newTweet.setValue(arrayNewT.success.newTweet)
    copyAndPaste.setValue(textAreaDataT.success.arrayTrends)
    other.setValue(arrayNewT.success.other)
    other.trigger('change')

    const btnReset = wrapper.find('[data-test="btn-reset"]')
    await btnReset.trigger('click')
    expect(wrapper.emitted('onTextareasSubmitted')).toHaveLength(4)
    expect(wrapper.emitted('onTextareasSubmitted')[3]).toEqual([
      {
        newTweet: '',
        arrayTrends: [],
        other: '',
        resultTrends: '',
        resultCode: RESULTCODE.DEFAULT
      }
    ])

    expect(newTweet.element.value).toEqual('')
    expect(copyAndPaste.element.value).toEqual('')
    // // !(await getUrlQueryParams())
    // expect(other.element.value).toEqual('')
  })
})
