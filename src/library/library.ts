import { YOUTUBE, REGEXYOUTUBEVIDEO, REGEXYOUTUBEVIDEOTITLE } from '@/utils/utils'

import axios from 'axios'
const REDIRCETURL = 'http://localhost:3000/youtube'

export class RegExpCustom {
  newTweet!: string
  private youtubeUrls!: {
    full: string
    watch: string
    video: string
  }
  private youtubeInVideoTitle!: string

  constructor(newTweet?: string) {
    if (newTweet != undefined) this.newTweet = newTweet
  }

  public setNewTweet(newTweet: string) {
    this.newTweet = newTweet
  }

  public getNewTweet() {
    return this.newTweet
  }

  public getYoutubeInFullVideoUrl() {
    if (this.youtubeUrls == undefined) throw new Error('not found this this.isYoutubeVideo()')
    return this.youtubeUrls.full
  }

  public getYoutubeInVideoUrl() {
    // if (
    //   this.youtubeUrls.full == undefined &&
    //   this.youtubeUrls.watch == undefined &&
    //   this.youtubeUrls.video == undefined
    // )
    //   throw new Error('not found this this.isYoutubeVideo()')
    return YOUTUBE + '/' + this.youtubeUrls.video
  }

  public getYoutubeInVidoeTitle() {
    if (this.youtubeInVideoTitle == undefined)
      throw new Error('not found this this.isYoutubeVideo()')
    return this.youtubeInVideoTitle
  }

  public async isYoutubeInVideoUrl(): Promise<boolean> {
    const regex = this.objYoutubeInVideoUrl(REGEXYOUTUBEVIDEO, this.newTweet)
    if (regex == undefined) return false

    this.youtubeUrls = {
      full: regex.full,
      watch: regex.watch,
      video: regex.video
    }

    return true
  }

  public async getYoutubeInVideoTitle(): Promise<string | null> {
    const youtubeWatch: string = REDIRCETURL + this.youtubeUrls.watch + this.youtubeUrls.video
    const res = await axios.get(youtubeWatch)

    if (res.status == 404 || res.data.search(`This video isn't available anymore`) !== -1) {
      console.debug('getYoutubeVideo: error not found')
      return null
    }

    const title = this.objYoutubeInVideoTitle(REGEXYOUTUBEVIDEOTITLE, res.data)
    if (title == null) {
      console.debug('getYoutubeVideo: error not found')
      return null
    }
    return title
  }

  private objYoutubeInVideoUrl(
    regexExp: RegExp,
    regexExec: string
  ): {
    full: string
    watch: string
    video: string
  } | null {
    try {
      const regExpExecArray = this.regExpAndExec(regexExp, regexExec)

      const full = regExpExecArray?.at(0)
      const watch = regExpExecArray?.at(1)
      const video = regExpExecArray?.at(2)

      if (full == undefined || watch == undefined || video == undefined) return null
      return {
        full: full,
        watch: watch,
        video: video
      }
    } catch (error: any) {
      return error
    }
  }

  private objYoutubeInVideoTitle(regexExp: RegExp, regexExec: string): string | null {
    const regExpExecArray = this.regExpAndExec(regexExp, regexExec)

    const full = regExpExecArray?.at(0)
    const parent = regExpExecArray?.at(1)

    if (full == undefined || parent == undefined) return null
    return parent
  }

  private regExpAndExec(regexExp: RegExp, regexExec: string): RegExpExecArray | null {
    const regex = RegExp(regexExp, 'gm')
    const regExpExecArray = regex.exec(regexExec)

    if (regExpExecArray == null) return null
    return regExpExecArray
  }
}
