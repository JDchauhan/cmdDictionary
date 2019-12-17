#!/usr/bin/env node

'use strict'

const axios = require('axios')

module.exports.get = async (ApiPath = '/words/randomWord') => {
    return new Promise((resolve, reject) => {
        const URL = 'https://fourtytwowords.herokuapp.com' + ApiPath
        const params = {
            api_key: process.env.API_KEY
        }
        axios.get(URL, { params })
            .then(
                response => {
                    return resolve(response.data)
                },
                err => reject(err)
            )
    })
}
