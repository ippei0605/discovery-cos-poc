<template>
  <div class="discovery">
    <h1>Discovery COS PoC</h1>
    <el-upload
      name="upload-files"
      drag
      action="http://localhost:6014"
      :on-success="doSuccess"
      :on-progress="doProgress"

      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: 'Discovery',
    data () {
      return {};
    },
    methods: {
      doSuccess (response, file) {
        console.log('###:', file);
        console.log('###response:', response);
      },
      doProgress (event, file, fileList) {
        console.log('===>', 1 / fileList.length);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
