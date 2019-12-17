#!/usr/bin/env node

'use strict'

const readline = require('readline')
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

// Random no generator
const randomNum = (size) => {
    return Math.ceil(Math.random() * size)
}

// jumbling string (@source Stackoverflow )
// eslint-disable-next-line no-unused-vars
const jumbled = (string) => {
    if (string.length < 2) return string // This is our break condition

    var permutations = [] // This array will hold our permutations
    for (var i = 0; i < string.length; i++) {
        var char = string[i]

        // Cause we don't want any duplicates:
        if (string.indexOf(char) !== i) { // if char was used already
            continue// skip it this time
        }

        var remainingString = string.slice(0, i) + string.slice(i + 1, string.length) // Note: you can concat Strings via '+' in JS

        for (var subPermutation of jumbled(remainingString)) {
            permutations.push(char + subPermutation)
        }
    }
    return permutations
}
module.exports.play = async () => {
    const word = await this.randomWord()

    const definetion = await this.definetion(word)
    const synonym = await this.relatedWords(word, 'synonym')
    const antonym = await this.relatedWords(word, 'antonym')

    let hints = definetion.concat(synonym)
    if (typeof antonym !== 'string') {
        hints = hints.concat(antonym)
    }

    console.log(hints.splice([randomNum(hints.length) - 1], 1)[0])

    const readlineInterface = readline.createInterface(process.stdin, process.stdout)
    const input = (questionText) => {
        return new Promise((resolve, reject) => {
            readlineInterface.question(questionText, resolve)
        })
    }

    let guess = await input('guess the word: ')

    let choice
    while (!(guess === word || synonym.indexOf(guess) !== -1)) {
        const jumbledWord = jumbled(word)
        hints = hints.concat(jumbledWord)

        choice = await input('Wrong Choice!!! type 1 to try again, 2 for hint, 3 for quit: ')
        switch (parseInt(choice)) {
        case 1:
            guess = await input('guess the word: ')
            console.log(guess)
            break

        case 2:
            console.log(hints.splice([randomNum(hints.length) - 1], 1)[0])
            guess = await input('guess the word: ')
            console.log(guess)
            break

        case 3:
            console.log('~~~~~~~~~~~~~~~~~WORD~~~~~~~~~~~~~~~~')
            console.log(word)
            await this.wordFullDetails(word)
            process.exit(0)
        }
    }
    console.log('Success!!!')
    process.exit(0)
}
