import { describe, it, assert, expect, vi } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import TwitterTrendsAPI from '../TwitterTrendsAPI.vue'

import axios from 'axios'

// test html: https://getdaytrends.com/indonesia/bekasi/
const mockTwitterTrends = {
  data: [
    {
      "name": "#TimnasIndonesia",
      "url": "http://twitter.com/search?q=%23TimnasIndonesia",
      "promoted_content": null,
      "query": "%23TimnasIndonesia",
      "tweet_volume": 221000
    },
    {
      "name": "Test 1",
      "url": "http://twitter.com/search?q=Test 1",
      "promoted_content": null,
      "query": "Test 1",
      "tweet_volume": 9000
    },
    {
      "name": "#Test2",
      "url": "http://twitter.com/search?q=%23Test2",
      "promoted_content": null,
      "query": "%23Test2",
      "tweet_volume": 539000
    },
    {
      "name": "Test 3",
      "url": "http://twitter.com/search?q=Test 3",
      "promoted_content": null,
      "query": "Test 3",
      "tweet_volume": 545000
    },
  ]
}

// GET
vi.spyOn(axios, 'get').mockResolvedValueOnce(mockTwitterTrends)

describe('Twitter Trends API', async() => {
  assert.exists(TwitterTrendsAPI)

  const wrapper = mount(TwitterTrendsAPI, {
    props: { },
    data() {
      return {
        arraytrends: [
          {
            name: '#TimnasIndonesia',
            tweet_volume: '22.1K tweets',
            completed: true
          },
          {
            name: 'Test 1',
            tweet_volume: 'Under 10K tweets',
            completed: true
          },
          {
            name: '#Test2',
            tweet_volume: '53.9K tweets',
            completed: true
          },
          {
            name: 'Test 3',
            tweet_volume: '54.5K tweets',
            completed: true
          },
        ],
      }
    }
  })

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get).toHaveBeenCalledWith('https://twitter-trends-heroku.herokuapp.com/api/trends')

  // Wait until the DOM updates.
  await flushPromises()

  // button: btnSubmit
  const btnSubmit = wrapper.find('[data-test="btn-submit"]')

  // textarea: hasil
  const hasil = wrapper.find('[data-test="hasil"]')

  // button: btnCopy 
  const btnCopy = wrapper.find('[data-test="btn-copy"]')
  // button: btnTweet
  const btnTweet = wrapper.find('[data-test="btn-tweet"]')

  // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
  const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]') 

  // `semua kotak centang` diaktifkan
  const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')
  it('init', async() => {
    // button: btnSubmit diaktifkan
    assert.isUndefined(btnSubmit.attributes().disabled)

    // textarea hasil: test getdaytrends.com
    assert.equal(hasil.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')

    window.alert = vi.fn()
    window.alert.mockClear()

    // button: btnCopy dan btnTweet diaktifkan
    assert.isUndefined(btnCopy.attributes().disabled)
    assert.isUndefined(btnTweet.attributes().disabled)
    
    assert.equal(btnTweet.text(), 'Tweet is: + 234')
  })  

  // // array dan checkbox untuk trends
  // const arrayTrends = wrapper.findAll('[data-test="array-trends"]')
  // const checkboxTrends = wrapper.findAll('[data-test="trends-checkbox"]')
  
  // it('kotak centang untuk trends di getdaytrends.com: baru', async => {
  //   for (let i = 0; i < arrayTrends.length; i++) {
  //     expect(arrayTrends.at(i).classes()).toContain('completed')
  //   }
  // })
  
  // it('kotak centang untuk trends di getdaytrends.com: tidak dicentang', async() => {
  //   assert.equal(hasil.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
  //   assert.equal(btnTweet.text(), 'Tweet is: + 234')

  //   // test cases
  //   const testCases = [
  //     {
  //       name: '#TimnasIndonesia',
  //       index: 0,
  //       listBool: [false, true, true, true],
  //       hasil: 'Tags: Test 1, #Test2, Test 3',
  //       tweetIs: 'Tweet is: + 252',
  //       // `semua kotak centang` diaktifkan
  //       allCheckboxesEnabled: 'diaktifkan: 3'
  //     },
  //     {
  //       name: 'Test 1',
  //       index: 1,
  //       listBool: [false, false, true, true],
  //       hasil: 'Tags: #Test2, Test 3',
  //       tweetIs: 'Tweet is: + 260',
  //       allCheckboxesEnabled: 'diaktifkan: 2'
  //     },
  //     {
  //       name: '#Test2',
  //       index: 2,
  //       listBool: [false, false, false, true],
  //       hasil: 'Tags: Test 3',
  //       tweetIs: 'Tweet is: + 268',
  //       allCheckboxesEnabled: 'diaktifkan: 1'
  //     },
  //     {
  //       name: 'Test 3',
  //       index: 3,
  //       listBool: [false, false, false, false],
  //       hasil: 'Tidak ada hasil',
  //       tweetIs: 'Tweet is: + 280',
  //       allCheckboxesEnabled: 'diaktifkan: 0'
  //     },
  //   ]

  //   for (let test of testCases) {
  //     console.debug('unchecked ke-', test.name)
  //     await checkboxTrends.at(test.index).setValue(false)
      
  //     for (let i = 0; i < test.listBool.length; i++) {
  //       if (test.listBool[i]) {
  //         expect(arrayTrends.at(i).classes()).toContain('completed')
  //       } else {
  //         // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
  //         expect(arrayTrends.at(i).classes()).to.deep.equal([])
  //       }
  //     }

  //     assert.equal(hasil.element.value, test.hasil)
  //     assert.equal(btnTweet.text(), test.tweetIs)
  //     // `semua kotak centang` diaktifkan
  //     assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
  //   }
  // })
  
  // it('kotak centang untuk trends di getdaytrends.com: dicentang', async() => {
  //   console.debug('-----')

  //   assert.equal(hasil.element.value, 'Tidak ada hasil')

  //   // test cases
  //   const testCases = [   
  //     {
  //       name: 'Test 1',
  //       index: 1,
  //       listBool: [false, true, false, false],
  //       hasil: 'Tags: Test 1',
  //     },
  //     {
  //       name: 'Test 3',
  //       index: 3,
  //       listBool: [false, true, false, true],
  //       hasil: 'Tags: Test 1, Test 3',
  //     },
  //     {
  //       name: '#TimnasIndonesia',
  //       index: 0,
  //       listBool: [true, true, false, true],
  //       hasil: 'Tags: #TimnasIndonesia, Test 1, Test 3',
  //     },
  //     {
  //       name: '#Test2',
  //       index: 2,
  //       listBool: [true, true, true, true],
  //       hasil: 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3',
  //     }  
  //   ]
  
  //   for (let test of testCases) {
  //     console.debug('checked ke-', test.name)
  //     await checkboxTrends.at(test.index).setValue(true)
      
  //     for (let i = 0; i < test.listBool.length; i++) {
  //       if (test.listBool[i]) {
  //         expect(arrayTrends.at(i).classes()).toContain('completed')
  //       } else {
  //         // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
  //         expect(arrayTrends.at(i).classes()).to.deep.equal([])
  //       }
  //     }

  //     assert.equal(hasil.element.value, test.hasil)
  //   }
  // })
  
  // it('button `semua kotak centang` di array untuk trends: tidak diaktifkan', async() => {
  //   assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')

  //   let listBool = [true, true, true, true]
  //   for (let i = 0; i < listBool.length; i++) {
  //     expect(arrayTrends.at(i).classes()).toContain('completed')
  //   }

  //   await btnCheckBoxAll.trigger('click')
  //   assert.equal(btnCheckBoxAll.text(), 'diaktifkan')
  //   assert.equal(hasil.element.value, 'Tidak ada hasil')

  //   listBool = [false, false, false, false]
  //   for (let i = 0; i < listBool.length; i++) {
  //     // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
  //     expect(arrayTrends.at(i).classes()).to.deep.equal([])
  //   }

  //   await btnCheckBoxAll.trigger('click')
  //   assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')
  //   assert.equal(hasil.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
  // })

  // it('textarea `hasil` untuk array untuk trends: tidak dicentang', async() => {
  //   await copydanpaste.trigger('change')
        
  //   assert.equal(hasil.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
  //   assert.equal(btnTweet.text(), 'Tweet is: + 234')

  //   // test cases
  //   const testCases = [
  //     {
  //       name: '#TimnasIndonesia',
  //       index: 0,
  //       listBool: [false, true, true, true],
  //       hasil: 'Tags: Test 1, #Test2, Test 3',
  //       tweetIs: 'Tweet is: + 252',
  //       // `semua kotak centang` diaktifkan
  //       allCheckboxesEnabled: 'diaktifkan: 3'
  //     },
  //     {
  //       name: 'Test 1',
  //       index: 1,
  //       listBool: [false, false, true, true],
  //       hasil: 'Tags: #Test2, Test 3',
  //       tweetIs: 'Tweet is: + 260',
  //       allCheckboxesEnabled: 'diaktifkan: 2'
  //     },
  //     {
  //       name: '#Test2',
  //       index: 2,
  //       listBool: [false, false, false, true],
  //       hasil: 'Tags: Test 3',
  //       tweetIs: 'Tweet is: + 268',
  //       allCheckboxesEnabled: 'diaktifkan: 1'
  //     },
  //     {
  //       name: 'Test 3',
  //       index: 3,
  //       listBool: [false, false, false, false],
  //       hasil: 'Tidak ada hasil',
  //       tweetIs: 'Tweet is: + 280',
  //       allCheckboxesEnabled: 'diaktifkan: 0'
  //     }
  //   ]

  //   for (let test of testCases) {
  //     console.debug('unchecked ke-', test.name)
  //     await checkboxTrends.at(test.index).setValue(false)
      
  //     for (let i = 0; i < test.listBool.length; i++) {
  //       if (test.listBool[i]) {
  //         expect(arrayTrends.at(i).classes()).toContain('completed')
  //       } else {
  //         // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
  //         expect(arrayTrends.at(i).classes()).to.deep.equal([])
  //       }
  //     }

  //     assert.equal(hasil.element.value, test.hasil)
  //     assert.equal(btnTweet.text(), test.tweetIs)
  //     // `semua kotak centang` diaktifkan
  //     assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
  //   }
  // })

  // it('textarea `hasil` untuk array untuk trends: dicentang', async() => {    
  //   console.debug('-----')
    
  //   assert.equal(hasil.element.value, 'Tidak ada hasil')

  //   // test cases
  //   const testCases = [   
  //     {
  //       name: 'Test 1',
  //       index: 1,
  //       listBool: [false, true, false, false],
  //       hasil: 'Tags: Test 1',
  //       tweetIs: 'Tweet is: + 268',
  //       // `semua kotak centang` diaktifkan
  //       allCheckboxesEnabled: 'diaktifkan: 1'
  //     },
  //     {
  //       name: 'Test 3',
  //       index: 3,
  //       listBool: [false, true, false, true],
  //       hasil: 'Tags: Test 1, Test 3',
  //       tweetIs: 'Tweet is: + 260',
  //       allCheckboxesEnabled: 'diaktifkan: 2'
  //     },
  //     {
  //       name: '#TimnasIndonesia',
  //       index: 0,
  //       listBool: [true, true, false, true],
  //       hasil: 'Tags: #TimnasIndonesia, Test 1, Test 3',
  //       tweetIs: 'Tweet is: + 242',
  //       allCheckboxesEnabled: 'diaktifkan: 3'
  //     },
  //     {
  //       name: '#Test2',
  //       index: 2,
  //       listBool: [true, true, true, true],
  //       hasil: 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3',
  //       tweetIs: 'Tweet is: + 234',
  //       allCheckboxesEnabled: 'diaktifkan: 4'
  //     }  
  //   ]

  //   for (let test of testCases) {
  //     console.debug('checked ke-', test.name)
  //     await checkboxTrends.at(test.index).setValue(true)
      
  //     for (let i = 0; i < test.listBool.length; i++) {
  //       if (test.listBool[i]) {
  //         expect(arrayTrends.at(i).classes()).toContain('completed')
  //       } else {
  //         // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
  //         expect(arrayTrends.at(i).classes()).to.deep.equal([])
  //       }

  //       assert.equal(btnTweet.text(), test.tweetIs)
  //     }

  //     assert.equal(hasil.element.value, test.hasil)
  //     // `semua kotak centang` diaktifkan
  //     assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
  //   }
  // })

  // it('button `semua kotak centang` di array untuk trends: tidak diaktifkan', async() => {
  //   assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')

  //   let listBool = [true, true, true, true]
  //   for (let i = 0; i < listBool.length; i++) {
  //     expect(arrayTrends.at(i).classes()).toContain('completed')
  //   }

  //   await btnCheckBoxAll.trigger('click')
  //   assert.equal(btnCheckBoxAll.text(), 'diaktifkan')
  //   assert.equal(hasil.element.value, 'Tidak ada hasil')

  //   listBool = [false, false, false, false]
  //   for (let i = 0; i < listBool.length; i++) {
  //     // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
  //     expect(arrayTrends.at(i).classes()).to.deep.equal([])
  //   }

  //   await btnCheckBoxAll.trigger('click')
  //   assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')
  //   assert.equal(hasil.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
  // })

  // it('jumlah tweet', () => {
  //   assert.equal(arrayTrends.at(0).get('.tweetVolume-class').text(), '')
  //   assert.equal(arrayTrends.at(1).get('.tweetVolume-class').text(), '(2.233 rb Tweet)')
  //   assert.equal(arrayTrends.at(2).get('.tweetVolume-class').text(), '(1.660 Tweet)')
  //   assert.equal(arrayTrends.at(3).get('.tweetVolume-class').text(), '(54.5K Tweet)')
  // })

  // it('topik yang sedang tren', () => {
  //   assert.equal(arrayTrends.at(0).get('.trendingTopics-class').text(), 'Olahraga · Populer')
  //   assert.equal(arrayTrends.at(1).get('.trendingTopics-class').text(), 'Sedang tren dalam topik Indonesia')
  //   assert.equal(arrayTrends.at(2).get('.trendingTopics-class').text(), 'Sedang tren dalam topik Indonesia')
  //   assert.equal(arrayTrends.at(3).get('.trendingTopics-class').text(), 'Technology · Trending')
  // })
})