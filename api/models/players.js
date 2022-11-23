const mongoose = require('mongoose');

const PlayersSchema = new mongoose.Schema({
    team_id: {
        type: mongoose.Types.ObjectId,
        required: 'Required'
    },
    name: {
        type: String,
        required: 'Required'
    },
    appearances: {
        type: Number,
        default: 0,
    },
    goals: {
        type: Number,
        default: 0,
    },
    assists: {
        type: Number,
        default: 0,
    },
    cross_accuracy: {
        type: Number,
        default: 0,
    },
    key_passes: {
        type: Number,
        default: 0,
    },
    tackles: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
module.exports = mongoose.model('players', PlayersSchema);
