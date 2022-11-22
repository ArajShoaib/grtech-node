const mongoose = require('mongoose');

const TeamsSchema = new mongoose.Schema({
    team_name: {
        type: String,
        required: 'Required'
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
module.exports = mongoose.model('teams', TeamsSchema);
