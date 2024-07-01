export interface Trend {
  trendingTopic: string
  name: string
  url: string
  tweetVolume: string
  completed: boolean
}

export const RESULTCODE = {
  ERROR: -1,
  DEFAULT: 0,
  OK: 1
}

export interface TextAreaData {
  newTweet?: string
  arrayTrends: Trend[]
  other?: string
  resultTrends: string
  resultCode: number
}
