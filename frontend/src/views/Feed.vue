<template>
  <div class="feed">
    <h1>Feed</h1>
    <p>Welcome back {{ this.username }}</p>

    <div v-for="content in limitedContents">
      <div class="content">
        <MediaContent
          v-bind:user-id="this.userId"
          v-bind:the-id="content.id"
          v-bind:the-title="content.title"
          v-bind:preview-img-url="content.previewUrl"
          v-bind:content-url="content.contentUrl"
          v-bind:likes-number="content.likes ? content.likes.length : 0"
          v-bind:dislikes-number="content.dislikes ? content.likes.length : 0"
          v-bind:likesList="content.likes ? content.likes : []"
          v-bind:dislikesList="content.dislikes ? content.dislikes : []"
          @like="handleLike"
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
      userId: "",
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
      this.userId = objUser.id; // TODO
      this.username = objUser.username;
    },
    async fetchContents() {
      const resultJSON = await fetch(this.hostname + "/api/contents", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const contentsObj = await resultJSON.json();
      this.contents = contentsObj;
    },
    moreContents() {
      this.limitContents += 20;
    },
    handleLike(message) {
      const content = this.contents.find((el) => el.id === message.contentId);
      const action = message.action;

      const userID = this.userId;

      if (action === "remove") {
        // remove a like
        for (let i = 0; i < content.likes.length; i++) {
          if (content.likes[i] === userID) {
            content.likes.splice(i, 1);
            break;
          }
        }
      }

      if (action === "add") {
        // add a like
        if (content.likes === undefined) {
          content.likes = [userID];
        } else {
          content.likes.push(userID);
        }
      }
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
