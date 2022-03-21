'use strict'

const SudokuSolver = require('../controllers/sudoku-solver.js')

const getRowIndex = (letter) =>
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].indexOf(letter.toLowerCase())

const coordinateRegex = /^([a-i])([1-9])$/i
const valueRegex = /^[1-9]$/

module.exports = function (app) {
  let solver = new SudokuSolver()

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body

    let error =
      (!puzzle || !coordinate || !value) && 'Required field(s) missing'
    if (error) {
      return res.json({ error })
    }
    error =
      solver.checkPuzzleString(puzzle) ||
      (!coordinate.match(coordinateRegex) && 'Invalid coordinate') ||
      (!value.match(valueRegex) && 'Invalid value')

    if (error) {
      return res.json({ error })
    }

    let rowIndex = getRowIndex(coordinate[0])
    let colIndex = Number(coordinate[1]) - 1
    return res.json(solver.check(puzzle, rowIndex, colIndex, value))
  })

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body

    if (!puzzle) {
      return res.json({ error: 'Required field missing' })
    }
    return res.json(solver.solve(puzzle))
  })
}
