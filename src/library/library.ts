import { YOUTUBE, REGEXYOUTUBEVIDEO, REGEXYOUTUBEVIDEOTITLE } from '@/utils/utils'

import axios from 'axios'

const REDIRCETURL = '/youtube'

export class RegExpYouTube {
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
    if (this.youtubeUrls == undefined) throw new Error('not found this this.isYoutube()')
    return this.youtubeUrls.full
  }

  public getYoutubeInVideoUrl() {
    if (
      this.youtubeUrls.full == undefined &&
      this.youtubeUrls.watch == undefined &&
      this.youtubeUrls.video == undefined
    )
      throw new Error('not found this this.isYoutube()')
    return YOUTUBE + '/' + this.youtubeUrls.video
  }

  public async isYoutube(): Promise<boolean> {
    const regex = this.objYoutubeInVideoUrl(REGEXYOUTUBEVIDEO)
    if (regex instanceof Error) return false

    this.youtubeUrls = {
      full: regex.full,
      watch: regex.watch,
      video: regex.video
    }

    return true
  }

  public async getYoutubeInVideoTitle(): Promise<string | Error> {
    if (this.youtubeInVideoTitle != undefined) return this.youtubeInVideoTitle
    return this.getYoutubeWatch()
  }

  private async getYoutubeWatch(): Promise<string | Error> {
    try {
      const youtubeWatch: string = REDIRCETURL + this.youtubeUrls.watch + this.youtubeUrls.video
      const res = await axios.get(youtubeWatch)
      if (res.status == 404 || res.data.search(`This video isn't available anymore`) !== -1) {
        throw new Error('YouTube not found')
      }

      const title = this.objYoutubeInVideoTitle(REGEXYOUTUBEVIDEOTITLE, res.data)
      if (title instanceof Error) throw title
      this.youtubeInVideoTitle = title
      return title
    } catch (error: any) {
      console.error('An error occurred:', error)
      throw error
    }
  }

  private objYoutubeInVideoUrl(regexExp: RegExp):
    | {
        full: string
        watch: string
        video: string
      }
    | Error {
    try {
      const regExpExecArray = this.regExpAndExec(regexExp, this.newTweet)
      if (regExpExecArray instanceof Error) throw regExpExecArray

      const full = regExpExecArray.at(0)
      const watch = regExpExecArray.at(1)
      const video = regExpExecArray.at(2)

      if (full == undefined || watch == undefined || video == undefined)
        throw new Error('objYoutubeInVideoUrl: YouTube not found')
      return {
        full: full,
        watch: watch,
        video: video
      }
    } catch (error: any) {
      console.error('An error occurred:', error)
      throw error
    }
  }

  private objYoutubeInVideoTitle(regexExp: RegExp, regexExec: string): string | Error {
    try {
      const regExpExecArray = this.regExpAndExec(regexExp, regexExec)
      if (regExpExecArray instanceof Error) throw regExpExecArray

      const full = regExpExecArray.at(0)
      const parent = regExpExecArray.at(1)

      if (full == undefined || parent == undefined)
        throw new Error('objYoutubeInVideoTitle: YouTube title not found')
      return parent
    } catch (error: any) {
      console.error('An error occurred:', error)
      throw error
    }
  }

  private regExpAndExec(regexExp: RegExp, regexExec: string): RegExpExecArray | Error {
    const regex = RegExp(regexExp, 'gm')
    const regExpExecArray = regex.exec(regexExec)

    if (regExpExecArray == null) throw new Error('regExpAndExec: not found')
    return regExpExecArray
  }
}
