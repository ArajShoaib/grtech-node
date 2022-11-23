require('dotenv').config();
const db = require('../models');
const mongoose = require('mongoose');


exports.registerPlayer = async (req, res) => {
    try {
        let body = req.body;
        if (body.team_id) {
            let team = await db.Teams.findOne({ _id: mongoose.Types.ObjectId(body.team_id) });
            if (team) {
                if (body.name) {
                    let payload = {
                        team_id: team._id,
                        name: body.name,
                        appearances: body.appearances,
                        goals: body.goals,
                        assists: body.assists,
                        cross_accuracy: body.cross_accuracy,
                        key_passes: body.key_passes,
                        tackles: body.tackles,
                    }
                    await db.Players(payload).save();
                    return res.status(200).send({ success: true, message: 'Player registered successfully' });
                }
                else {
                    return res.status(500).send({ success: false, message: 'Player name required' });
                }
            }
            else {
                return res.status(500).send({ success: false, message: 'Invalid team' });
            }
        }
        else {
            return res.status(500).send({ success: false, message: 'Irregularities in requested data' });
        }
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
};

exports.modifyPlayer = async (req, res) => {
    try {
        let body = req.body;
        if (body.player_id) {
            let player = await db.Players.findOne({ _id: mongoose.Types.ObjectId(body.player_id) });
            if (player) {
                let payload = {
                    name: body.name ? body.name : player.name,
                    appearances: body.appearances ? body.appearances : player.appearances,
                    goals: body.goals ? body.goals : player.goals,
                    assists: body.assists ? body.assists : player.assists,
                    cross_accuracy: body.cross_accuracy ? body.cross_accuracy : player.cross_accuracy,
                    key_passes: body.key_passes ? body.key_passes : player.key_passes,
                    tackles: body.tackles ? body.tackles : player.tackles,
                }
                let updatePlayer = await db.Players.updateOne({ _id: player._id }, payload);
                if (updatePlayer.modifiedCount) {
                    return res.status(200).send({ success: true, message: 'Player modified successfully' });
                }
                else {
                    return res.status(500).send({ success: false, message: 'Player modification was unsuccessful' }); 
                }
            }
            else {
                return res.status(500).send({ success: false, message: 'Player not found' });
            }
        }
        else {
            return res.status(500).send({ success: false, message: 'Irregularities in requested data' });
        }
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}

exports.getAllPlayers = async (req, res) => {
    try {
        let where = {}
        if (req.query.team_id) {
            where.team_id = mongoose.Types.ObjectId(req.query.team_id);
        }
        // Pagination
        let page = req.query.page != 0 ? req.query.page ? parseInt(req.query.page) : 1 : 1
        let limit = req.query.limit != 0 ? req.query.limit ? parseInt(req.query.limit) : 5 : 5
        let startIndex = (page - 1) * limit;
        let endIndex = page * limit;
        let result = {};
        // 
        if (endIndex < await db.Players.countDocuments(where).exec()) {
            result.next = {
                page: page + 1,
            }
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
            }
        }
        // Pagination
        let players = await db.Players.find(where).limit(limit).skip(startIndex).sort({ 'created_at': -1 });
        result.data = players
        return res.status(200).send({ success: true, message: result });
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}

exports.getOnePlayer = async (req, res) => {
    try {
        let playerID = req.params.Id;
        let player = await db.Players.findOne({ _id: mongoose.Types.ObjectId(playerID) });
        if (player) {
            return res.status(200).send({ success: true, message: player });
        }
        else {
            return res.status(500).send({ success: false, message: 'Irregularities in requested data' });
        }
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}

exports.deletePlayers = async (req, res) => {
    try {
        let where = {};
        if (req.query.team_id) {
            where.team_id = mongoose.Types.ObjectId(req.query.team_id);
            await db.Players.deleteMany(where);
            return res.status(200).send({ success: true, message: 'Players deleted successfully' });
        }
        else {
            return res.status(500).send({ success: false, message: 'Please select the team' });
        }
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}

exports.deleteOnePlayer = async (req, res) => {
    try {
        let playerID = req.params.Id;
        let player = await db.Players.findByIdAndDelete({ _id: mongoose.Types.ObjectId(playerID) });
        if (player) {
            return res.status(200).send({ success: true, message: 'Player deleted successfully' });
        }
        else {
            return res.status(500).send({ success: false, message: 'Irregularities in requested data' });
        }
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}