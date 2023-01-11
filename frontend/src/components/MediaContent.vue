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
        <button class="btn btn-block btn-success">
          <i class="fa-regular fa-thumbs-up"></i> Like
        </button>
      </span>

      <span v-if="this.showVideo" class="close">
        <button @click.prevent="toggleShowVideo" class="btn btn-secondary">
          Close
        </button>
      </span>

      <span class="dislike">
        <button class="btn btn-block btn-danger">
          <i class="fa-regular fa-thumbs-down"></i> Dislike
        </button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MediaContent",
  props: {
    theId : String,
    theTitle: String,
    previewImgUrl: String,
    contentUrl: String,
  },
  data() {
    return {
      showVideo: false,
    };
  },
  methods: {
    toggleShowVideo() {
      this.showVideo = !this.showVideo;
      console.log(this.showVideo); // TODO remove
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
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 400px;
  margin: auto;
  margin-top: 0.5em;
  grid-template-areas: "like close dislike";
}

.div-close-like .like{
  grid-area: like;
}

.div-close-like .close{
  grid-area: close;
}

.div-close-like .dislike{
  grid-area: dislike;
}


</style>
