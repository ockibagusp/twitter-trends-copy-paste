
let arrayTrends = []
arrayTrends.success = [
  {
    trendingTopic: 'Sedang tren dalam topik Indonesia',
    name: 'Test Zero',
    url: 'https://x.com/search?q=Test Zero',
    tweetVolume: '1.1K posts',
    completed: true
  },
  {
    trendingTopic: 'Sedang tren dalam topik Indonesia',
    name: 'Test 1',
    url: 'https://x.com/search?q=Test 1',
    tweetVolume: '100 posts',
    completed: true
  },
  {
    trendingTopic: 'Trending in Indonesia',
    name: 'Test 2',
    url: 'https://x.com/search?q=Test 2',
    tweetVolume: '200 posts',
    completed: true
  },
  {
    trendingTopic: 'Entertainment · Trending',
    name: '#Test3',
    url: 'https://x.com/search?q=%23Test3',
    tweetVolume: '300 posts',
    completed: true
  },
  {
    trendingTopic: 'Technology · Trending',
    name: '#Test 4',
    url: 'https://x.com/search?q=%23Test 4',
    tweetVolume: '400K posts',
    completed: true
  }
]
arrayTrends.failureEmpty = []
arrayTrends.failureTooLong = [
  {
    trendingTopic: 'Trending in Indonesia',
    name: '#FailureTooLong',
    url: 'https://x.com/search?q=%23FailureTooLong',
    tweetVolume: '15K posts',
    completed: true
  },
  {
    trendingTopic: 'Trending in Indonesia',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    url: 'https://x.com/search?q=Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tweetVolume: '15.8K posts',
    completed: true
  }
]

const success = {
  newTweet: 'Author Success (TextAreaData)',
  arrayTrends: arrayTrends.success,
  other: 'other success (TextAreaData)',
  resultTrends: 'Test Zero, Test 1, Test 2, #Test3, #Test 4',
  resultCode: 1
}

const failureEmpty = {
  newTweet: 'Author Failure Empty (TextAreaData)',
  arrayTrends: arrayTrends.failureEmpty,
  other: 'other failure empty (TextAreaData)',
  resultTrends: '',
  resultCode: -1
}

const failureTooLong = {
  newTweet: 'Author Failure Too Long (TextAreaData)',
  arrayTrends: arrayTrends.failureTooLong,
  other: 'other failure too long (TextAreaData)',
  resultTrends: '#Failure, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  resultCode: -1
}


export default {
  success,
  failureEmpty,
  failureTooLong
}
