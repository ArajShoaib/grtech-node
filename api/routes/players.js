const router = require('express').Router();
const controllers = require('../controllers');

router.post('/', (req, res) => {
    controllers.Players.registerPlayer(req, res)
})
router.put('/', (req, res) => {
    controllers.Players.modifyPlayer(req, res)
})
router.get('/', (req, res) => {
    controllers.Players.getAllPlayers(req, res)
})
router.get('/:Id', (req, res) => {
    controllers.Players.getOnePlayer(req, res)
})
router.delete('/', (req, res) => {
    controllers.Players.deletePlayers(req, res)
})
router.delete('/:Id', (req, res) => {
    controllers.Players.deleteOnePlayer(req, res)
})

module.exports = router;