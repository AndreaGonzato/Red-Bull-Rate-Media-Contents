<template>
  <div class="trend">
    <h1>Most Liked</h1>
  </div>
</template>

<script>
import config from "@/config.js";

export default {
  name: "Trend",
  data() {
    return {
      trendContent: [{}],
    };
  },
  mounted() {
    // fetch trend contents
    this.fetchMostLikedContents();
  },
  methods: {
    async fetchMostLikedContents() {
      const resultJSON = await fetch(config.hostname + "/api/trend", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const trendContentObj = await resultJSON.json();
      this.trendContent = trendContentObj;
      console.log(trendContentObj);
    },
  },
};
</script>

<style scoped>
.trend {
  text-align: center;
}
</style>
