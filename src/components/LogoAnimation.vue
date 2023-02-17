<template>
  <div class="example">
    <div
      class="camera_shutter"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
      <div class="camera_shutter_triangles">
        <div
          class="camera_shutter_triangle"
          v-for="index in number"
          :key="index"
          :style="getItemStyle(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      number: 8,
      isHover: false,
      close: 10,
      open: 35,
    };
  },
  mounted() {},
  methods: {
    getItemStyle(index) {
      const angleConst = 2.5 + (360 / this.number) * index;
      let b = this.close;
      if (this.isHover) {
        b = this.open;
      }
      const transform = `rotate(${angleConst}deg) skew(15deg, 15deg) translate(${b}%, -${b}%)`;
      return {
        transform: transform,
      };
    },
  },
};
</script>

<style scoped>
.example {
  display: inline-block;
  margin: 5px;
  height: 40px;
  width: 40px;
}

.camera_shutter {
  border: 1px solid #000;
  border-radius: 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: rgb(131, 58, 180);
  background-image: radial-gradient(
    circle,
    rgba(131, 58, 180, 1) 0%,
    rgba(29, 71, 253, 1) 50%,
    rgba(69, 252, 241, 1) 100%
  );

  animation: open_shutter 0.5s ease-out forwards;
}
.camera_shutter:hover {
  animation: close_shutter 0.5s ease-out forwards;
}

.camera_shutter_triangles {
  height: 100%;
  position: relative;
  width: 100%;
  transform: translate(-50%, -50%);
}

.camera_shutter_triangle {
  background: #000;
  border: 1px solid #fff;
  transform-origin: 100% 100%;
  height: 100%;
  position: absolute;
  width: 100%;
  rotate: 30deg;
  transition: transform 0.5s ease-out;
}

@keyframes open_shutter {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 60deg;
  }
}

@keyframes close_shutter {
  from {
    rotate: 60deg;
  }
  to {
    rotate: 0deg;
  }
}
</style>
>
