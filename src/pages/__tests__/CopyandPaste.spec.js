import { describe, it, assert, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import CopyandPaste from '../CopyandPaste.vue'

const TWEET = 'Timnas Indonesia! 🙂'

describe('Copy and Paste', () => {
  assert.exists(CopyandPaste)

  const wrapper = mount(CopyandPaste, {
    props: { } 
  })

  // textarea: tweet text, copyandpaste dan hasil tags
  const tweetText = wrapper.find('[data-test="tweet-text"]')
  const copyandpaste = wrapper.find('[data-test="copyandpaste"]')
  const resultsTags = wrapper.find('[data-test="results-tags"]')

  // button: btnResetTweet, btnResetTags dan btnCopy
  const btnResetTweet = wrapper.find('[data-test="btn-reset-tweet"]') 
  const btnResetTags = wrapper.find('[data-test="btn-reset-tags"]') 
  const btnCopy = wrapper.find('[data-test="btn-copy"]')

  // button: btnTweet
  const btnTweet = wrapper.find('[data-test="btn-tweet"]')

  it('init', async() => {
    assert.isEmpty(copyandpaste.element.value)
    // TODO: copydanpaste.element.focus() => undefined. Why?
    assert.equal(copyandpaste.element.focus(), undefined)

    assert.isEmpty(tweetText.element.value)
    assert.isEmpty(resultsTags.element.value)

    assert.isUndefined(btnResetTags.attributes().disabled)
    assert.equal(btnCopy.attributes().disabled, '')
  })  

  it('lingkaran dari `for`', async() => {
    // test cases
    const testCases = [
      // tweet: ok
      {
        name: 'Test 1',
        tweetText: TWEET,
        copyandpaste:`
...
>>> Indonesia

Sedang tren dalam topik Indonesia
(Indonesia) Menpan RB
Olahraga · Populer
(Indonesia) #TimnasIndonesia
2.233 rb Tweet
Sedang tren dalam topik Indonesia
(Indonesia) Yayasan Aksi Cepat Tanggap
1.660 Tweet

>>> Inggris
Trending in Indonesia
(Inggris) Menpan RB
Trending in Indonesia
(Inggris) #TimnasIndonesia
10.9K Tweets
Entertainment · Trending
(Inggris) Yayasan Aksi Cepat Tanggap
54.5 Tweets
`, 
        resultsTags: 'Tags: (Indonesia) Menpan RB, (Indonesia) #TimnasIndonesia, (Indonesia) Yayasan Aksi Cepat Tanggap, (Inggris) Menpan RB, (Inggris) #TimnasIndonesia, (Inggris) Yayasan Aksi Cepat Tanggap',
        copyIs: 'Copy is: + 74',
        tweetIs: 'Tweet is: + 73',
        bntCopyAndTweet: true
      },
      {
        name: 'Test 2',
        tweetText: TWEET,
        copyandpaste: '-',
        resultsTags: 'Tidak ada hasil',
        copyIs: 'Copy is: + 260',
        tweetIs: 'Tweet is: + 260',
        bntCopyAndTweet: false
      },
      {
        name: 'Test 3',
        tweetText: TWEET,
        copyandpaste: '',
        resultsTags: '',
        copyIs: 'Copy is: + 260',
        tweetIs: 'Tweet is: + 260',
        bntCopyAndTweet: false
      }
    ]

    for (let test of testCases) {
      console.debug('group ke-', test.name)

      copyandpaste.setValue(test.copyandpaste)
      assert.equal(test.copyandpaste, copyandpaste.element.value)
      await copyandpaste.trigger('change')

      assert.equal(
        resultsTags.element.value,
        test.resultsTags
      )

      tweetText.setValue(test.tweetText)
      await tweetText.trigger('change')
      assert.equal(tweetText.element.value, test.tweetText)

      assert.equal(btnCopy.text(), test.copyIs)
      assert.equal(btnTweet.text(), test.tweetIs)

      if (test.bntCopyAndTweet) {
        // button: bntCopy dan bntTweet diaktifkan
        assert.isUndefined(btnCopy.attributes().disabled)
        assert.isUndefined(btnTweet.attributes().disabled)
      } else {
        // button: bntCopy dan bntTweet dinonaktifkan
        assert.equal(btnCopy.attributes().disabled, '')
        assert.equal(btnTweet.attributes().disabled, '')
      }
    }

    // // ?
    // copydanpaste.setValue('')
    // await copydanpaste.trigger('change')
    // assert.equal(
    //   hasil.element.value,
    //   ''
    // )
    // assert.equal(btnCopy.attributes().disabled, '')
    // assert.equal(btnTweet.attributes().disabled, '')
  })

  it('button reset tweet', async() => {
    tweetText.setValue(TWEET)
    assert.equal(tweetText.element.value, TWEET)

    await btnResetTweet.trigger('click')
    assert.equal(tweetText.element.value, '')
  })

  it('button reset tags', async() => {
    // 1. textarea: copydanpaste = '-'
    // 2. textarea: hasil = 'Tidak ada hasil'
    copyandpaste.setValue('-')
    resultsTags.setValue('Tidak ada hasil')

    assert.equal(copyandpaste.element.value, '-')
    assert.equal(resultsTags.element.value, 'Tidak ada hasil')

    await btnResetTags.trigger('click')
    assert.equal(copyandpaste.element.value, '')
    assert.equal(resultsTags.element.value, '')
  })
})


// TDD
// ✅ ❌
// 1. textarea `hasil` untuk array untuk trends ✅
// 2. textarea `tweet` ini diaktifkan, jika maks. 280 karakter ✅
// 3. textarea `copy` ini diaktifkan dan textarea `tweet` jika ini dinonaktifkan ✅
// 4. button `semua kotak centang` jika ini diaktifkan atau tidak diaktifkan ✅
describe('Tweet', () => {
  assert.exists(CopyandPaste)

  const wrapper = mount(CopyandPaste, {
    props: { },
    data() {
      return {
        arraytrends: [
          {
            name: "#TimnasIndonesia",
            tweetVolume: '200k Tweets',
            completed: true
          },
          {
            name: "Test 1",
            tweetVolume: '1k Tweets',
            completed: true
          },
          {
            name: "#Test2",
            tweetVolume: '2k Tweets',
            completed: true
          },
          {
            name: "Test 3",
            tweetVolume: 0,
            completed: true
          }
        ]
      }
    } 
  })

  // textarea: tweet text
  const tweetText = wrapper.find('[data-test="tweet-text"]')

  // array dan checkbox untuk trends
  const arrayTrends = wrapper.findAll('[data-test="array-trends"]')
  const checkboxTrends = wrapper.findAll('[data-test="trends-checkbox"]')

  // textarea: copydanpaste dan hasil
  const copyandpaste = wrapper.find('[data-test="copyandpaste"]')
  const resultsTags = wrapper.find('[data-test="results-tags"]')

  // button: btnTweet
  const btnCopy = wrapper.find('[data-test="btn-copy"]')
  const btnTweet = wrapper.find('[data-test="btn-tweet"]')
  // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
  const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]') 
  
  // `semua kotak centang` diaktifkan
  const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

  copyandpaste.setValue(`
...
Olahraga · Populer
#TimnasIndonesia
Sedang tren dalam topik Indonesia
Test 1
2.233 rb Tweet
Sedang tren dalam topik Indonesia
#Test2
1.660 Tweet
Technology · Trending
Test 3
54.5K Tweet
...
  `)

  it('textarea `hasil` untuk array untuk trends: tidak dicentang', async() => {    
    tweetText.setValue(TWEET)
    assert.equal(tweetText.element.value, TWEET)
    assert.equal(btnTweet.text(), 'Tweet is: + 234')
    
    await copyandpaste.trigger('change')
        
    assert.equal(resultsTags.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
    assert.equal(btnTweet.text(), 'Tweet is: + 211')

    // test cases
    const testCases = [
      // tweet: ok
      {
        name: '#TimnasIndonesia',
        index: 0,
        listBool: [false, true, true, true],
        tweetText: TWEET,
        resultsTags: 'Tags: Test 1, #Test2, Test 3',
        copyIs: 'Copy is: + 230',
        tweetIs: 'Tweet is: + 229',
        // `semua kotak centang` diaktifkan
        allCheckboxesEnabled: 'diaktifkan: 3'
      },
      {
        name: 'Test 1',
        index: 1,
        listBool: [false, false, true, true],
        tweetText: TWEET,
        resultsTags: 'Tags: #Test2, Test 3',
        copyIs: 'Copy is: + 238',
        tweetIs: 'Tweet is: + 237',
        allCheckboxesEnabled: 'diaktifkan: 2'
      },
      {
        name: '#Test2',
        index: 2,
        listBool: [false, false, false, true],
        tweetText: '',
        resultsTags: 'Tags: Test 3',
        copyIs: 'Copy is: + 265',
        tweetIs: 'Tweet is: + 265',
        allCheckboxesEnabled: 'diaktifkan: 1'
      },
      {
        name: 'Test 3',
        index: 3,
        listBool: [false, false, false, false],
        tweetText: '',
        resultsTags: 'Tidak ada hasil',
        copyIs: 'Copy is: + 280',
        tweetIs: 'Tweet is: + 280',
        allCheckboxesEnabled: 'diaktifkan: 0'
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
    
      tweetText.setValue(test.tweetText)
      assert.equal(tweetText.element.value, test.tweetText)
      assert.equal(resultsTags.element.value, test.resultsTags)
      assert.equal(btnCopy.text(), test.copyIs)
      assert.equal(btnTweet.text(), test.tweetIs)
      // `semua kotak centang` diaktifkan
      assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
    }
  })

//   it('textarea `hasil` untuk array untuk trends: dicentang', async() => {    
//     console.debug('-----')
    
//     assert.equal(results.element.value, 'Tidak ada hasil')

//     // test cases
//     const testCases = [   
//       {
//         name: 'Test 1',
//         index: 1,
//         listBool: [false, true, false, false],
//         hasil: 'Tags: Test 1',
//         tweetIs: 'Tweet is: + 268',
//         // `semua kotak centang` diaktifkan
//         allCheckboxesEnabled: 'diaktifkan: 1'
//       },
//       {
//         name: 'Test 3',
//         index: 3,
//         listBool: [false, true, false, true],
//         hasil: 'Tags: Test 1, Test 3',
//         tweetIs: 'Tweet is: + 260',
//         allCheckboxesEnabled: 'diaktifkan: 2'
//       },
//       {
//         name: '#TimnasIndonesia',
//         index: 0,
//         listBool: [true, true, false, true],
//         hasil: 'Tags: #TimnasIndonesia, Test 1, Test 3',
//         tweetIs: 'Tweet is: + 242',
//         allCheckboxesEnabled: 'diaktifkan: 3'
//       },
//       {
//         name: '#Test2',
//         index: 2,
//         listBool: [true, true, true, true],
//         hasil: 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3',
//         tweetIs: 'Tweet is: + 234',
//         allCheckboxesEnabled: 'diaktifkan: 4'
//       }  
//     ]

//     for (let test of testCases) {
//       console.debug('checked ke-', test.name)
//       await checkboxTrends.at(test.index).setValue(true)
      
//       for (let i = 0; i < test.listBool.length; i++) {
//         if (test.listBool[i]) {
//           expect(arrayTrends.at(i).classes()).toContain('completed')
//         } else {
//           // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
//           expect(arrayTrends.at(i).classes()).to.deep.equal([])
//         }

//         assert.equal(btnTweet.text(), test.tweetIs)
//       }

//       assert.equal(results.element.value, test.hasil)
//       // `semua kotak centang` diaktifkan
//       assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
//     }
//   })

//   it('button `semua kotak centang` di array untuk trends: tidak diaktifkan', async() => {
//     assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')

//     let listBool = [true, true, true, true]
//     for (let i = 0; i < listBool.length; i++) {
//       expect(arrayTrends.at(i).classes()).toContain('completed')
//     }

//     await btnCheckBoxAll.trigger('click')
//     assert.equal(btnCheckBoxAll.text(), 'diaktifkan')
//     assert.equal(results.element.value, 'Tidak ada hasil')

//     listBool = [false, false, false, false]
//     for (let i = 0; i < listBool.length; i++) {
//       // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
//       expect(arrayTrends.at(i).classes()).to.deep.equal([])
//     }

//     await btnCheckBoxAll.trigger('click')
//     assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')
//     assert.equal(results.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
//   })

//   it('jumlah tweet', () => {
//     assert.equal(arrayTrends.at(0).get('.tweet-volume-class').text(), '')
//     assert.equal(arrayTrends.at(1).get('.tweet-volume-class').text(), '(2.233 rb Tweet)')
//     assert.equal(arrayTrends.at(2).get('.tweet-volume-class').text(), '(1.660 Tweet)')
//     assert.equal(arrayTrends.at(3).get('.tweet-volume-class').text(), '(54.5K Tweet)')
//   })

//   it('topik yang sedang tren', () => {
//     assert.equal(arrayTrends.at(0).get('.trending-topics-class').text(), 'Olahraga · Populer')
//     assert.equal(arrayTrends.at(1).get('.trending-topics-class').text(), 'Sedang tren dalam topik Indonesia')
//     assert.equal(arrayTrends.at(2).get('.trending-topics-class').text(), 'Sedang tren dalam topik Indonesia')
//     assert.equal(arrayTrends.at(3).get('.trending-topics-class').text(), 'Technology · Trending')
//   })
})