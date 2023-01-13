<template>
  <div class="trend">
    <h1>Most Liked</h1>

    <div v-for="(content, index) in trendContents" class="all-trend-contents">

      <div class="content">
        
        <MediaContent
          v-bind:user-id="parseInt(this.userId)"

          v-bind:rank-likes="index+1"

          v-bind:content-obj="content"
          v-bind:likes-number="content.likes ? content.likes.length : 0"
          v-bind:dislikes-number="
            content.dislikes ? content.dislikes.length : 0
          "
          @like="handleLike"
          @dislike="handleDislike"
        ></MediaContent>

        <hr/>
      </div>
    </div>
    <div class="empty-footer"></div>
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
  async mounted() {
    // fetch trend contents
    const user = await userManager.whoami();
    this.userId = user.id;
    this.username = user.username;

    // tell the app to show account in the nav menu and remove login and signin
    this.$emit("message", { showAccount: true });

    this.fetchMostLikedContents();
  },
  components: {
    MediaContent,
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
    handleLike(message) {
      const content = this.trendContents.find(
        (el) => el.id === message.contentId
      );
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
    handleDislike(message) {
      const content = this.trendContents.find(
        (el) => el.id === message.contentId
      );
      const action = message.action;

      const userID = this.userId;

      if (action === "remove") {
        // remove a dislike
        for (let i = 0; i < content.dislikes.length; i++) {
          if (content.dislikes[i] === userID) {
            content.dislikes.splice(i, 1);
            break;
          }
        }
      }

      if (action === "add") {
        // add a dislike
        if (content.dislikes === undefined) {
          content.dislikes = [userID];
        } else {
          content.dislikes.push(userID);
        }
      }
    },
  },
};
</script>

<style scoped>

hr{
  max-width: 600px;
  margin: auto;
}

.trend {
  text-align: center;
}

.empty-footer {
  height: 50px;
}
</style>
