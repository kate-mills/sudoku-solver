const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js')

suite('Functional Tests', () => {

  suite('POST /api/solve - solve a puzzle with a puzzle string', () => {

    // #1
    test('POST /api/solve with valid puzzle string', function (done) {
      let puzzle = puzzlesAndSolutions[0]
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzle[0] })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.solution.length, 81)
          assert.equal(res.body.solution, puzzle[1])
          done()
        })
    })

    // #2
    test('POST /api/solve - solve a puzzle with missing puzzle string', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({nopuzzle:''})
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Required field missing')
          done()
        })
    })

    // #3
    test('POST /api/solve - solve a puzzle with invalid characters', function (done) {

      let  puzzle = puzzlesAndSolutions[0][0].replace(/8/g, '0')

      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done()
        })
    })

    // #4
    test('POST /api/solve - solve a puzzle with incorrect length', function (done) {
      let puzzle = puzzlesAndSolutions[0][0] + ".."
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(
            res.body.error,
            'Expected puzzle to be 81 characters long'
          )
          done()
        })
    })


    // #5
    test('POST /api/solve - solve a puzzle that cannot be solved', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({
          puzzle:
            '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Puzzle cannot be solved')
          done()
        })
    })

  })




suite('POST /api/check - check a puzzle placement', () => {
   var puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

    // #6
    test('POST /api/check - check a puzzle placement with all fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A1', value: '7' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, true)
          done()
        })
    })

    // #7
    test('POST /api/check - check a puzzle placement with a single placement conflict', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A1', value: '3' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 1)
          assert.equal(res.body.conflict[0], 'region')
          done()
        })
    })

    // #8
    test('POST /api/check - check a puzzle placement with multiple placement conflicts', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A1', value: '4' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 2)
          done()
        })
    })


    // #9
    test('POST /api/check - check a puzzle placement with all placement conflicts', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A1', value: '5' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 3)
          done()
        })
    })

    // #10
    test('POST /api/check - check a puzzle placement missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, value: '5' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Required field(s) missing')
          done()
        })
    })
    // #11
    test('POST /api/check - check a puzzle placement with invalid characters', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A1', value: '.' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid value')
          done()
        })
    })

    // #12
    test('POST /api/check - check a puzzle placement with incorrect length', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A1', value: '55' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid value')
          done()
        })
    })

    // #13
    test('POST /api/check - check a puzzle placement with invalid placement coordinate', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: '1A', value: '5' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid coordinate')
          done()
        })
    })

    // #14
    test('POST /api/check - check a puzzle placement with invalid placement value', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A1', value: '0' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid value')
          done()
        })
    })

  })
})
