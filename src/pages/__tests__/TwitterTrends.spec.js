import { describe, it, assert, expect, vi } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import TwitterTrendsAPI from '../TwitterTrendsAPI.vue'

import axios from 'axios'

// test html: https://getdaytrends.com/indonesia/bekasi/
const mockTwitterTrends = {
  data: [{"name":"#Test1","url":"http://twitter.com/search?q=%23Test1","tweet_volume":null},{"name":"#Test2","url":"http://twitter.com/search?q=%23Test2","tweet_volume":null},{"name":"#Test3","url":"http://twitter.com/search?q=%23Test3","tweet_volume":null},{"name":"#Test4","url":"http://twitter.com/search?q=%23Test4","tweet_volume":34487},{"name":"#Test5","url":"http://twitter.com/search?q=%23Test5","tweet_volume":17718},{"name":"Test 6","url":"http://twitter.com/search?q=%22Test+1%22","tweet_volume":23644},{"name":"Test 7","url":"http://twitter.com/search?q=%22Test+7%22","tweet_volume":null},{"name":"Test 8","url":"http://twitter.com/search?q=%22Test+8%22","tweet_volume":null},{"name":"Test 9","url":"http://twitter.com/search?q=%22Test+9%22","tweet_volume":null},{"name":"Test 10","url":"http://twitter.com/search?q=%22Test+10%22","tweet_volume":null},{"name":"Test 11","url":"http://twitter.com/search?q=%22Test+11%22","tweet_volume":null},{"name":"Test 12","url":"http://twitter.com/search?q=%22Test+12%22","tweet_volume":null},{"name":"Test 13","url":"http://twitter.com/search?q=%22Test+13%22","tweet_volume":null},{"name":"Test 14","url":"http://twitter.com/search?q=Test 14","query":"Toothless","tweet_volume":null},{"name":"Test 15","url":"http://twitter.com/search?q=%22Test+15%22","tweet_volume":null},{"name":"Faults 1","url":"http://twitter.com/search?q=%22Faults+1%22","tweet_volume":null},{"name":"Faults 2","url":"http://twitter.com/search?q=%22Faults+2%22","tweet_volume":null}]
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
          {name:"#Test1",url:"http://twitter.com/search?q=%23Test1",tweet_volume:null, completed:true},
          {name:"#Test2",url:"http://twitter.com/search?q=%23Test2",tweet_volume:null, completed:true},
          {name:"#Test3",url:"http://twitter.com/search?q=%23Test3",tweet_volume:null, completed:true},
          {name:"#Test4",url:"http://twitter.com/search?q=%23Test4",tweet_volume:34487, completed:true},
          {name:"#Test5",url:"http://twitter.com/search?q=%23Test5",tweet_volume:17718, completed:true},
          {name:"Test 6",url:"http://twitter.com/search?q=%22Test+1%22",tweet_volume:23644, completed:true},
          {name:"Test 7",url:"http://twitter.com/search?q=%22Test+7%22",tweet_volume:null, completed:true},
          {name:"Test 8",url:"http://twitter.com/search?q=%22Test+8%22",tweet_volume:null, completed:true},
          {name:"Test 9",url:"http://twitter.com/search?q=%22Test+9%22",tweet_volume:null, completed:true},
          {name:"Test 10",url:"http://twitter.com/search?q=%22Test+10%22",tweet_volume:null, completed:true},
          {name:"Test 11",url:"http://twitter.com/search?q=%22Test+11%22",tweet_volume:null, completed:true},
          {name:"Test 12",url:"http://twitter.com/search?q=%22Test+12%22",tweet_volume:null, completed:true},
          {name:"Test 13",url:"http://twitter.com/search?q=%22Test+13%22",tweet_volume:null, completed:true},
          {name:"Test 14",url:"http://twitter.com/search?q=Test 14",tweet_volume:null, completed:true},
          {name:"Test 15",url:"http://twitter.com/search?q=%22Test+15%22",tweet_volume:null, completed:true},
          {name:"Faults 1",url:"http://twitter.com/search?q=%22Faults+1%22",tweet_volume:null, completed:false},
          {name:"Faults 2",url:"http://twitter.com/search?q=%22Faults+2%22",tweet_volume:null, completed:false}
        ]
      }
    }
  })

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get).toHaveBeenCalledWith('https://twitter-trends-redirect.herokuapp.com/api/trends')

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
  it('init', () => {
    // button: btnSubmit diaktifkan
    assert.isUndefined(btnSubmit.attributes().disabled)

    // textarea hasil: test getdaytrends.com
    assert.equal(hasil.element.value, 'Tags: #Test1, #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15')

    window.alert = vi.fn()
    window.alert.mockClear()

    // button: btnCopy dan btnTweet diaktifkan
    assert.isUndefined(btnCopy.attributes().disabled)
    assert.isUndefined(btnTweet.attributes().disabled)
    
    assert.equal(btnTweet.text(), 'Tweet is: + 150')
  })  

  // array dan checkbox untuk trends
  const arrayTrends = wrapper.findAll('[data-test="array-trends"]')
  const checkboxTrends = wrapper.findAll('[data-test="trends-checkbox"]')
  
  it('kotak centang untuk trends di Twitter Trends API: baru', () => {
    assert.equal(arrayTrends.length, 17)
    
    for (let i = 0; i < 15; i++) {
      expect(arrayTrends.at(i).classes()).toContain('completed')
    }

    for (let i = 15; i < arrayTrends.length; i++) {
      expect(arrayTrends.at(i).classes()).to.deep.equal([])
    }
  })
  
  it('kotak centang untuk trends di Twitter Trends API: tidak dicentang', async() => {
    assert.equal(hasil.element.value, 'Tags: #Test1, #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15')
    assert.equal(btnTweet.text(), 'Tweet is: + 150')

    // test cases
    const testCases = [
      {
        name: '#Test1',
        index: 0,
        listBool: [false, true, true, true],
        hasil: 'Tags: #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 158',
        // `semua kotak centang` diaktifkan
        allCheckboxesEnabled: 'diaktifkan: 14'
      },
      {
        name: '#Test2',
        index: 1,
        listBool: [false, false, true, true],
        hasil: 'Tags: #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 166',
        allCheckboxesEnabled: 'diaktifkan: 13'
      },
      {
        name: '#Test3',
        index: 2,
        listBool: [false, false, false, true],
        hasil: 'Tags: #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 174',
        allCheckboxesEnabled: 'diaktifkan: 12'
      },
      {
        name: '#Test4',
        index: 3,
        listBool: [false, false, false, false],
        hasil: 'Tags: #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 182',
        allCheckboxesEnabled: 'diaktifkan: 11'
      },
    ]

    for (let test of testCases) {
      console.debug('unchecked ke-', test.name)
      await checkboxTrends.at(test.index).setValue(false)
      
      for (let i = 0; i < test.listBool.length; i++) {
        if (test.listBool[i]) {
          expect(arrayTrends.at(i).classes()).toContain('completed')
        } else {
          // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
          expect(arrayTrends.at(i).classes()).to.deep.equal([])
        }
      }

      assert.equal(hasil.element.value, test.hasil)
      assert.equal(btnTweet.text(), test.tweetIs)
      // `semua kotak centang` diaktifkan
      assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
    }

    console.debug('unchecked ke-5 sd. ke-15')
    for (let i = 4; i < 15; i++) {
      await checkboxTrends.at(i).setValue(false)
      expect(arrayTrends.at(i).classes()).to.deep.equal([])
    }

    assert.equal(hasil.element.value, 'Tidak ada hasil')
    assert.equal(btnTweet.text(), 'Tweet is: + 280')
    // `semua kotak centang` tidak diaktifkan
    assert.equal(allCheckboxesEnabled.text(), 'diaktifkan: 0')
  })
  
  it('kotak centang untuk trends di getdaytrends.com: dicentang', async() => {
    console.debug('-----')

    assert.equal(hasil.element.value, 'Tidak ada hasil')

    // test cases
    const testCases = [   
      {
        name: '#Test2',
        index: 1,
        listBool: [false, true, false, false],
        hasil: 'Tags: #Test2',
      },
      {
        name: '#Test4',
        index: 3,
        listBool: [false, true, false, true],
        hasil: 'Tags: #Test2, #Test4',
      },
      {
        name: '#Test1',
        index: 0,
        listBool: [true, true, false, true],
        hasil: 'Tags: #Test1, #Test2, #Test4',
      },
      {
        name: '#Test3',
        index: 2,
        listBool: [true, true, true, true],
        hasil: 'Tags: #Test1, #Test2, #Test3, #Test4',
      }  
    ]
  
    for (let test of testCases) {
      console.debug('checked ke-', test.name)
      await checkboxTrends.at(test.index).setValue(true)
      
      for (let i = 0; i < test.listBool.length; i++) {
        if (test.listBool[i]) {
          expect(arrayTrends.at(i).classes()).toContain('completed')
        } else {
          // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
          expect(arrayTrends.at(i).classes()).to.deep.equal([])
        }
      }

      assert.equal(hasil.element.value, test.hasil)
    }

    console.debug('checked ke-5 sd. ke-15')
    for (let i = 4; i < 15; i++) {
      await checkboxTrends.at(i).setValue(true)
      expect(arrayTrends.at(i).classes()).toContain('completed')
    }

    assert.equal(hasil.element.value, 'Tags: #Test1, #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15')
    assert.equal(btnTweet.text(), 'Tweet is: + 150')
    // `semua kotak centang` diaktifkan
    assert.equal(allCheckboxesEnabled.text(), 'diaktifkan: 15')
  })
  
  it('button `semua kotak centang` di array untuk trends: tidak diaktifkan', async() => {
    assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')

    await btnCheckBoxAll.trigger('click')
    assert.equal(btnCheckBoxAll.text(), 'diaktifkan')
    assert.equal(hasil.element.value, 'Tidak ada hasil')

    for (let i = 0; i < arrayTrends.length; i++) {
      // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
      expect(arrayTrends.at(i).classes()).to.deep.equal([])
    }

    await btnCheckBoxAll.trigger('click')
    assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')
    assert.equal(hasil.element.value, 'Tags: #Test1, #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15')
    assert.equal(btnTweet.text(), 'Tweet is: + 150')
  })

  it('textarea `hasil` untuk array untuk trends: tidak dicentang', async() => {
    // test cases
    const testCases = [
      {
        name: '#Test1',
        index: 0,
        listBool: [false, true, true, true],
        hasil: 'Tags: #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 158',
        // `semua kotak centang` diaktifkan
        allCheckboxesEnabled: 'diaktifkan: 14'
      },
      {
        name: '#Test2',
        index: 1,
        listBool: [false, false, true, true],
        hasil: 'Tags: #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 166',
        allCheckboxesEnabled: 'diaktifkan: 13'
      },
      {
        name: '#Test3',
        index: 2,
        listBool: [false, false, false, true],
        hasil: 'Tags: #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 174',
        allCheckboxesEnabled: 'diaktifkan: 12'
      },
      {
        name: '#Test4',
        index: 3,
        listBool: [false, false, false, false],
        hasil: 'Tags: #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15',
        tweetIs: 'Tweet is: + 182',
        allCheckboxesEnabled: 'diaktifkan: 11'
      }
    ]

    for (let test of testCases) {
      console.debug('unchecked ke-', test.name)
      await checkboxTrends.at(test.index).setValue(false)
      
      for (let i = 0; i < test.listBool.length; i++) {
        if (test.listBool[i]) {
          expect(arrayTrends.at(i).classes()).toContain('completed')
        } else {
          // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
          expect(arrayTrends.at(i).classes()).to.deep.equal([])
        }
      }

      assert.equal(hasil.element.value, test.hasil)
      assert.equal(btnTweet.text(), test.tweetIs)
      // `semua kotak centang` diaktifkan
      assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
    }

    console.debug('unchecked ke-5 sd. ke-15')
    for (let i = 4; i < 15; i++) {
      await checkboxTrends.at(i).setValue(false)
      // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
      expect(arrayTrends.at(i).classes()).to.deep.equal([])
    }

    assert.equal(hasil.element.value, 'Tidak ada hasil')
    assert.equal(btnTweet.text(), 'Tweet is: + 280')
    // `semua kotak centang` diaktifkan
    assert.equal(allCheckboxesEnabled.text(), 'diaktifkan: 0')
  })

  it('textarea `hasil` untuk array untuk trends: dicentang', async() => {    
    console.debug('-----')
    
    assert.equal(hasil.element.value, 'Tidak ada hasil')

    // test cases
    const testCases = [   
      {
        name: '#Test2',
        index: 1,
        listBool: [false, true, false, false],
        hasil: 'Tags: #Test2',
        tweetIs: 'Tweet is: + 268',
        // `semua kotak centang` diaktifkan
        allCheckboxesEnabled: 'diaktifkan: 1'
      },
      {
        name: '#Test4',
        index: 3,
        listBool: [false, true, false, true],
        hasil: 'Tags: #Test2, #Test4',
        tweetIs: 'Tweet is: + 260',
        allCheckboxesEnabled: 'diaktifkan: 2'
      },
      {
        name: '#Test1',
        index: 0,
        listBool: [true, true, false, true],
        hasil: 'Tags: #Test1, #Test2, #Test4',
        tweetIs: 'Tweet is: + 252',
        allCheckboxesEnabled: 'diaktifkan: 3'
      },
      {
        name: '#Test3',
        index: 2,
        listBool: [true, true, true, true],
        hasil: 'Tags: #Test1, #Test2, #Test3, #Test4',
        tweetIs: 'Tweet is: + 244',
        allCheckboxesEnabled: 'diaktifkan: 4'
      }  
    ]

    for (let test of testCases) {
      console.debug('checked ke-', test.name)
      await checkboxTrends.at(test.index).setValue(true)
      
      for (let i = 0; i < test.listBool.length; i++) {
        if (test.listBool[i]) {
          expect(arrayTrends.at(i).classes()).toContain('completed')
        } else {
          // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
          expect(arrayTrends.at(i).classes()).to.deep.equal([])
        }

        assert.equal(btnTweet.text(), test.tweetIs)
      }

      assert.equal(hasil.element.value, test.hasil)
      // `semua kotak centang` diaktifkan
      assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
    }

    console.debug('checked ke-5 sd. ke-15')
    for (let i = 4; i < 15; i++) {
      await checkboxTrends.at(i).setValue(true)
      expect(arrayTrends.at(i).classes()).toContain('completed')
    }

    assert.equal(hasil.element.value, 'Tags: #Test1, #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15')
    assert.equal(btnTweet.text(), 'Tweet is: + 150')
    // `semua kotak centang` diaktifkan
    assert.equal(allCheckboxesEnabled.text(), 'diaktifkan: 15')
  })

  it('button `semua kotak centang` di array untuk trends: tidak diaktifkan', async() => {
    assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')

    await btnCheckBoxAll.trigger('click')
    assert.equal(btnCheckBoxAll.text(), 'diaktifkan')
    assert.equal(hasil.element.value, 'Tidak ada hasil')

    for (let i = 0; i < arrayTrends.length; i++) {
      // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
      expect(arrayTrends.at(i).classes()).to.deep.equal([])
    }

    await btnCheckBoxAll.trigger('click')
    assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')
    assert.equal(hasil.element.value, 'Tags: #Test1, #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15')
  })

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