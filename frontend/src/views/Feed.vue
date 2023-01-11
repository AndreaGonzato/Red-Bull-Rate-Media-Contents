<template>
  <div class="feed">
    <h1>Feed</h1>
    <p>This is the feed of {{ this.username }}</p>

    <button @click.prevent="whoami" class="btn btn-primary">Who am i</button>


    <div v-for="content in contents">
        {{ content.title }}
    </div>

  </div>
</template>

<script>
import config from "@/config.js";
import cookieManager from "@/cookieManager.js";

export default {
  name: "Feed",
  data() {
    return {
        hostname: config.hostname,
        username : '',
        contents : {},
    };
  },
  mounted() {
    this.whoami();
    this.$emit('message', {showAccount: true});
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
    async fetchContents(){
        const resultJSON = await fetch(this.hostname + "/api/contents", {
            method: "GET",
            headers: {"Content-type": "application/json"},
        });
        const contentsObj = await resultJSON.json();
        this.contents = contentsObj;
        console.log(contentsObj);

    }   
  },
};
</script>

<style scoped>
.feed {
  text-align: center;
}
</style>
