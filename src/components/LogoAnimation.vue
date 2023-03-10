<template>
  <div class="flex justify-center items-center" @mouseover="isHover = true" @mouseleave="isHover = false">
    <div class="example">
      <div class="camera_shutter">
        <div class="camera_shutter_lens" :style="getCercleRotation()">
          <div class="camera_shutter_triangles">
            <div class="camera_shutter_triangle" v-for="index in number" :key="index" :style="getTriangleStyle(index)">
            </div>
          </div>
        </div>
      </div>
    </div>

    <span id="logo-name" class="flex ml-1 font-semibold text-3xl">Shutter</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      number: 9,
      isHover: false,
      close: 15,
      open: 35,
    };
  },
  mounted() { },
  methods: {
    getTriangleStyle(index) {
      const angleConst = (360 / this.number) * index;
      let b = this.close;
      if (this.isHover) {
        b = this.open;
      }
      const diff = this.number - 6;
      const transform = `rotate(${angleConst}deg) skew(${15 + 2.5 * diff}deg, ${15 + 2.5 * diff
        }deg) translate(${b}%, -${b}%)`;
      return {
        transform: transform,
      };
    },
    getCercleRotation() {
      let transform = `rotate(0deg)`;
      if (this.isHover) {
        transform = `rotate(-45deg)`;
      }
      return {
        transform: transform,
      };
    },
  },
};
</script>

<style scoped>
#logo-name {
  font-family: "Courier New", Courier, monospace;
}

.example {
  display: inline-block;
  margin: 5px;
  height: 40px;
  width: 40px;
}

.camera_shutter {
  border: 2px solid var(--color-text);
  border-radius: 100%;
  height: 100%;
  width: 100%;
}

.camera_shutter_lens {
  border: 2px solid var(--color-background);
  border-radius: 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: rgba(131, 58, 180, 1);
  background-image: radial-gradient(circle,
      rgba(131, 58, 180, 1) 0%,
      rgba(29, 71, 253, 1) 50%,
      rgba(69, 252, 241, 1) 100%);
  transition: transform 0.5s ease-out;
}

.camera_shutter_triangles {
  height: 100%;
  position: relative;
  width: 100%;
  transform: translate(-50%, -50%);
}

.camera_shutter_triangle {
  background: var(--color-text);
  border: 2px solid var(--color-background);
  transform-origin: 100% 100%;
  height: 100%;
  position: absolute;
  width: 100%;
  transition: transform 0.5s ease-out;
}
</style>
