
const success = [
  {
    "trending_topics": "Sedang tren dalam topik Indonesia",
    "name": "Test Zero",
    "url": "",
    "tweet_volume": "1.1K posts",
    "completed": true
  },
  {
    "trending_topics": "Sedang tren dalam topik Indonesia",
    "name": "Test 1",
    "url": "",
    "tweet_volume": "100 posts",
    "completed": true
  },
  {
    "trending_topics": "Trending in Indonesia",
    "name": "Test 2",
    "url": "",
    "tweet_volume": "200 posts",
    "completed": true
  },
  {
    "trending_topics": "Entertainment · Trending",
    "name": "#Test3",
    "url": "",
    "tweet_volume": "300 posts",
    "completed": true
  },
  {
    "trending_topics": "Technology · Trending",
    "name": "#Test 4",
    "url": "",
    "tweet_volume": "400K posts",
    "completed": true
  }
];

const failureTagsToSuccessTags = [
  {
    "trending_topics": "Trending in Indonesia",
    "name": "#FailureToSuccess",
    "url": "",
    "tweet_volume": "15K posts",
    "completed": true
  },
  {
    "trending_topics": "Trending in Indonesia",
    "name": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in",
    "url": "",
    "tweet_volume": "15.8K posts",
    "completed": true
  }
];

const failureTags = [
  {
    "trending_topics": "Trending in Indonesia",
    "name": "#Failure",
    "url": "",
    "tweet_volume": "15K posts",
    "completed": true
  },
  {
    "trending_topics": "Trending in Indonesia",
    "name": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "url": "",
    "tweet_volume": "15.8K posts",
    "completed": true
  }
]

const failureText = "Tidak ada hasil";

export default {
  success, failureTags, failureText
}
