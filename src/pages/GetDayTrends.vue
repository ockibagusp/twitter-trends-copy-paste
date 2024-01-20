<script>
const TAGS = "Tags: ";

import axios from "axios";
import ResultsModel from "../components/Results.model.vue";

export default {
  data() {
    return {
      // textarea: getdaytrends.com dan hasil
      getdaytrends: "",
      results: "",

      // array untuk trends
      arraytrends: [],
      // tweet dihasil maks. 280 karakter
      count: 280,

      // pilih hasil, button submit, button copy dan button tweet: true atau false
      selectSubmit: false,
      selectResults: false,

      // pilih `semua kotak centang`: true atau false
      selectCheckBoxAll: false,

      // `semua kotak centang` diaktifkan
      allCheckboxesEnabled: 0,
    };
  },
  computed: {
    // adalah submit, hasil dan button copy: true atau false
    isSubmit: function () {
      return !this.selectSubmit;
    },

    // adalah button `semua kotak centang`: true atau false
    isCheckBoxAll: function () {
      return !this.selectCheckBoxAll;
    },
  },
  created() {
    this.beMade();
  },
  watch: {
    // textarea: getdaytrends
    getdaytrends() {
      // textarea hasil: loading...
      this.results = "Loading...";

      // vue methods: memuat
      this.carry();
    },
  },
  methods: {
    // dibuat: dari textarea getdaytrends ini
    async beMade() {
      this.arraytrends = [];
      this.allCheckboxesEnabled = 0;

      this.selectResults = false;
      this.selectSubmit = false;
      this.selectCopy = false;
      this.selectTweet = false;
      this.count = 280;

      // textarea hasil: loading...
      this.results = "Loading...";

      try {
        const res = await axios.get(
          "https://twitter-trends-redirect.herokuapp.com/url"
        );
        this.getdaytrends = res.data;

        // this.getdaytrends = '<td class="main"><a href="...">#Test1</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">#Test2</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">#Test3</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">#Test4</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">#Test5</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">Test 6</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">Test 7</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">Test 8</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">Test 9</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">Test 10</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">Test 11</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">Test 12</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">Test 13</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">Test 14</a><div class="desc"><span class="small text-muted">Under 10K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">Test 15</a><div class="desc"><span class="small text-muted">53.9K tweets</span></div></td>' +
        //   '<td class="main"><a class="string" href="...">Faults 1</a><div class="desc"><span class="small text-muted">54.5K tweets</span></div></td>' +
        //   '<td class="main"><a href="...">Faults 2</a><div class="desc"><span class="small text-muted">22.1K tweets</span></div></td>'

        this.selectSubmit = true;

        // hasil
        this.carry();
      } catch (error) {
        this.results = "";
        this.selectResults = false;
        this.selectSubmit = false;
        this.selectCopy = false;
        this.selectTweet = false;
        alert(error);
      }
    },
    // memuat: dari textarea getdaytrends ini
    carry() {
      this.arraytrends = [];
      this.allCheckboxesEnabled = 0;

      let trends = "";

      // TODO: regex without "
      // regex101.com
      const regex =
        /<td class="main"><a (class="string" )?href="[^"]+">([^'"]+)<\/a><div class="desc"><span class="small text-muted">(Under )?(\d*\.\d+K tweets|\d+\.\d*K tweets|\d+K tweets)<\/span><\/div><\/td>/gm;

      const str = this.getdaytrends;

      let m;

      let i = 0;
      while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          if (groupIndex === 2) {
            // unescape HTML
            const unescapeHtml = match
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");

            // replace
            let encodedUrl = unescapeHtml
              .replaceAll("#", "%23")
              .replaceAll(" ", "+");
            // // replace all '%'' to '%25'
            // .replaceAll('%', "%25")
            this.arraytrends[i] = {
              name: unescapeHtml,
              url: "https://twitter.com/search?q=" + encodedUrl,
              tweet_volume: "",
              completed: i < 15 ? true : false,
            };

            if (i < 15) {
              trends += `${unescapeHtml}, `;
              this.allCheckboxesEnabled++;
            }
          }

          if (groupIndex === 3) {
            if (match !== undefined)
              this.arraytrends[i].tweet_volume = `${match}`;
          }

          // Misalnya: 20K
          if (groupIndex === 4) {
            this.arraytrends[i].tweet_volume += match;
          }
        });

        i++;
      }

      // 'Oknum, Motor, ' ke 'Oknum, Motor'
      if (trends != "") {
        trends = TAGS + trends.substring(0, trends.length - 2);
        this.selectResults = true;
        this.selectCopy = true;
        this.selectTweet = true;

        this.count = 280 - trends.length;
      }
      if (str != "" && trends == "") {
        trends = "Tidak ada hasil";
        this.selectResults = false;
        this.selectCopy = false;
        this.selectTweet = false;

        this.count = 280;
      }

      this.results = trends;
      this.isCopyAnCountTweet();
    },

    // button: submit dan copy
    btnSubmit() {
      this.selectResults = false;
      this.selectCopy = false;

      // textarea hasil: loading...
      this.results = "Loading...";

      this.carry();
    },
    // sama CopydanPaste:btnCheckBoxAll()

    // button `semua kotak centang`
    btnCheckBoxAll() {
      if (this.selectCheckBoxAll === true) {
        let newArrayTrendsName = "";
        this.allCheckboxesEnabled = 0;

        for (let i = 0; i < 15; i++) {
          this.arraytrends[i].completed = true;
          newArrayTrendsName += `${this.arraytrends[i].name}, `;
          this.allCheckboxesEnabled++;
        }
        this.selectResults = true;
        this.selectCopy = true;
        this.selectTweet = true;

        this.selectCheckBoxAll = false;

        this.results =
          TAGS + newArrayTrendsName.substring(0, newArrayTrendsName.length - 2);
        this.count = 280 - this.results.length;
        this.isCopyAnCountTweet();
      } else {
        this.arraytrends.forEach((val, index) => {
          this.arraytrends[index].completed = false;
        });

        this.count = 280;
        this.results = "Tidak ada hasil";
        this.isCopyAnCountTweet();
        this.allCheckboxesEnabled = 0;

        this.selectResults = false;
        this.selectCopy = false;
        this.selectTweet = false;
        this.selectCheckBoxAll = true;
      }
    },

    // sama CopydanPaste:trendsChanged(event, index)

    // berubah dalam array untuk trends
    trendsChanged(event, index) {
      const name = this.arraytrends[index].name;

      if (event.target.checked) {
        if (this.results === "Tidak ada hasil") {
          this.results = TAGS + name;
          // pilih hasil, button copy dan button tweet: true
          this.selectResults = true;
          this.selectCopy = true;

          this.allCheckboxesEnabled = 1;
        } else {
          let newArrayTrendsName = "";
          for (let i = 0; i < this.arraytrends.length; i++) {
            if (this.arraytrends[i].completed !== false) {
              newArrayTrendsName += `${this.arraytrends[i].name}, `;
            }
          }

          this.results =
            TAGS +
            newArrayTrendsName.substring(0, newArrayTrendsName.length - 2);
          this.isCopyAnCountTweet();

          this.allCheckboxesEnabled++;
        }

        this.count = 280 - this.results.length;
      } else {
        const rightComma = `${name}, `;
        const leftComma = `, ${name}`;
        const bothComma = `, ${name}, `;

        let release = "";
        if (this.results.includes(rightComma)) {
          release = rightComma;
        } else if (this.results.includes(leftComma)) {
          release = leftComma;
        } else if (this.results.includes(bothComma)) {
          release = bothComma;
        } else {
          // melepas = text
          this.results = "Tidak ada hasil";
          // pilih hasil, button copy dan button tweet: false
          this.selectResults = false;
          this.selectCopy = false;
          this.selectTweet = false;
          this.count = 280;

          this.allCheckboxesEnabled = 0;
          return;
        }
        this.results = this.results.replace(release, "");

        this.count = 280 - this.results.length;
        this.isCopyAnCountTweet();

        this.allCheckboxesEnabled--;
      }
    },

    // sama CopydanPaste:isCountTweet()

    // adalah textarea hitungan dan tombol tweet
    isCopyAnCountTweet() {
      if (
        this.results === "" ||
        this.results === "Tidak ada hasil" ||
        this.results.length > 280
      ) {
        this.selectCopy = false;
        this.selectTweet = false;
      } else {
        this.selectCopy = true;
        this.selectTweet = true;
      }
    },
  },
  // Slots - Vue.js
  // https://vuejs.org/guide/components/slots.html#scoped-slots

  // Vue.js Scoped Slots & Renderless Components
  // https://www.youtube.com/watch?v=6cn3xyK4Alk
  components: {
    ResultsSlots: ResultsModel,
  },
};
</script>

