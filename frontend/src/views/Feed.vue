<template>
  <div class="feed">
    <h1>Feed</h1>
    <p>This is the feed</p>
    <p>{{ this.email }}</p>

    <button @click.prevent="whoami" class="btn btn-primary">Who am i</button>
  </div>
</template>

<script>
import config from "@/config.js";

export default {
  name: "Feed",
  data() {
    return {
        hostname: config.hostname,
        email: this.$route.query.email,
    };
  },
  methods: {
    async whoami() {
      var jwt = this.getCookie("jwt");

      // Set the Authorization header of the request
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + jwt);
      headers.append("Content-type", "application/json");
      const resultJSON = await fetch(this.hostname + "/api/social/whoami", {
        method: "GET",
        headers: headers,
      });

      const objToken = await resultJSON.json();
      console.log(objToken);
    },
    getCookie(name) {
      // Split the cookies string and get all individual name=value pairs in an array
      var cookieArr = document.cookie.split(";");

      // Loop through the array and find the named cookie
      for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        if (name === cookiePair[0].trim()) {
          return decodeURIComponent(cookiePair[1]);
        }
      }
      console.log("no cookie for this site");
      // If the named cookie does not exist, return null
      return null;
    },
  },
};
</script>

<style scoped>
.feed {
  text-align: center;
}
</style>
