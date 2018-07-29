/**
 * DiscoveryModel COS PoC Client: COS Model
 *
 * @module models/cos-model
 * @author Ippei SUZUKI
 */

'use strict';

const ENDPOINT = 's3-api.us-geo.objectstorage.softlayer.net';
const STORAGE_CLASS = 'us-standard';

// モジュールを読込む。
const AWS = require('ibm-cos-sdk');

export default class {
  constructor (creds) {
    try {
      this.cos = new AWS.S3({
        endpoint: ENDPOINT,
        apiKeyId: creds.apikey,
        serviceInstanceId: creds.resource_instance_id
      });
    } catch (e) {
      console.log('error:', e);
    }
  }

  listBuckets (name) {
    return new Promise((resolve, reject) => {
      try {
        this.cos.listBuckets({}, (error, value) => {
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

  createBucket (name) {
    return new Promise((resolve, reject) => {
      try {
        this.cos.createBucket({
          Bucket: name,
          CreateBucketConfiguration: {
            LocationConstraint: STORAGE_CLASS
          }
        }, (error, value) => {
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

  putObject (params) {
    return new Promise((resolve, reject) => {
      try {
        this.cos.putObject(params, (error, value) => {
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

  getObject (params) {
    return new Promise((resolve, reject) => {
      try {
        this.cos.getObject(params, (error, value) => {
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

  deleteObject (params) {
    return new Promise((resolve, reject) => {
      try {
        this.cos.deleteObject(params, (error, value) => {
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
