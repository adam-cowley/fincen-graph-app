<template>
    <div class="key">
        <div class="key-item" v-for="k in keyItems" :key="k[0]" v-html="k[0]" :style="{'background-color': k[1]}" />
      </div>
</template>

<script>
import { viridis as scale } from "scale-color-perceptual";

export default {
computed: {
    keyItems() {
      return [... new Array(10)].map((_, index) => [index+1, scale(1- ((index+1)/10))])
    }
  },
}
</script>


<style>
.key {
  position: fixed;
  bottom: 12px;
  left: 12px;
  display: flex;
  z-index: 1000;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  padding: 4px;
}

.key .key-item {
  display: flex;
  justify-content: center;
  width: 26px;
  height: 22px;
  color: #fff;
  margin-right: 2px;
}

.key .key-item:last-child {
    margin-right: 0;
}
</style>

