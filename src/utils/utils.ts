// import * as dotenv from 'dotenv'
// dotenv.config()

// vitest.config.ts UserConfig?

export const HOST = process.env.HOST ?? 'x.com'
export const REGEXTWEETS =
  process.env.REGEXTWEETS ??
  /(Sedang tren dalam topik (.+)|Trending in (.+)|(.+) Popular|(.+) Populer|(.+) Trending|Trending|Sedang tren)\n?\n(.+)\n?\n([\d.,]+.*)?/
export const TAGS = process.env.TAGS ?? 'Tags:'
export const JOIN = process.env.JOIN ?? ', '
