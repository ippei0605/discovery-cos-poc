/**
 * @file Discovery COS PoC Server: セットアップ
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    context = require('./context'),
    DiscoveryModel = require('./models/discovery-model');

const discovery = new DiscoveryModel(context.DISCOVERY_CREDS);

// environment_id: 'c3768453-db12-40ce-aeaf-4853b6f6006b'
// configuration_id: 'bd986459-be10-4e05-9ee0-613997de77b9'

/*
discovery.getConfiguration({
    environment_id: 'c3768453-db12-40ce-aeaf-4853b6f6006b',
    configuration_id: 'bd986459-be10-4e05-9ee0-613997de77b9'
})
    .then(v => console.log(v))
    .catch(e => console.log('error:', e));
*/

/*
discovery.listConfigurations({
    environment_id: 'c3768453-db12-40ce-aeaf-4853b6f6006b',
    name: 'Default Configuration'
})
    .then(v => console.log(v))
    .catch(e => console.log('error:', e));
*/


discovery.listEnvironments({
    name: 'my_environment2'
})
    .then(({ environments: v}) => {
        if(v[0]) throw new Error('The environment already exists.');

        console.log(v[0])
    })
    .catch(e => console.log('error:', e));


/*
discovery.createEnvironment({
    name: 'my_environment',
    description: 'My environment'
})
    .then(v => {
        console.log(v);
    })
    .catch(e => {
        console.log('error:', e);
    });
    */

