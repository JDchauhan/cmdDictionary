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
                // eslint-disable-next-line prefer-const
                let synonyms = data.find(obj => obj.relationshipType === relationshipType)
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

module.exports.exampleWords = (word = 'grain') => {
    return new Promise((resolve, reject) => {
        const PATH = `/word/${word}/examples`
        AxiosUtil.get(PATH).then(
            data => {
                let result = ''
                data.examples.map((row) => {
                    result += row.text
                    result += '\n'
                })
                resolve(result)
            },
            err => reject(err.response.data.error)
        )
    })
}

module.exports.randomWord = () => {
    return new Promise((resolve, reject) => {
        const PATH = '/words/randomWord'
        AxiosUtil.get(PATH).then(
            word => resolve(word.word),
            err => reject(err.response.data.error)
        )
    })
}

module.exports.wordFullDetails = async (word) => {
    return new Promise(async (resolve, reject) => {
        try {
            const definetion = await this.definetion(word)
            const synonym = await this.relatedWords(word, 'synonym')
            const antonym = await this.relatedWords(word, 'antonym')
            const examples = await this.exampleWords(word)

            console.log('~~~~~~~~~~~~~~~DEFINITION~~~~~~~~~~~~~~~~~~~~')
            console.log(definetion.join('\n'))
            console.log('~~~~~~~~~~~~~~~SYNONYMS~~~~~~~~~~~~~~~~~~~~')
            console.log(typeof synonym === 'string' ? synonym : synonym.join(', '))
            console.log('~~~~~~~~~~~~~~~ANTONYMS~~~~~~~~~~~~~~~~~~~~')
            console.log(typeof antonym === 'string' ? antonym : antonym.join(', '))
            console.log('~~~~~~~~~~~~~~~WORD EXAMPLE~~~~~~~~~~~~~~~~~~~~')
            console.log(examples)
            resolve()
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

module.exports.wordOfDay = async () => {
    try {
        const word = await this.randomWord()
        console.log('~~~~~~~~~~~~~~~WORD OF DAY~~~~~~~~~~~~~~~~~~~~')
        console.log(word)
        this.wordFullDetails(word)
    } catch (err) {
        console.log(err)
    }
}