<template>
  <h2 style="margin-top: 10px; margin-bottom: -5px">GetDayTrends.com!</h2>
  <p style="margin-top: 0px; margin-bottom: 10px">
    <a href="https://getdaytrends.com/indonesia/bekasi/" target="_blank"
      >getdaytrends.com/indonesia/bekasi/</a
    >
  </p>

  <button @click="btnSubmit" data-test="btn-submit" :disabled="isSubmit">
    Submit
  </button>
  <br />

  <ResultsSlots
    :results="results"
    :count="count"
    :selectResults="selectResults"
    :selectCopy="selectCopy"
    :selectTweet="selectTweet"
  />

  <h4
    style="margin-top: 15px; margin-bottom: 5px"
    v-if="arraytrends.length > 0"
  >
    Tren Sekarang
  </h4>
  <h4
    style="margin-top: -3px; margin-bottom: 5px"
    v-if="arraytrends.length > 0"
  >
    Kotak Centang:
    <button @click="btnCheckBoxAll()" data-test="btn-checkbox-all">
      {{ !isCheckBoxAll ? "diaktifkan" : "tidak diaktifkan" }}
    </button>
  </h4>

  <p
    style="margin-top: -10px; margin-bottom: 5px"
    v-if="arraytrends.length > 0"
    data-test="all-checkboxes-enabled"
  >
    diaktifkan: {{ allCheckboxesEnabled }}
  </p>

  {{ arraytrends.length > 0 ? "📌" : "" }}
  <div
    v-for="(trends, index) in arraytrends"
    :key="trends.name"
    data-test="array-trends"
    :class="[trends.completed ? 'completed' : '']"
    @change="trendsChanged($event, index)"
  >
    <input
      type="checkbox"
      v-model="trends.completed"
      data-test="trends-checkbox"
    />
    <a :href="trends.url" target="_blank">{{ trends.name }}</a>
    <small>{{
      trends.tweet_volume !== 0 ? `(${trends.tweet_volume})` : ""
    }}</small>
  </div>
</template>
