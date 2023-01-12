<template>
  <div class="trend">
    <h1>Most Liked</h1>

    <div v-for="content in trendContents">
      <div class="content">
        <MediaContent
          v-bind:user-id="parseInt(this.userId)"
          v-bind:content-obj="content"
          v-bind:likes-number="content.likes ? content.likes.length : 0"
          v-bind:dislikes-number="
            content.dislikes ? content.dislikes.length : 0
          "
        ></MediaContent>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import userManager from "@/userManager.js";
import MediaContent from "@/components/MediaContent.vue";

export default {
  name: "Trend",
  data() {
    return {
      userId: "",
      username: "",
      trendContents: [{}],
    };
  },
  mounted() {
    // fetch trend contents
    const user = userManager.whoami();

    this.fetchMostLikedContents();
  },
  components:{
    MediaContent
  },
  methods: {
    async fetchMostLikedContents() {
      const resultJSON = await fetch(config.hostname + "/api/trend", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const trendContentsObj = await resultJSON.json();
      this.trendContents = trendContentsObj;
    },
  },
};
</script>

<style scoped>
.trend {
  text-align: center;
}
</style>
