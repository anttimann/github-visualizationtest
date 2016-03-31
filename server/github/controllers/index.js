'use strict';

const Promise = require('bluebird');
const httpReq = Promise.promisify(require('request'));
const config = require('../config');
const _ = require('lodash');

const cache = {
    repos: {},
    users: {}
};

function handler(userId, reply) {
    getRepositoriesByUser(userId)
        .then((repos) => {
            Promise.all(_.map(repos, (r) => requestRepoCommits(userId, r, true)))
                .then(data => {
                    reply(
                        _(data)
                        .flatten()
                        .groupBy('name')
                    );
                });
        })
        .catch((err) => {
            console.log(err);
            reply([]);
        });
}

function getRepositoriesByUser(userId) {
    if (cache.users[userId]) {
        return Promise.resolve(cache.users[userId]);
    }

    return httpReq(createRequestOptions('users/' + userId + '/repos'))
        .then((response) => {
            let repos = _.map(JSON.parse(response.body), 'name');
            cache.users[userId] = repos;
            return repos;
        })
        .catch((err) => {
            console.log('Failed: ' + err);
            return [ ];
        });
}

function requestRepoCommits(userId, repo, retry) {
    if (cache.repos[userId] && cache.repos[userId][repo]) {
        return Promise.resolve(cache.repos[userId][repo]);
    }

    return httpReq(createRequestOptions('repos/' + userId + '/' + repo + '/stats/contributors'))
        .then((response) => {
            var values = _.map(JSON.parse(response.body), function (entry) {
                return {
                    repository: repo,
                    name: entry.author.login,
                    commits: entry.total
                };
            });

            if (!cache.repos[userId]) cache.repos[userId] = {};
            cache.repos[userId][repo] = values;
            
            return values;
        })
        .catch((err) => {
            if (retry) {
                return Promise.delay(config.retryDelay).then(() => {
                    return requestRepoCommits(userId, repo, false);
                });
            }
            
            console.log('Retry didnt help: ' + err);
            return null;
        });
}

function createRequestOptions(url) {
    let options = {
        url: config.baseUrl + url,
        headers: {'User-Agent': config.userAgent }
    };
    
    if (config.password) {
        options.auth = { user: config.user, pass: config.password};
    }
    
    return options;
}

module.exports = handler;