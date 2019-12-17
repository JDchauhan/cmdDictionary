#!/usr/bin/env node

'use strict'

const AxiosUtil = require('./AxiosUtils')

module.exports.definetion = (word = 'grain') => {
    return new Promise((resolve, reject) => {
        const PATH = `/word/${word}/definitions`
        AxiosUtil.get(PATH).then(
            data => {
                // eslint-disable-next-line prefer-const
                let result = []
                data.map((row) => {
                    result.push(row.text)
                })
                resolve(result)
            },
            err => {
                reject(err.response.data.error)
            }
        )
    })
}

module.exports.relatedWords = (word = 'grain', relationshipType = 'synonym') => {
    return new Promise((resolve, reject) => {
        const PATH = `/word/${word}/relatedWords`
        AxiosUtil.get(PATH).then(
            data => {
                let synonyms = data.find(obj => obj.relationshipType === relationshipType);
                if (synonyms) {
                    resolve(synonyms.words)
                } else {
                    resolve(`Sorry! No ${relationshipType} found`)
                }
            },
            err => reject(err.response.data.error)
        )
    })
}
