// import * as dotenv from 'dotenv'
// dotenv.config()

// vitest.config.ts UserConfig?

import * as envT from '@/components/__tests__/env.js'

export const HOST: string = process.env.HOST ?? envT.HOST
export const REGEXTWEETS: RegExp = process.env.REGEXTWEETS ?? envT.REGEXTWEETS
export const REGEXYOUTUBEVIDEO: RegExp = process.env.REGEXYOUTUBEVIDEO ?? envT.REGEXYOUTUBEVIDEO
export const REGEXYOUTUBEVIDEOTITLE: RegExp =
  process.env.REGEXYOUTUBEVIDEOTITLE ?? envT.REGEXYOUTUBEVIDEOTITLE
export const YOUTUBE: string = process.env.YOUTUBE ?? envT.YOUTUBE
export const TAGS: string = process.env.TAGS ?? envT.TAGS
export const JOIN: string = process.env.JOIN ?? envT.JOIN
