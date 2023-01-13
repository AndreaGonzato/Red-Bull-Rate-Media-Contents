<template>
  <div class="content">
    <p>
      <b>{{ contentObj.title }}</b>
    </p>

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

    <div class="div-close-like" v-if="this.showVideo">
      <!-- like button-->
      <span class="like">
        <button class="btn btn-success" @click.prevent="clickOnLike">
          <i class="fa-thumbs-up" :class="likeStyle"></i> Like {{ this.likesNumber }}
        </button>
      </span>

      <span class="close">
        <button @click.prevent="toggleShowVideo" class="btn btn-secondary">
          Close
        </button>
      </span>

      <!-- dislike button-->
      <span class="dislike">
        <button class="btn btn-danger" @click.prevent="clickOnDislike">
          <i class="fa-thumbs-down" :class="dislikeStyle"></i> Dislike
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

    likesNumber: Number,
    dislikesNumber: Number,
  },
  data() {
    return {
      showVideo: false,
      likeStyle: 'fa-regular',
      dislikeStyle: 'fa-regular',
      liked: false,
      disliked: false
    };
  },
  mounted(){
    if(this.contentObj.likes !== undefined && this.contentObj.likes.includes(this.userId)){
      // you put like in a previous session
      this.likeStyle = 'fa-solid';
      this.liked = true;
    }

    if(this.contentObj.dislikes !== undefined && this.contentObj.dislikes.includes(this.userId)){
      // you put dislike in a previous session
      this.dislikeStyle = 'fa-solid';
      this.disliked = true;
    }
  },
  methods: {
    toggleShowVideo() {
      this.showVideo = !this.showVideo;
    },
    async clickOnLike() {
      if (this.contentObj.likes === undefined) {
        // add the first like to this content
        this.contentObj.likes = [];
        this.postLike();
      } else {
        if (this.contentObj.likes.includes(this.userId)) {
          // user already put a like to this content -> you want to remove it
          this.removeLike();
        } else {
          // add a like
          this.postLike();
        }
      }
    },
    async clickOnDislike() {
      if (this.contentObj.dislikes === undefined) {
        // add the first dislike to this content
        this.contentObj.dislikes = [];
        this.postDislike();
      } else {
        if (this.contentObj.dislikes.includes(this.userId)) {
          // user already put a dislike to this content -> you want to remove it
          this.removeDislike();
        } else {
          // add a dislike
          this.postDislike();
        }
      }
    },
    async postLike() {
      // update frontend
      this.$emit("like", { contentId: this.contentObj.id, action: "add" });
      this.likeStyle = 'fa-solid'
      this.liked = true

      if(this.disliked){
        // user disliked this content previously -> the user change idea and now like this content, so remove the dislike
        await this.removeDislike();
      }

      // I'm going to update the backend now

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
    async postDislike() {
      // update frontend
      this.$emit("dislike", { contentId: this.contentObj.id, action: "add" });
      this.dislikeStyle = 'fa-solid'
      this.disliked = true;

      if(this.liked){
        // user liked this content previously -> the user change idea and now dislike this content, so remove the like
        await this.removeLike();
      }

      // I'm going to update the backend now

      var jwt = cookieManager.getCookie("jwt");
      // Set the Authorization header of the request
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + jwt);
      headers.append("Content-type", "application/json");

      const postRequest = await fetch(
        config.hostname + "/api/social/dislike/" + this.contentObj.id,
        {
          method: "POST",
          headers,
          body: JSON.stringify({}),
        }
      );
    },
    async removeLike() {
      // update frontend
      this.$emit("like", { contentId: this.contentObj.id, action: "remove" });
      this.likeStyle = 'fa-regular'
      this.liked = false;

      // I'm going to update the backend now

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
    async removeDislike() {
      // update frontend
      this.$emit("dislike", {
        contentId: this.contentObj.id,
        action: "remove",
      });
      this.dislikeStyle = 'fa-regular'
      this.disliked = false;
  
      // I'm going to update the backend now

      // require jwt token
      var jwt = cookieManager.getCookie("jwt");
      // Set the Authorization header of the request
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + jwt);
      headers.append("Content-type", "application/json");

      const postRequest = await fetch(
        config.hostname + "/api/social/dislike/" + this.contentObj.id,
        {
          method: "DELETE",
          headers,
          body: JSON.stringify({}),
        }
      );
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

.content{
  margin-bottom: 6em;
}
</style>
