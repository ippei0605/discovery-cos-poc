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
                    type="index"
                    header-align="left"
                    align="right"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    width="260"
                    prop="id"
                    label="Id">
                  </el-table-column>
                  <el-table-column
                    prop="notices"
                    label="Notice"
                    header-align="left"
                    align="center"
                    width="70">
                    <template slot-scope="props">
                      <div v-if="props.row.notices">
                        <el-popover trigger="hover" placement="top">
                          <p>Notice</p>
                          <ol style="font-size: 11px; margin-left: -30px">
                            <li v-for="(item, index) in props.row.notices" :key="index">
                              [{{item.severity}}] {{item.description}}
                            </li>
                          </ol>
                          <div slot="reference">
                            <el-tag :type="getNoticeType(props.row.notices)"
                                    size="small">{{props.row.notices.length}}
                            </el-tag>
                          </div>
                        </el-popover>
                      </div>
                    </template>
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
                      <br><a href="javascript:void(0)"
                             @click="doDirect(scope.row.extracted_metadata.filename)">[direct]</a>
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
              <el-tab-pane label="New Training Data" name="new_training_data">
                <div v-if="nlqResult && nlqResult.results">
                  <el-form size="medium" :model="TrainingForm" label-width="180px">
                    <el-form-item label="Natural Language Query">
                      <el-input v-model="TrainingForm.nlq"></el-input>
                    </el-form-item>
                    <p style="margin-left: 20px">
                      <i class="el-icon-info" style="margin-right: 10px"></i>
                      各文書の妥当性 (relevance) を 0 から 100 に設定してください。</p>
                    <ol>
                      <li v-for="(item, index) in nlqResult.results" :key="index" style="margin-top: 10px">
                        <a :href="getUrl(item)" target="_blank">{{item.extracted_metadata.filename}}</a>
                        <el-input-number v-model="TrainingForm.examples[index].relevance"
                                         size="mini" :min="0" :max="100"
                                         style="min-width: 130px; max-width: 130px;float: right;"></el-input-number>
                      </li>
                    </ol>
                    <el-form-item style="margin-top:20px; float: right">
                      <el-button type="warning" icon="el-icon-edit" @click="addTrainingData" :loading="loadingNlq">Add
                      </el-button>
                      <el-button type="text" @click="resetTrainingForm">Reset</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Training Data" name="training_data">
                <div v-loading="loadingCollectionStatus" style="margin-bottom: 10px">
                  <div v-if="collectionStatus.training_status" style="text-align: center">
                    <div style="margin-bottom: 5px">
                      <el-tag type="info">
                        data_updated: <span
                        v-html="vHtmlDatetime(collectionStatus.training_status.data_updated)"></span>
                      </el-tag>
                      <el-tag
                        :type="collectionStatus.training_status.successfully_trained > collectionStatus.training_status.data_updated ? 'info' : 'warning'">
                        successfully_trained: <span
                        v-html="vHtmlDatetime(collectionStatus.training_status.successfully_trained)"></span>
                      </el-tag>
                      <el-tag type="info">
                        total_examples: {{collectionStatus.training_status.total_examples}}
                      </el-tag>
                      <el-button type="primary" icon="el-icon-refresh" circle
                                 style="float: right; margin-right: 14px"
                                 @click="getCollection"></el-button>
                    </div>
                    <div>
                      <el-tag
                        :type="collectionStatus.training_status.sufficient_label_diversity ? 'success' : 'danger'">
                        sufficient_label_diversity
                      </el-tag>
                      <el-tag :type="collectionStatus.training_status.processing ? 'success' : 'danger'">
                        processing
                      </el-tag>
                      <el-tag :type="collectionStatus.training_status.minimum_examples_added ? 'success' : 'danger'">
                        minimum_examples_added
                      </el-tag>
                      <el-tag :type="collectionStatus.training_status.minimum_queries_added ? 'success' : 'danger'">
                        minimum_queries_added
                      </el-tag>
                      <el-tag :type="collectionStatus.training_status.available ? 'success' : 'danger'">
                        available
                      </el-tag>
                    </div>
                  </div>
                </div>
                <div v-loading="loadingTrainingData">
                  <el-table
                    stripe
                    v-loading="loadingTrainingData"
                    :data="trainingData.queries">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <p>Examples:<br>
                          {{props.row.examples}}</p>
                        <p v-if="props.row.notices">Notices:<br>
                          {{props.row.notices}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      type="index"
                      header-align="left"
                      align="right"
                      width="50">
                    </el-table-column>
                    <el-table-column
                      prop="query_id"
                      label="Id">
                    </el-table-column>
                    <el-table-column
                      prop="notices"
                      label="Notice"
                      :render-header="renderHeader"
                      header-align="left"
                      align="center"
                      width="100">
                      <template slot-scope="props">
                        <div v-if="props.row.notices">
                          <el-popover trigger="hover" placement="top">
                            <p>Notice</p>
                            <ol style="font-size: 11px; margin-left: -30px">
                              <li v-for="(item, index) in props.row.notices" :key="index">
                                [{{item.severity}}] {{item.description}}
                              </li>
                            </ol>
                            <div slot="reference">
                              <el-tag :type="getNoticeType(props.row.notices)"
                                      size="small">{{props.row.notices.length}}
                              </el-tag>
                            </div>
                          </el-popover>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="natural_language_query"
                      label="Natural Language Query">
                    </el-table-column>
                    <el-table-column
                      prop="filter"
                      label="Filter">
                    </el-table-column>
                    <el-table-column
                      sortable
                      prop="updated"
                      label="Updated">
                      <template slot-scope="scope">
                        <span v-html="vHtmlDatetime(scope.row.updated)"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Delete" width="60" header-align="center" align="center">
                      <template slot-scope="scope">
                        <el-button size="mini" type="danger" icon="el-icon-delete" circle
                                   @click="deleteTrainingData(scope.row.query_id)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Notice (Raw data)" name="notice">
                <div v-loading="loadingNotices">
                  <pre>{{notices}}</pre>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Collection Status  (Raw data)" name="status">
                <div v-loading="loadingCollectionStatus">
                  <pre>{{collectionStatus}}</pre>
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
  import moment from 'moment-timezone';
  import qs from 'qs';
  import context from '@/context';
  import CosModel from '@/cos-model';

  export default {
    name: 'Discovery',
    data () {
      return {
        cos: null,
        loading: false,
        loadingTable: false,
        loadingTrainingData: false,
        loadingNotices: false,
        loadingNlq: false,
        loadingCollectionStatus: false,
        serverUrl: context.serverUrl,
        environmentId: '',
        collectionId: '',
        bucketName: '',
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
        TrainingForm: {
          nlq: '',
          examples: []
        },
        activeTab: 'filter',
        trainingData: {},
        notices: {},
        collectionStatus: {}
      };
    },
    mounted () {
      this.cos = new CosModel(context.cosCreds);
      this.init();
    },
    methods: {
      doDirect (key) {
        console.log('###', key);
        this.cos.getObject({
          Bucket: this.bucketName,
          Key: key
        })
          .then(v => {
            console.log(v.ContentType);
          })
          .catch(e => {
            console.log('error:', e);
          });
        // window.open('http://xn--9oqrews92vs03aufm3yt.jp/');
      },
      renderHeader (h, {column, $index}) {
        if (this.collectionStatus.training_status && this.collectionStatus.training_status.notice > 0) {
          return h('span', null, [
            h('i', {class: 'el-icon-warning', style: 'margin-right: 5px; color: #F56C6C; font-size: 14px'}),
            h('span', column.label)
          ]);
        } else {
          return h('span', null, [
            h('span', column.label)
          ]);
        }
      },
      vHtmlDatetime (datetime) {
        return moment(datetime).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm:ss');
      },
      getNoticeType (notices) {
        let noticeType = 'info';
        for (const item of notices) {
          if (item.severity === 'error') {
            noticeType = 'error';
            break;
          } else if (item.severity === 'warning') {
            noticeType = 'warning';
          }
        }
        return noticeType;
      },
      addTrainingData () {
        this.$confirm('トレーニングデータを追加します。よろしいですか？', 'Warning', {
          confirmButtonText: 'OK',
          cancelBfuttonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          const config = {
            method: 'post',
            url: `/${this.environmentId}/${this.collectionId}/train`,
            data: qs.stringify({
              natural_language_query: this.TrainingForm.nlq,
              examples: this.TrainingForm.examples
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          };
          context.api(config)
            .then(({data: v}) => {
              this.$notify.success({
                title: 'Success',
                message: 'トレーニングデータを追加しました。'
              });
              this.listTrainingData();
            })
            .catch(e => {
              let message = 'トレーニングデータを追加できませんでした。';
              if (e.response.status === 409) {
                message = 'トレーニングデータが競合するため追加できませんでした。';
              }
              console.log('error:', e);
              this.$notify.error({
                title: 'Error',
                message: message,
                duration: 0
              });
            });
        }).catch(() => {
        });
      },
      resetTrainingForm () {
        const examples = this.nlqResult.results.map(item => {
          return {
            document_id: item.id,
            relevance: 1
          };
        });
        this.TrainingForm = {
          nlq: this.form.nlq,
          examples: examples
        };
      },
      getUrl (document) {
        let url = `${this.serverUrl}cos/${document.extracted_metadata.filename}`;
        if (this.highlightTable[document.id] && document.extracted_metadata.file_type === 'pdf') {
          url += `#search="${this.highlightTable[document.id]}"`;
        }
        return url;
      },
      kangxiToCjk (text) {
        const table = {
          '一': '一',
          '⽅': '方',
          '改': '改',
          '⾰': '革',
          '⾃': '自',
          '由': '由',
          '⾼': '高'
        };
        for (const key in table) {
          text = text.replace(new RegExp(key, 'g'), table[key]);
        }
        return text;
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
                    temp.push(this.kangxiToCjk(item.replace(/<[/]?em>/g, '')));
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
            this.resetTrainingForm();
            this.loadingNlq = false;
            if (this.activeTab === 'filter') this.activeTab = 'json';
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
            this.bucketName = v.bucket_name;
            this.info = [
              {
                item: '/:environment_id/:collection_id',
                value: '/' + this.environmentId + '/' + this.collectionId
              },
              {
                item: 'bucket',
                value: this.bucketName
              }
            ];
            this.list();
            this.listTrainingData();
            this.queryNotices();
            this.getCollection();
            this.loading = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loading = false;
          });
      },
      queryNotices () {
        this.loadingNotices = true;
        const config = {
          method: 'get',
          url: `/${this.environmentId}/${this.collectionId}/notices`,
          params: {
            count: 1000
          }
        };
        context.api(config)
          .then(({data: v}) => {
            this.notices = v;
            this.loadingNotices = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loadingNotices = false;
          });
      },
      listTrainingData () {
        this.loadingTrainingData = true;
        const config = {
          method: 'get',
          url: `/${this.environmentId}/${this.collectionId}/train`
        };
        context.api(config)
          .then(({data: v}) => {
            this.trainingData = v;
            this.loadingTrainingData = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loadingTrainingData = false;
          });
      },
      getCollection () {
        this.loadingCollectionStatus = true;
        const config = {
          method: 'get',
          url: `/${this.environmentId}/${this.collectionId}/status`
        };
        context.api(config)
          .then(({data: v}) => {
            this.collectionStatus = v;
            this.loadingCollectionStatus = false;
          })
          .catch(e => {
            console.log('error:', e);
            this.loadingCollectionStatus = false;
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
      deleteTrainingData (queryId) {
        this.$confirm('トレーニングデータを削除します。よろしいですか？', 'Warning', {
          confirmButtonText: 'OK',
          cancelBfuttonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          const config = {
            method: 'delete',
            url: `/${this.environmentId}/${this.collectionId}/train/${queryId}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          };
          context.api(config)
            .then(({data: v}) => {
              this.$notify.success({
                title: 'Success',
                message: 'トレーニングデータを削除しました。'
              });
              this.listTrainingData();
            })
            .catch(e => {
              console.log('error:', e);
              this.$notify.error({
                title: 'Error',
                message: 'トレーニングデータを削除できませんでした。',
                duration: 0
              });
            });
        }).catch(() => {
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
