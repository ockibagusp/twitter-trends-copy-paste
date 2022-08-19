import { describe, it, assert } from 'vitest'

import { mount } from '@vue/test-utils'
import  GetDayTrends from '../GetDayTrends.vue'

describe('Copy dan Paste', () => {
  assert.exists(GetDayTrends)

  const wrapper = mount(GetDayTrends, {
    props: { } 
  })

  // button: btnSubmit
  const btnSubmit = wrapper.find('[data-test="btnSubmit"]')
  
  // textarea: hasil
  const hasil = wrapper.find('[data-test="hasil"]')

  // button: btnCopy
  const btnCopy = wrapper.find('[data-test="btnCopy"]')

  it('init', () => {
    assert.equal(btnSubmit.attributes().disabled, '')

    assert.isEmpty(hasil.element.value)
    assert.equal(btnCopy.attributes().disabled, '')
  })  

  it('lingkaran dari `for`', async() => {
    // test cases
    const testCases = [
      { 
        trendsUrl: '', 
        hasil: 'Tags: (Indonesia) Menpan RB, (Indonesia) #TimnasIndonesia, (Indonesia) Yayasan Aksi Cepat Tanggap, (Inggris) Menpan RB, (Inggris) #TimnasIndonesia, (Inggris) Yayasan Aksi Cepat Tanggap'
      },
      {
        trendsUrl: '-',
        hasil: 'Tidak ada hasil'
      }
    ]

    for (let test of testCases) {
      trendsUrl.setValue(test.trendsUrl)

      assert.equal(test.trendsUrl, trendsUrl.element.value)

      await trendsUrl.trigger('change')
      
      assert.equal(
        hasil.element.value,
        test.hasil
      )
    }
  })
})