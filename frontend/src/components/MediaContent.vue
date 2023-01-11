<template>
  <div class="content">
    <p>
      <b>{{ theTitle }}</b>
    </p>

    <!--preview img-->
    <div v-if="!this.showVideo">
      <button @click.prevent="toggleShowVideo">
        <img v-bind:src="previewImgUrl" />
      </button>
    </div>

    <!--video-->
    <div v-if="this.showVideo">
      <video controls>
        <source v-bind:src="contentUrl" type="video/mp4" />
      </video>
    </div>

    <div class="div-close-like">
      <span class="like">
        <button class="btn btn-success" @click.prevent="postLike">
          <i class="fa-regular fa-thumbs-up"></i> Like {{ this.likesNumber }}
        </button>
      </span>

      <span v-if="this.showVideo" class="close">
        <button @click.prevent="toggleShowVideo" class="btn btn-secondary">
          Close
        </button>
      </span>

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
    theId: String,
    theTitle: String,
    previewImgUrl: String,
    contentUrl: String,
    likesNumber: Number,
    dislikesNumber: Number,
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
    async postLike() {
      // update backend
      var jwt = cookieManager.getCookie("jwt");
      // Set the Authorization header of the request
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + jwt);
      headers.append("Content-type", "application/json");

      const postRequest = await fetch(
        config.hostname + "/api/social/like/" + this.theId,
        {
          method: "POST",
          headers,
          body: JSON.stringify({}),
        }
      );

      const obj = await postRequest.json();
      if (!obj.error) {
        // update frontend
        this.$emit("like", { contentId: this.theId });
      } else {
        // you already like this content, no need to update frontend
      }
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
