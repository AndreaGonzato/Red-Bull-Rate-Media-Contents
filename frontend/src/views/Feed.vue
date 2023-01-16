<template>
  <div class="feed">
    <h1>Feed</h1>
    <p>Welcome back {{ this.username }}!</p>

    <div v-for="content in limitedContents">
      <div class="content">
        <MediaContent
          v-bind:user-id="parseInt(this.userId)"
          v-bind:content-obj="content"
          v-bind:likes-number="content.likes ? content.likes.length : 0"
          v-bind:dislikes-number="
            content.dislikes ? content.dislikes.length : 0
          "
          @like="handleLike"
          @dislike="handleDislike"
        ></MediaContent>

        <hr />
      </div>
    </div>

    <div>
      <button @click.prevent="moreContents" class="btn btn-primary btn-more">
        Load more
      </button>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import MediaContent from "@/components/MediaContent.vue";
import userManager from "@/userManager.js";

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
  async created() {
    const user = await userManager.whoami();
    this.userId = user.id;
    this.username = user.username;

    // tell the app to show account in the nav menu and remove login and signin
    this.$emit("message", { showAccount: true });

    await this.fetchContents();
  },
  methods: {
    async fetchContents() {
      const resultJSON = await fetch(config.hostname + "/api/contents", {
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
    handleDislike(message) {
      const content = this.contents.find((el) => el.id === message.contentId);
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
hr {
  max-width: 600px;
  margin: auto;
}
.feed {
  text-align: center;
}

.btn-more {
  margin-top: 3em;
  margin-bottom: 5em;
}
</style>
