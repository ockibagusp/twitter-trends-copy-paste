import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { RegExpCustom } from '../../library/library'
import axios from 'axios'

const YOUTUBE_SUCCESS01 = 'https://www.youtube.com/watch?v=success-01'
const YOUTUBE_SUCCESS02 = 'https://www.youtube.com/shorts/success-02'
const YOUTUBE_FAILURE = 'https://www.youtube.com/watch?v=failure-01'

describe('library mount component', () => {
  const regExpCustom = new RegExpCustom()

  test('defines constructor()', () => {
    expect(typeof regExpCustom.constructor).toBe('function')
  })

  test('setNewTweet(newTweet: string) and constructor(newTweet?: string)', () => {
    const regExpCustom1 = new RegExpCustom()
    regExpCustom1.setNewTweet(YOUTUBE_SUCCESS01)
    expect(regExpCustom1.getNewTweet()).toEqual(YOUTUBE_SUCCESS01)

    const regExpCustom2 = new RegExpCustom(YOUTUBE_SUCCESS01)
    expect(regExpCustom2.getNewTweet()).toEqual(YOUTUBE_SUCCESS01)

    const regExpCustom3 = new RegExpCustom()
    regExpCustom3.setNewTweet(YOUTUBE_SUCCESS02)
    expect(regExpCustom3.getNewTweet()).toEqual(YOUTUBE_SUCCESS02)

    const regExpCustom4 = new RegExpCustom(YOUTUBE_SUCCESS02)
    expect(regExpCustom4.getNewTweet()).toEqual(YOUTUBE_SUCCESS02)
  })

  regExpCustom.setNewTweet(YOUTUBE_SUCCESS01)
  test('isYoutubeInVideoUrl() watching: success', () => {
    regExpCustom.isYoutubeInVideoUrl()
    expect(regExpCustom.isYoutubeInVideoUrl()).toBeTruthy()
    expect(regExpCustom.getYoutubeInFullVideoUrl()).toEqual(YOUTUBE_SUCCESS01)
    expect(regExpCustom.getYoutubeInVideoUrl()).toEqual('youtu.be/success-01')
  })

  test('getYoutubeInVideoTitle() watching: success', async () => {
    // vi.spyOn(axios, 'get').mockResolvedValueOnce({
    //   data: '<meta name="title" content="Test One - Author One Two Three"><meta name="description" content=',
    //   status: 200
    // })
    // expect(axios.get).toHaveBeenCalledTimes(1)
    // expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/youtube/watch?v=success-01')
    // expect(await regExpCustom.getYoutubeInVideoTitle()).toEqual('youtu.be/success-01')
  })

  test('getYoutubeInVideoTitle() watching: failure', async () => {
    // vi.spyOn(axios, 'get').mockResolvedValueOnce({
    //   data: 'This video isn't available anymore',
    //   status: 200
    // })
    // expect(axios.get).toHaveBeenCalledTimes(1)
    // expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/youtube/watch?v=failure-01')
    // expect(await regExpCustom.getYoutubeInVideoTitle()).toEqual('youtu.be/failure-01')
  })
})
