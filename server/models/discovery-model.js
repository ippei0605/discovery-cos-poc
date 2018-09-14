/**
 * DiscoveryModel COS PoC Server: Discovery Model
 *
 * @module models/discovery-model
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

class DiscoveryModel {

    constructor (creds) {
        try {
            this.discovery = new DiscoveryV1({
                username: creds.username,
                password: creds.password,
                version_date: '2018-08-01'
            });
        } catch (e) {
            console.log('error:', e);
        }
    }

    createEnvironment (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.name) throw new Error('Missing required parameters: name');
                this.discovery.createEnvironment(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#delete-environment
    deleteEnvironment (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                this.discovery.deleteEnvironment(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    listEnvironments (params) {
        return new Promise((resolve, reject) => {
            try {
                this.discovery.listEnvironments(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    listConfigurations (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                this.discovery.listConfigurations(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    getConfiguration (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.configuration_id) throw new Error('Missing required parameters: configuration_id');
                this.discovery.getConfiguration(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#list-collections
    listCollections (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                this.discovery.listCollections(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#get-collection
    getCollection (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');

                this.discovery.getCollection(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#create-collection
    createCollection (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.name) throw new Error('Missing required parameters: name');
                this.discovery.createCollection(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#add-document
    addDocument (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');
                this.discovery.addDocument(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#delete-document
    deleteDocument (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');
                if (!params.document_id) throw new Error('Missing required parameters: document_id');
                this.discovery.deleteDocument(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#query
    query (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');
                this.discovery.query(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#list-training-data
    listTrainingData (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');
                this.discovery.listTrainingData(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#add-training-data
    addTrainingData (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');
                this.discovery.addTrainingData(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#delete-training-data
    deleteTrainingData (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');
                if (!params.query_id) throw new Error('Missing required parameters: query_id');
                this.discovery.deleteTrainingData(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }

    // https://www.ibm.com/watson/developercloud/discovery/api/v1/node.html?node#query-notices
    queryNotices (params) {
        return new Promise((resolve, reject) => {
            try {
                if (!params.environment_id) throw new Error('Missing required parameters: environment_id');
                if (!params.collection_id) throw new Error('Missing required parameters: collection_id');
                this.discovery.queryNotices(params, (error, value) => {
                    if (error) {
                        console.log('error:', error);
                        reject(error);
                    } else {
                        resolve(value);
                    }
                });
            } catch (e) {
                console.log('error:', e);
                reject(e);
            }
        });
    }
}

module.exports = DiscoveryModel;