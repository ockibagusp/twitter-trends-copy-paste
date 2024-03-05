import { describe, it, assert, expect } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import CopyandPaste from '../CopyandPaste.vue'

const wrapper = mount(CopyandPaste, {
  props: {}
})

// textarea: copyandpaste dan hasil
const copyandpaste = wrapper.find('[data-test="copyandpaste"]')
const newTweet = wrapper.find('[data-test="new-tweet"]')
const results = wrapper.find('[data-test="results"]')

// array dan checkbox untuk trends
const arrayTrends = wrapper.findAll('[data-test="array-trends"]')
const checkboxTrends = wrapper.findAll('[data-test="trends-checkbox"]')

// button: btnReset dan btnCopy
const btnReset = wrapper.find('[data-test="btn-reset"]')
const btnCopy = wrapper.find('[data-test="btn-copy"]')

// button: btnTweet
const btnTweet = wrapper.find('[data-test="btn-tweet"]')

// button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]')

// `semua kotak centang` diaktifkan
const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')

describe('Copy and Paste', () => {
  assert.exists(CopyandPaste)

  it('init', () => {
    assert.isEmpty(newTweet.element.value)
    assert.isEmpty(copyandpaste.element.value)
    // TODO: copydanpaste.element.focus() => undefined. Why?
    assert.equal(copyandpaste.element.focus(), undefined)
    assert.isEmpty(results.element.value)

    assert.isUndefined(btnReset.attributes().disabled)
    assert.equal(btnCopy.attributes().disabled, '')
    assert.equal(btnTweet.attributes().disabled, '')

    assert.equal(btnCheckBoxAll.exists(), false);
    assert.equal(btnCheckBoxAll.exists(), false)
    assert.equal(allCheckboxesEnabled.exists(), false)
  })

  it('button reset', async () => {
    // 1. textarea: copydanpaste = '-'
    // 2. textarea: hasil = 'Tidak ada hasil'

    // Failure
    newTweet.setValue('Failure')
    copyandpaste.setValue('-')
    await newTweet.trigger('change')

    assert.equal(newTweet.element.value, 'Failure')
    assert.equal(copyandpaste.element.value, '-')
    assert.equal(results.element.value, 'Tidak ada hasil')

    // ''
    newTweet.setValue('')
    copyandpaste.setValue('')
    await copyandpaste.trigger('change')

    await btnReset.trigger('click')
    assert.equal(newTweet.element.value, '')
    assert.equal(copyandpaste.element.value, '')
    assert.equal(results.element.value, '')
  })
})

// // TDD
// // ✅ ❌
// // 1. textarea `hasil` untuk array untuk trends ✅
// // 2. textarea `tweet` ini diaktifkan, jika maks. 280 karakter ✅
// // 3. textarea `copy` ini diaktifkan dan textarea `tweet` jika ini dinonaktifkan ✅
// // 4. button `semua kotak centang` jika ini diaktifkan atau tidak diaktifkan ✅
// describe('Tweet', () => {
//   assert.equal(copyandpaste.element.value, '')
//   assert.equal(results.element.value, '')

//   it('textarea `hasil` untuk array untuk trends: tidak dicentang', async () => {
//     const testCopyandpaste = `
// ...
// Olahraga · Populer
// #TimnasIndonesia
// Sedang tren dalam topik Indonesia
// Test 1
// 2.233 rb Tweet
// Sedang tren dalam topik Indonesia
// #Test2
// 1.660 Tweet
// Technology · Trending
// Test 3
// 54.5K Tweet
// ...
//   `;
//     copyandpaste.setValue(testCopyandpaste)

//     assert.equal(testCopyandpaste, copyandpaste.element.value)
//     await copyandpaste.trigger('change')

//     // ?
//     await flushPromises() // start loading, so vitest started loading

//     assert.equal(results.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
//     assert.equal(btnTweet.text(), 'Tweet is: + 234')

//     // test cases
//     const testCases = [
//       {
//         name: '#TimnasIndonesia',
//         index: 0,
//         listBool: [false, true, true, true],
//         results: 'Tags: Test 1, #Test2, Test 3',
//         tweetIs: 'Tweet is: + 252',
//         // `semua kotak centang` diaktifkan
//         allCheckboxesEnabled: 'diaktifkan: 3'
//       },
//       {
//         name: 'Test 1',
//         index: 1,
//         listBool: [false, false, true, true],
//         results: 'Tags: #Test2, Test 3',
//         tweetIs: 'Tweet is: + 260',
//         allCheckboxesEnabled: 'diaktifkan: 2'
//       },
//       {
//         name: '#Test2',
//         index: 2,
//         listBool: [false, false, false, true],
//         results: 'Tags: Test 3',
//         tweetIs: 'Tweet is: + 268',
//         allCheckboxesEnabled: 'diaktifkan: 1'
//       },
//       {
//         name: 'Test 3',
//         index: 3,
//         listBool: [false, false, false, false],
//         results: 'Tidak ada hasil',
//         tweetIs: 'Tweet is: + 280',
//         allCheckboxesEnabled: 'diaktifkan: 0'
//       }
//     ]

//     for (let test of testCases) {
//       console.debug('unchecked ke-', test.name)
//       await checkboxTrends.at(test.index).setValue(false)

//       for (let i = 0; i < test.listBool.length; i++) {
//         if (test.listBool[i]) {
//           expect(arrayTrends.at(i).classes()).toContain('completed')
//         } else {
//           // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
//           expect(arrayTrends.at(i).classes()).to.deep.equal([])
//         }
//       }

//       assert.equal(results.element.value, test.results)
//       assert.equal(btnTweet.text(), test.tweetIs)
//       // `semua kotak centang` diaktifkan
//       assert.equal(allCheckboxesEnabled.text(), test.allCheckboxesEnabled)
//     }
//   })

//   it('textarea `hasil` untuk array untuk trends: dicentang', async () => {
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

//   it('button `semua kotak centang` di array untuk trends: tidak diaktifkan', async () => {
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
// })
