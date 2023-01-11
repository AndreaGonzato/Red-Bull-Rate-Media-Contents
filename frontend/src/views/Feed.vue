<template>
  <div class="feed">
    <h1>Feed</h1>
    <p>This is the feed of {{ this.username }}</p>
    

    <button @click.prevent="whoami" class="btn btn-primary">Who am i</button>
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
        username : ''
    };
  },
  mounted() {
    this.whoami();
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
      console.log(objUser); // TODO remove

      this.username = objUser.username;

    },
  },
};
</script>

<style scoped>
.feed {
  text-align: center;
}
</style>
