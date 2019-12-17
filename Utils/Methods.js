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
