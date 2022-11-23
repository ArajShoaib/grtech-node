const router = require('express').Router();
const controllers = require('../controllers');

router.post('/', (req, res) => {
    controllers.Teams.registerTeam(req, res)
})
router.put('/', (req, res) => {
    controllers.Teams.modifyTeam(req, res)
})
router.get('/', (req, res) => {
    controllers.Teams.getAllTeams(req, res)
})
router.get('/:Id', (req, res) => {
    controllers.Teams.getOneTeam(req, res)
})
router.delete('/', (req, res) => {
    controllers.Teams.deleteTeam(req, res)
})
router.delete('/:Id', (req, res) => {
    controllers.Teams.deleteOneTeam(req, res)
})
router.get('/performance/:Id', (req, res) => {
    controllers.Teams.getPerformance(req, res)
})

module.exports = router;