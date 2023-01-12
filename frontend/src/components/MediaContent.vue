<template>
  <div class="content">
    <p>
      <b>{{ contentObj.title }}</b>
    </p>
    <p>{{ likesList }}</p>

    <!--preview img-->
    <div v-if="!this.showVideo">
      <button @click.prevent="toggleShowVideo">
        <img v-bind:src="contentObj.previewUrl" />
      </button>
    </div>

    <!--video-->
    <div v-if="this.showVideo">
      <video controls>
        <source v-bind:src="contentObj.contentUrl" type="video/mp4" />
      </video>
    </div>

    <div class="div-close-like">
      <!-- like button-->
      <span class="like">
        <button class="btn btn-success" @click.prevent="clickOnLike">
          <i class="fa-regular fa-thumbs-up"></i> Like {{ this.likesNumber }}
        </button>
      </span>

      <span v-if="this.showVideo" class="close">
        <button @click.prevent="toggleShowVideo" class="btn btn-secondary">
          Close
        </button>
      </span>

      <!-- dislike button-->
      <span class="dislike">
        <button class="btn btn-danger">
          <i class="fa-regular fa-thumbs-down"></i> Dislike
          {{ this.dislikesNumber }}
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import cookieManager from "@/cookieManager.js";

export default {
  name: "MediaContent",
  props: {
    userId: Number,

    contentObj: Object,

    theId: String,
    likesNumber: Number,
    dislikesNumber: Number,
    likesList: Object,
    dislikesList: Object,
  },
  data() {
    return {
      showVideo: false,
      likes: 0,
      dislike: 0,
    };
  },
  methods: {
    toggleShowVideo() {
      this.showVideo = !this.showVideo;
    },
    async clickOnLike() {
      if (this.likesList.includes(this.userId)) {
        // user already put a like to this content -> you want to remove it
        this.removeLike();
      } else {
        // add a like
        this.postLike();
      }
    },
    async postLike() {
      // update frontend
      this.$emit("like", { contentId: this.contentObj.id, action: "add" });

      // update backend

      var jwt = cookieManager.getCookie("jwt");
      // Set the Authorization header of the request
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + jwt);
      headers.append("Content-type", "application/json");

      const postRequest = await fetch(
        config.hostname + "/api/social/like/" + this.contentObj.id,
        {
          method: "POST",
          headers,
          body: JSON.stringify({}),
        }
      );

      //const obj = await postRequest.json();
    },
    async removeLike() {
      // update frontend
      this.$emit("like", { contentId: this.contentObj.id, action: "remove" });

      // update backend

      // require jwt token
      var jwt = cookieManager.getCookie("jwt");
      // Set the Authorization header of the request
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + jwt);
      headers.append("Content-type", "application/json");

      const postRequest = await fetch(
        config.hostname + "/api/social/like/" + this.contentObj.id,
        {
          method: "DELETE",
          headers,
          body: JSON.stringify({}),
        }
      );

      //const obj = await postRequest.json();

    },
  },
};
</script>

<style scoped>
img {
  max-height: 250px;
}

video {
  max-height: 400px;
}

.div-close-like {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1 fr1fr;
  max-width: 400px;
  margin: auto;
  margin-top: 0.5em;
  grid-template-areas: "like  close dislike ";
}

.div-close-like .like {
  grid-area: like;
}

.div-close-like .close {
  grid-area: close;
}

.div-close-like .dislike {
  grid-area: dislike;
}
</style>
