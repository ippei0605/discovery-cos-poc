<template>
  <div class="discovery">
    <h1>Discovery COS PoC</h1>
    <p v-loading="loading">/:environment_id/:collection_id = /{{environmentId}}/{{collectionId}}</p>
    <h2>Upload documents</h2>
    <el-upload
      name="upload-files"
      drag
      :action="serverUrl + environmentId + '/' + collectionId"
      :on-success="doSuccess"
      :on-progress="doProgress"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
    </el-upload>
    <h2>Documents</h2>
    <el-table
      v-loading="loadingTable"
      :data="result.results"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          {{ props.row.text }}
        </template>
      </el-table-column>
      <el-table-column
        width="260"
        prop="id"
        label="Id">
      </el-table-column>
      <el-table-column
        prop="text"
        label="text"
        :formatter="formatText">
      </el-table-column>
      <el-table-column
        prop="extracted_metadata.filename"
        label="Filename">
        <template slot-scope="scope">
          <a :href="serverUrl + 'cos/' + scope.row.extracted_metadata.filename"
             target="_blank">{{scope.row.extracted_metadata.filename}}</a>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        prop="extracted_metadata.publicationdate"
        label="Publicationdate">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import context from '@/context';

  export default {
    name: 'Discovery',
    data () {
      return {
        loading: false,
        loadingTable: false,
        serverUrl: context.serverUrl,
        environmentId: '',
        collectionId: '',
        result: {
          results: []
        }
      };
    },
    mounted () {
      this.init();
    },
    methods: {
      formatText (row, column) {
        return row.text.length > 80 ? row.text.substring(0, 80) + '...' : row.text;
      },
      init () {
        this.loading = true;
        const config = {
          method: 'get',
          url: '/ready'
        };
        context.api(config)
          .then(({data: v}) => {
            this.environmentId = v.environment_id;
            this.collectionId = v.collection_id;
            this.filter();
            this.loading = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loading = false;
          });
      },
      filter () {
        this.loadingTable = true;
        const config = {
          method: 'get',
          url: `/${this.environmentId}/${this.collectionId}`
        };
        context.api(config)
          .then(({data: v}) => {
            this.result = v;
            this.loadingTable = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loadingTable = false;
          });
      },
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

  .col-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
