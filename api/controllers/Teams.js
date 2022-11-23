require('dotenv').config();
const db = require('../models');
const mongoose = require('mongoose');


exports.registerTeam = async (req, res) => {
    try {
        let body = req.body;
        if (body.team_name) {
            let payload = {
                team_name: body.team_name
            }
            await db.Teams(payload).save();
            return res.status(200).send({ success: true, message: 'Team registered successfully' });
        }
        else {
            return res.status(500).send({ success: false, message: 'Team name required' });
        }
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
};

exports.modifyTeam = async (req, res) => {
    try {
        let body = req.body;
        if (body.team_id && body.team_name) {
            let payload = {
                team_name: body.team_name
            }
            let modifiedTeam = await db.Teams.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(body.team_id) }, payload);
            if (modifiedTeam) {
                return res.status(200).send({ success: true, message: 'Team modified successfully' });
            }
            else {
                return res.status(500).send({ success: false, message: 'Irregularities in requested data' });
            }
        }
        else {
            return res.status(500).send({ success: false, message: 'Team id and team name required' });
        }
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}

exports.getAllTeams = async (req, res) => {
    try {
        // Pagination
        let page = req.query.page != 0 ? req.query.page ? parseInt(req.query.page) : 1 : 1
        let limit = req.query.limit != 0 ? req.query.limit ? parseInt(req.query.limit) : 5 : 5

        let startIndex = (page - 1) * limit;
        let endIndex = page * limit;
        let result = {};
        // 
        if (endIndex < await db.Teams.countDocuments().exec()) {
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
        let teams = await db.Teams.find({}, { _id: 0, team_id: '$_id', team_name: 1 }).limit(limit).skip(startIndex).sort({ 'created_at': -1 });
        result.data = teams
        return res.status(200).send({ success: true, message: result });
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}

exports.getOneTeam = async (req, res) => {
    try {
        let teamID = req.params.Id;
        let team = await db.Teams.findOne({ _id: mongoose.Types.ObjectId(teamID) }, { _id: 0, team_id: '$_id', team_name: 1 });
        if (team) {
            return res.status(200).send({ success: true, message: team });
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

exports.deleteTeam = async (req, res) => {
    try {
        await db.Teams.deleteMany({});
        return res.status(200).send({ success: true, message: 'Teams deleted successfully' });
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}

exports.deleteOneTeam = async (req, res) => {
    try {
        let teamID = req.params.Id;
        let team = await db.Teams.findByIdAndDelete({ _id: mongoose.Types.ObjectId(teamID) });
        if (team) {
            return res.status(200).send({ success: true, message: 'Team deleted successfully' });
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

exports.getPerformance = async (req, res) => {
    try {
        let teamID = req.params.Id;
        let dbQuery = [
            {
                '$match': {
                    '_id': mongoose.Types.ObjectId(teamID)
                }
            }, {
                '$lookup': {
                    'from': 'players',
                    'localField': '_id',
                    'foreignField': 'team_id',
                    'as': 'players'
                }
            }, {
                '$project': {
                    'team_name': 1,
                    'total_goals': {
                        '$sum': {
                            '$sum': '$players.goals'
                        }
                    },
                    'total_passes': {
                        '$sum': {
                            '$sum': '$players.key_passes'
                        }
                    }
                }
            }
        ]
        let teamStats = await db.Teams.aggregate(dbQuery);
        return res.status(200).send({ success: true, message: teamStats });
    }
    catch (err) {
        console.log({ err });
        return res.status(500).send({ success: false, message: err });
    }
}