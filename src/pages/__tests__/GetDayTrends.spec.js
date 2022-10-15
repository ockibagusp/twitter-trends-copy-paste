import { describe, it, assert, expect, vi } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'
import  GetDayTrends from '../GetDayTrends.vue'

import axios from 'axios'

// test html: https://getdaytrends.com/indonesia/bekasi/
const mockGetDayTrends = { 
  data: '<td class="main"><a href="...">#Test1</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
    '<td class="main"><a href="...">#Test2</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">#Test3</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">#Test4</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' +
    '<td class="main"><a href="...">#Test5</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
    '<td class="main"><a href="...">Test 6</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">Test 7</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">Test 8</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' +
    '<td class="main"><a href="...">Test 9</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
    '<td class="main"><a href="...">Test 10</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">Test 11</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">Test 12</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' +
    '<td class="main"><a href="...">Test 13</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
    '<td class="main"><a href="...">Test 14</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">Test 15</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
    '<td class="main"><a class="string" href="...">Faults 1</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' + 
    '<td class="main"><a href="...">Faults 2</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>'
}

// GET
vi.spyOn(axios, 'get').mockResolvedValueOnce(mockGetDayTrends)

// TDD
// ✅ ❌
// 1. textarea `hasil` untuk array untuk trends ✅
// 2. kotak centang untuk trends di getdaytrends.com ✅
// 3. button `semua kotak centang` jika ini diaktifkan atau tidak diaktifkan ✅
describe('getdaytrends.com', async() => {
  assert.exists(GetDayTrends)

  const wrapper = mount(GetDayTrends, {
    props: { },
    data() {
      return {
        arraytrends: [
         // ...
        ]
      }
    }
  })

  // async dibuat() {
  //    this.arraytrends = []
  //    this.selectSubmit = false
  //    this.selectCopy = false
  //    this.selectTweet = false
  //    this.count = 280
  //    this.selectHasil = false
  //    // textarea hasil: loading...
  //    this.hasil = 'Loading...'
  //    ....
  // }

  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get).toHaveBeenCalledWith('https://twitter-trends-redirect.herokuapp.com/url')

  // Wait until the DOM updates.
  await flushPromises()

  // button: btnSubmit
  const btnSubmit = wrapper.find('[data-test="btn-submit"]')
  
  // textarea: hasil
  const hasil = wrapper.find('[data-test="hasil"]')
  
  // button: btnTweet
  const btnTweet = wrapper.find('[data-test="btn-tweet"]')
  // button: btnCopy
  const btnCopy = wrapper.find('[data-test="btn-copy"]')

  // button: btnCheckBoxAll diaktifkan atau tidak diaktifkan semua kotak centang
  const btnCheckBoxAll = wrapper.find('[data-test="btn-checkbox-all"]') 

  // `semua kotak centang` diaktifkan
  const allCheckboxesEnabled = wrapper.find('[data-test="all-checkboxes-enabled"]')
  it('init', async() => {
    // button: btnSubmit diaktifkan
    assert.isUndefined(btnSubmit.attributes().disabled)

    // textarea hasil: test getdaytrends.com
    assert.equal(hasil.element.value, 'Tags: #Test1, #Test2, #Test3, #Test4, #Test5, Test 6, Test 7, Test 8, Test 9, Test 10, Test 11, Test 12, Test 13, Test 14, Test 15')
    // button: btnCopy dan btnTweet diaktifkan
    assert.isUndefined(btnCopy.attributes().disabled)
    assert.isUndefined(btnTweet.attributes().disabled)
    
    assert.equal(btnTweet.text(), 'Tweet is: + 150')
  })

  // array dan checkbox untuk trends
  const arrayTrends = wrapper.findAll('[data-test="array-trends"]')
  const checkboxTrends = wrapper.findAll('[data-test="trends-checkbox"]')

  it('kotak centang untuk trends di getdaytrends.com: baru', async => {
    assert.equal(arrayTrends.length, 17)
    
    for (let i = 0; i < 15; i++) {
      expect(arrayTrends.at(i).classes()).toContain('completed')
    }

    for (let i = 15; i < arrayTrends.length; i++) {
      expect(arrayTrends.at(i).classes()).to.deep.equal([])
    }
  })

  it('kotak centang untuk trends di getdaytrends.com: tidak dicentang', async() => {
    assert.equal(hasil.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
    assert.equal(btnTweet.text(), 'Tweet is: + 234')

    // test cases
    const testCases = [
      {
        name: '#TimnasIndonesia',
        index: 0,
        listBool: [false, true, true, true],
        hasil: 'Tags: Test 1, #Test2, Test 3',
        tweetIs: 'Tweet is: + 252',
        // `semua kotak centang` diaktifkan
        allCheckboxesEnabled: 'diaktifkan: 3'
      },
      {
        name: 'Test 1',
        index: 1,
        listBool: [false, false, true, true],
        hasil: 'Tags: #Test2, Test 3',
        tweetIs: 'Tweet is: + 260',
        allCheckboxesEnabled: 'diaktifkan: 2'
      },
      {
        name: '#Test2',
        index: 2,
        listBool: [false, false, false, true],
        hasil: 'Tags: Test 3',
        tweetIs: 'Tweet is: + 268',
        allCheckboxesEnabled: 'diaktifkan: 1'
      },
      {
        name: 'Test 3',
        index: 3,
        listBool: [false, false, false, false],
        hasil: 'Tidak ada hasil',
        tweetIs: 'Tweet is: + 280',
        allCheckboxesEnabled: 'diaktifkan: 0'
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
  })

  it('kotak centang untuk trends di getdaytrends.com: dicentang', async() => {
    console.debug('-----')

    assert.equal(hasil.element.value, 'Tidak ada hasil')

    // test cases
    const testCases = [   
      {
        name: 'Test 1',
        index: 1,
        listBool: [false, true, false, false],
        hasil: 'Tags: Test 1',
      },
      {
        name: 'Test 3',
        index: 3,
        listBool: [false, true, false, true],
        hasil: 'Tags: Test 1, Test 3',
      },
      {
        name: '#TimnasIndonesia',
        index: 0,
        listBool: [true, true, false, true],
        hasil: 'Tags: #TimnasIndonesia, Test 1, Test 3',
      },
      {
        name: '#Test2',
        index: 2,
        listBool: [true, true, true, true],
        hasil: 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3',
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
  })

  it('button `semua kotak centang` di array untuk trends: tidak diaktifkan', async() => {
    assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')

    let listBool = [true, true, true, true]
    for (let i = 0; i < listBool.length; i++) {
      expect(arrayTrends.at(i).classes()).toContain('completed')
    }

    await btnCheckBoxAll.trigger('click')
    assert.equal(btnCheckBoxAll.text(), 'diaktifkan')
    assert.equal(hasil.element.value, 'Tidak ada hasil')

    listBool = [false, false, false, false]
    for (let i = 0; i < listBool.length; i++) {
      // same: assert.deepEqual(arrayTrends.at(...).classes(), [])
      expect(arrayTrends.at(i).classes()).to.deep.equal([])
    }

    await btnCheckBoxAll.trigger('click')
    assert.equal(btnCheckBoxAll.text(), 'tidak diaktifkan')
    assert.equal(hasil.element.value, 'Tags: #TimnasIndonesia, Test 1, #Test2, Test 3')
  })
})
