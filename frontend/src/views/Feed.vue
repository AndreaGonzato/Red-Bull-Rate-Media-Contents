<template>
  <div class="feed">
    <h1>Feed</h1>
    <p>Welcome back {{ this.username }}</p>

    <div v-for="content in limitedContents">
      <div class="content">
        <MediaContent
          v-bind:the-id="content.id"
          v-bind:the-title="content.title"
          v-bind:preview-img-url="content.previewUrl"
          v-bind:content-url="content.contentUrl"
        ></MediaContent>
      </div>
    </div>

    <div>
      <button @click.prevent="moreContents" class="btn btn-primary">
        More...
      </button>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import cookieManager from "@/cookieManager.js";
import MediaContent from "@/components/MediaContent.vue";

export default {
  name: "Feed",
  data() {
    return {
      hostname: config.hostname,
      username: "",
      contents: [{}],
      limitContents: 20,
    };
  },
  components: {
    MediaContent,
  },
  computed: {
    limitedContents() {
      return this.contents.slice(0, this.limitContents);
      //return this.contents[0, this.limit];
    },
  },
  mounted() {
    this.whoami();
    this.$emit("message", { showAccount: true });
    this.fetchContents();
  },
  methods: {
    async whoami() {
      var jwt = cookieManager.getCookie("jwt");

      // Set the Authorization header of the request
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + jwt);
      headers.append("Content-type", "application/json");
      const resultJSON = await fetch(this.hostname + "/api/social/whoami", {
        method: "GET",
        headers: headers,
      });

      const objUser = await resultJSON.json();

      this.username = objUser.username;
    },
    async fetchContents() {
      const resultJSON = await fetch(this.hostname + "/api/contents", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const contentsObj = await resultJSON.json();
      this.contents = contentsObj;
      console.log(contentsObj); // TODO remove
    },
    moreContents() {
      this.limitContents += 20;
    },
  },
};
</script>

<style scoped>
.feed {
  text-align: center;
}

.content {
  margin-bottom: 3%;
}
</style>
