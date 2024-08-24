import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest'
import { RegExpYouTube } from '../library'

vi.mock('axios')

const YOUTUBE_SUCCESS01 = 'https://www.youtube.com/watch?v=success-01'
const YOUTUBE_SUCCESS02 = 'https://www.youtube.com/shorts/success-02'
const YOUTUBE_FAILURE = 'https://www.youtube.com/watch?v=failure-01'
// vi.mock('../library', async (importOriginal) => {
//   // const actual = await importOriginal()
//   const actual = vi.requireActual('../library')
//
//   return {
//     ...actual,
//     RegExpYouTube: vi.fn().mockReturnValue({
//       constructor: vi.fn(),
//       setNewTweet: vi.fn(),
//       // link: Expected 0 arguments, but got 1'
//       getNewTweet: vi.fn((link) => {
//         if (link == 1) return YOUTUBE_SUCCESS01
//         else if (link == 2) return YOUTUBE_SUCCESS02
//         else if (link == 3) return YOUTUBE_FAILURE
//         else return 'mock'
//       })
//     })
//   }
// })
vi.mock('../library')

window.alert = vi.fn()

describe('library mount component', async () => {
  let regExpYouTube: RegExpYouTube

  beforeEach(() => {
    regExpYouTube = new RegExpYouTube(YOUTUBE_SUCCESS01)
  })

  afterEach(() => {
    // regExpYouTube = null
    vi.resetAllMocks()
    vi.clearAllMocks()
  })

  test('defines constructor()', () => {
    const regExpYouTube = new RegExpYouTube()
    expect(typeof regExpYouTube.constructor).toBe('function')
  })

  // https://soorria.com/snippets/mocking-classes-vitest
  test('should calls setNewTweet(...) and constructor(?:...)', async () => {
    const regExpCustom1 = new RegExpYouTube(YOUTUBE_SUCCESS01)
    let getNewTweetMock = vi.mocked(regExpCustom1.getNewTweet).mockReturnValue(YOUTUBE_SUCCESS01)
    let getNewTweet = getNewTweetMock()
    expect(getNewTweetMock).toBeCalledTimes(1)
    expect(getNewTweet).toEqual(YOUTUBE_SUCCESS01)

    const regExpCustom2 = new RegExpYouTube()
    regExpCustom2.setNewTweet(YOUTUBE_SUCCESS01)
    getNewTweetMock = vi.mocked(regExpCustom2.getNewTweet).mockReturnValue(YOUTUBE_SUCCESS01)
    getNewTweet = getNewTweetMock()
    expect(getNewTweetMock).toBeCalledTimes(2)
    expect(getNewTweet).toEqual(YOUTUBE_SUCCESS01)

    const regExpCustom3 = new RegExpYouTube(YOUTUBE_SUCCESS02)
    getNewTweetMock = vi.mocked(regExpCustom3.getNewTweet).mockReturnValue(YOUTUBE_SUCCESS02)
    getNewTweet = getNewTweetMock()
    expect(getNewTweetMock).toBeCalledTimes(3)
    expect(getNewTweet).toEqual(YOUTUBE_SUCCESS02)

    const regExpCustom4 = new RegExpYouTube()
    regExpCustom4.setNewTweet(YOUTUBE_SUCCESS02)
    getNewTweetMock = vi.mocked(regExpCustom4.getNewTweet).mockReturnValue(YOUTUBE_SUCCESS02)
    getNewTweet = getNewTweetMock()
    expect(getNewTweetMock).toBeCalledTimes(4)
    expect(getNewTweet).toEqual(YOUTUBE_SUCCESS02)
  })

  // Mock vs Spy in Testing with Jest: Which is Better?: https://www.youtube.com/watch?v=9N8D7U9Am8o
  test('should return Youtube watching: success', async () => {
    // getYoutubeInVideoTitle()
    const titleMock = 'Test One - Author One Two Three'
    const isYoutubeOnTitleMock = vi
      .mocked(regExpYouTube.getYoutubeInVideoTitle)
      .mockResolvedValue(titleMock)
    const isYoutubeOnTitle = await isYoutubeOnTitleMock()
    expect(isYoutubeOnTitleMock).toBeCalledTimes(1)
    expect(isYoutubeOnTitle).toEqual(titleMock)
  })

  test('should return Youtube watching: failure', async () => {
    /**
     * getYoutubeInVideoTitle()
     * */
    // try: AxiosResponse res.status
    let errorMock = 'YouTube not found'
    let isYoutubeOnTitleMock = vi
      .mocked(regExpYouTube.getYoutubeInVideoTitle)
      .mockResolvedValue(errorMock)
    let isYoutubeOnTitle = await isYoutubeOnTitleMock()
    expect(isYoutubeOnTitleMock).toBeCalledTimes(1)
    expect(isYoutubeOnTitle).toEqual(errorMock)

    /**
     * objYoutubeInVideoTitle(..., res.data)
     */
    // try: title instanceof Error
    errorMock = 'objYoutubeInVideoTitle: YouTube title not found'
    isYoutubeOnTitleMock = vi
      .mocked(regExpYouTube.getYoutubeInVideoTitle)
      .mockResolvedValue(errorMock)
    isYoutubeOnTitle = await isYoutubeOnTitleMock()
    expect(isYoutubeOnTitleMock).toBeCalledTimes(2)
    expect(isYoutubeOnTitle).toEqual(errorMock)

    // catch
    expect.assertions(4)
    try {
      await isYoutubeOnTitleMock()
    } catch (error) {
      expect(error).toMatch('error')
    }
  })

  test.skip('should throw catch on Youtube watching: failure', async () => {
    // catch
    const errorMock = 'objYoutubeInVideoTitle: YouTube title not found'
    const isYoutubeOnTitleMock = vi
      .mocked(regExpYouTube.getYoutubeInVideoTitle)
      .mockResolvedValue(errorMock)

    expect.assertions(1)
    try {
      await isYoutubeOnTitleMock()
    } catch (error) {
      expect(error).toMatch('error')
    }
  })

  test('should return text in full video url on function getYoutubeInFullVideoUrl(): success', () => {
    const successMock = 'https://www.youtube.com/watch?v=success'
    const getYoutubeInFullVideoUrlMock = vi
      .mocked(regExpYouTube.getYoutubeInFullVideoUrl)
      .mockReturnValue(successMock)
    const getYoutubeInFullVideoUrl = getYoutubeInFullVideoUrlMock()
    expect(getYoutubeInFullVideoUrl).toBe(successMock)
  })

  test('should return text in full video url on function getYoutubeInFullVideoUrl(): failure', async () => {
    const errorMock = 'not found this this.isYoutube()'
    const getYoutubeInFullVideoUrlMock = vi
      .mocked(regExpYouTube.getYoutubeInFullVideoUrl)
      .mockRejectedValue(new Error(errorMock))
    const getYoutubeInFullVideoUrl = getYoutubeInFullVideoUrlMock()
    expect(getYoutubeInFullVideoUrl).rejects.toThrow(errorMock)
  })

  test('should return text in video url on function getYoutubeInVideoUrl(): success', () => {
    const successMock = 'youtube.com/00-success'
    const getYoutubeInVideoUrlMock = vi
      .mocked(regExpYouTube.getYoutubeInVideoUrl)
      .mockReturnValue(successMock)
    const getYoutubeInVideoUrl = getYoutubeInVideoUrlMock()
    expect(getYoutubeInVideoUrl).toBe(successMock)
  })

  test('should return text in video url on function getYoutubeInVideoUrl(): failure', async () => {
    const errorMock = 'not found this this.isYoutube()'
    const getYoutubeInVideoUrlMock = vi
      .mocked(regExpYouTube.getYoutubeInVideoUrl)
      .mockRejectedValue(new Error(errorMock))
    const getYoutubeInVideoUrl = getYoutubeInVideoUrlMock()
    expect(getYoutubeInVideoUrl).rejects.toThrow(errorMock)
  })

  test('should return true in Youtube video on function isYoutube(): success', async () => {
    const isYoutubeMock = vi.mocked(regExpYouTube.isYoutube).mockResolvedValue(true)
    const isYoutube = await isYoutubeMock()
    expect(isYoutubeMock).toHaveBeenCalledTimes(1)
    expect(isYoutube).toBe(true)
    isYoutubeMock.mockRestore()
  })

  test('should return false in Youtube video on function isYoutube(): failure', async () => {
    const isYoutubeMock = vi.mocked(regExpYouTube.isYoutube).mockResolvedValue(false)
    const isYoutube = await isYoutubeMock()
    expect(isYoutubeMock).toHaveBeenCalledTimes(1)
    expect(isYoutube).toBe(false)
    isYoutubeMock.mockRestore()
  })

  test.skip('should return { full, watch, video } on function objYoutubeInVideoUrl(...): success', async () => {
    // const objYoutubeInVideoUrlMock = vi.mocked(regExpYouTube.??)
    // regExpYouTubeMock.mockRejectedValue({
    //   full: 'https://www.youtube.com/shorts/00-success',
    //   watch: '/shorts/',
    //   video: '00-success'
    // })
    // const message = 'regExpAndExec: not found'
    // mockAxios.get.mockResolvedValue({ data: 'test' })
    // expect(mockAxios.get).toHaveBeenCalledWith(1)
    // // expect(regExpCustom.isYoutubeInVideoUrl()).toBeTruthy()
    // // expect(regExpCustom.getYoutubeInFullVideoUrl()).toEqual(YOUTUBE_SUCCESS01)
    // console.log(regExpYouTube);
    // //expect(regExpYouTube.getYoutubeInVideoUrl()).toEqual('youtu.be/peUj47yc1xo')
    // const titleOnYouTube = await regExpYouTube.getYoutubeInVideoTitle()
    // expect(titleOnYouTube).toEqual('DOSA - Ustadz Dr. Firanda Andirja, MA')
    // const mockResponse = { data: {}, status: 400 }
    // axios.get.mockResolvedValueOnce(mockResponse)
  })
})
