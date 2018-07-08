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
        <div style="margin-top: 20px; text-align: center">
          <el-form size="medium" :inline="true" :model="form">
            <el-form-item>
              <el-checkbox v-model="form.highlight">Highlight</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="form.passages">Passage</el-checkbox>
              <el-input-number v-model="form.passages_count" :disabled="!form.passages" :min="1" :max="1000"
                               style="margin-left: 10px; min-width: 130px; max-width: 130px;"></el-input-number>
            </el-form-item>
            <el-form-item label="Count">
              <el-input-number v-model="form.count" :min="1" :max="1000" style="min-width: 130px;
    max-width: 130px;"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="Please input natural language query" v-model="form.nlq" style="min-width: 450px;
    max-width: 400px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="nlquery" :loading="loadingNlq">Search</el-button>
              <el-button type="text" @click="reset">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10" style="padding: 5px 5px">
        <el-card class="box-card" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <span>Upload documents</span>
          </div>
          <div style="text-align: center;">
            <el-upload
              name="upload-files"
              drag
              :action="serverUrl + environmentId + '/' + collectionId"
              accept=".doc,.docx,.pdf,.html"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
              <div class="el-upload__tip" slot="tip">pdf/doc/docx/html files</div>
            </el-upload>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="padding: 5px 5px">
        <el-card class="box-card">
          <div>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="All documents (Filter)" name="filter">
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
              </el-tab-pane>
              <el-tab-pane label="JSON (Raw data)" name="json">
                <div v-if="nlqResult">
                  <pre>{{nlqResult}}</pre>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Passage" name="passage">
                <div v-if="nlqResult && nlqResult.passages">
                  <ul>
                    <li>Passages: {{nlqResult.passages.length}}</li>
                    <li v-for="(item, index) in passageTable" :key="index" style="margin-top: 10px">
                      <a :href="serverUrl + 'cos/' + documentTable[index].extracted_metadata.filename"
                         target="_blank">{{documentTable[index].extracted_metadata.filename}}</a>
                      <ul>
                        <li v-for="(v, index) in item" :key="index" style="margin-top: 10px">
                          [Score: {{v.passage_score}}] {{v.passage_text}}}
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Result" name="result">
                <div v-if="nlqResult && nlqResult.results">
                  <ul>
                    <li>Results: {{nlqResult.results.length}}</li>
                    <li v-for="(item, index) in nlqResult.results" :key="index" style="margin-top: 10px">
                      <a :href="getUrl(item)" target="_blank">{{item.extracted_metadata.filename}}</a>
                      <ul>
                        <li>[Score: {{item.result_metadata.score}}]</li>
                        <div v-if="item.highlight">
                          <li>Highlight</li>
                          <li>
                            <ul>
                              <li v-for="(v, index) in item.highlight.text" :key="index">
                                <span v-html="v"></span>
                              </li>
                            </ul>
                          </li>
                        </div>
                        <div v-if="item.enriched_text.sentiment">
                          <li>Sentiment</li>
                          <li>
                            <ul>
                              <li>{{item.enriched_text.sentiment.document.label}}</li>
                            </ul>
                          </li>
                        </div>
                        <div v-if="item.enriched_text.concepts">
                          <li>Concept</li>
                          <li>
                            <ul>
                              <li v-for="(v, index) in item.enriched_text.concepts" :key="index">
                                {{v.text}} ({{v.relevance}})
                              </li>
                            </ul>
                          </li>
                        </div>
                        <div v-if="item.enriched_text.categories">
                          <li>Category</li>
                          <li>
                            <ul>
                              <li v-for="(v, index) in item.enriched_text.categories" :key="index">
                                {{v.label}} ({{v.score}})
                              </li>
                            </ul>
                          </li>
                        </div>
                      </ul>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
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
        nlqResult: null,
        documentTable: {},
        passageTable: {},
        highlightTable: {},
        form: {
          nlq: '',
          count: 10,
          passages_count: 10,
          passages: false,
          highlight: false
        },
        activeTab: 'filter'
      };
    },
    mounted () {
      this.init();
    },
    methods: {
      getUrl (document) {
        let url = `${this.serverUrl}cos/${document.extracted_metadata.filename}`;
        if (this.highlightTable[document.id] && document.extracted_metadata.file_type === 'pdf') {
          url += `#search="${this.highlightTable[document.id]}"`;
        }
        return url;
      },
      nlquery () {
        this.loadingNlq = true;
        const config = {
          method: 'get',
          url: `/${this.environmentId}/${this.collectionId}`,
          params: this.form
        };
        context.api(config)
          .then(({data: v}) => {
            this.nlqResult = v;
            this.documentTable = {};
            this.highlightTable = {};
            v.results.forEach(item => {
              this.documentTable[item.id] = item;
              if (item.highlight && item.highlight.text) {
                const temp = [];
                for (const text of item.highlight.text) {
                  const keyword = text.match(/<em>.*?<\/em>/g);
                  keyword.forEach(item => {
                    temp.push(item.replace(/<[/]?em>/g, ''));
                  });
                }
                this.highlightTable[item.id] = temp.filter((x, i, self) => {
                  return self.indexOf(x) === i;
                }).join(' ');
              }
            });
            if (v.passages) {
              this.passageTable = {};
              v.passages.forEach(item => {
                if (this.passageTable[item.document_id]) {
                  this.passageTable[item.document_id].push(item);
                } else {
                  this.passageTable[item.document_id] = [item];
                }
              });
            }
            this.loadingNlq = false;
            this.activeTab = 'json';
          })
          .catch(e => {
            console.log('error:', e);
            this.loadingNlq = false;
          });
      },
      reset () {
        this.form = {
          nlq: '',
          count: 10,
          passages_count: 10,
          passages: false,
          highlight: false
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
    /* display: inline-block; */
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
