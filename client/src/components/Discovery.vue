<template>
  <div class="discovery">
    <el-row>
      <el-col :span="14" style="padding: 5px 5px">
        <h1>Discovery COS PoC</h1>
        <el-table
          v-loading="loading"
          :data="info"
          style="width: 100%">
          <el-table-column
            prop="item"
            label="Item"
            width="200">
          </el-table-column>
          <el-table-column
            prop="value"
            label="Value">
          </el-table-column>
        </el-table>
        <div style="margin-top: 40px; text-align: center">
          <el-form size="medium" :inline="true" :model="form">
            <el-form-item>
              <el-input placeholder="Please input natural language query" v-model="form.nlq" style="min-width: 400px;
    max-width: 400px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input-number v-model="form.count" :min="1" :max="1000" style="min-width: 140px;
    max-width: 140px;"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="nlquery" :loading="loadingNlq">Search</el-button>
              <el-button type="text" @click="reset">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10" style="padding: 5px 5px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Upload documents</span>
          </div>
          <div style="text-align: center;">
            <el-upload
              name="upload-files"
              drag
              :action="serverUrl + environmentId + '/' + collectionId"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
              <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
            </el-upload>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="form.isNlq === false">
      <el-col style="padding: 5px 5px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Documents (Filter)</span>
          </div>
          <div>
            <el-table
              stripe
              v-loading="loadingTable"
              :data="result.results">
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
              <el-table-column label="Delete" width="60" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" icon="el-icon-delete" circle
                             @click="deleteDocument(scope.row.id, scope.row.extracted_metadata.filename)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="form.isNlq === true">
      <el-col style="padding: 5px 5px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Nalural Language Query Result</span>
          </div>
          <div>
            <p>Passages: {{nlqResult.passages.length}}, Results: {{nlqResult.results.length}}</p>
            <ul>
              <li v-for="(item, index) in nlqResult.passages" :key="index" style="margin-top: 20px">
                <a :href="serverUrl + 'cos/' + nlqResult.resultTable[item.document_id].extracted_metadata.filename"
                   target="_blank">{{nlqResult.resultTable[item.document_id].extracted_metadata.filename}}</a>
                (Score: {{item.passage_score}})<br>
                {{item.passage_text}}
              </li>
            </ul>
            <pre style="margin-top: 40px">{{nlqResult}}</pre>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import qs from 'qs';
  import context from '@/context';

  export default {
    name: 'Discovery',
    data () {
      return {
        loading: false,
        loadingTable: false,
        loadingNlq: false,
        serverUrl: context.serverUrl,
        environmentId: '',
        collectionId: '',
        info: [],
        result: {
          results: []
        },
        nlqResult: {
          passages: [],
          results: [],
          resultTable: {}
        },
        form: {
          isNlq: false,
          nlq: '',
          count: 10
        }
      };
    },
    mounted () {
      this.init();
    },
    methods: {
      nlquery () {
        this.form.isNlq = true;
        this.loadingNlq = true;
        const config = {
          method: 'get',
          url: `/${this.environmentId}/${this.collectionId}`,
          params: {
            nlq: this.form.nlq,
            passages: true,
            count: this.form.count
          }
        };
        context.api(config)
          .then(({data: v}) => {
            this.nlqResult = v;
            this.nlqResult.resultTable = {};
            this.nlqResult.results.map(item => {
              this.nlqResult.resultTable[item.id] = item;
            });
            this.loadingNlq = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loadingNlq = false;
          });
      },
      reset () {
        this.form = {
          isNlq: false,
          nlq: '',
          count: 10
        };
      },
      formatText (row, column) {
        return row.text.length > 80 ? row.text.substring(0, 60) + '...' : row.text;
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

            this.info = [
              {
                item: '/:environment_id/:collection_id',
                value: '/' + this.environmentId + '/' + this.collectionId
              },
              {
                item: 'bucket',
                value: 'bucket-ippei0605'
              }
            ];
            this.list();
            this.loading = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loading = false;
          });
      },
      list () {
        this.loadingTable = true;
        const config = {
          method: 'get',
          url: `/${this.environmentId}/${this.collectionId}`,
          params: {
            filter: '',
            count: 1000
          }
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
      deleteDocument (documentId, filename) {
        this.$confirm('Are you sure you want to delete this document ?', 'Warning', {
          confirmButtonText: 'OK',
          cancelBfuttonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          const config = {
            method: 'delete',
            url: `/${this.environmentId}/${this.collectionId}/${documentId}`,
            data: qs.stringify({filename: filename}),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          };
          context.api(config)
            .then(({data: v}) => {
              this.$notify.success({
                title: 'Success',
                message: 'Document deleted.'
              });
              this.list();
            })
            .catch(e => {
              console.log('error:', e);
              this.$notify.error({
                title: 'Error',
                message: 'Document could not be deleted.',
                duration: 0
              });
            });
        }).catch(() => {
        });
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
