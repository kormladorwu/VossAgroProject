const { FundingProgram, User } = require('../models');
const { Op } = require('sequelize');

// Get all funding programs
exports.getAllPrograms = async (req, res) => {
    try {
        const { type, min_amount } = req.query;
        let whereClause = { is_active: true };

        if (type) whereClause.type = type;
        if (min_amount) whereClause.amount = { [Op.gte]: min_amount };

        const programs = await FundingProgram.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name', 'email', 'is_verified']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(programs);
    } catch (error) {
        console.error('Error fetching funding programs:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new funding program
exports.createProgram = async (req, res) => {
    try {
        // Ensure user is an investor or admin
        if (req.user.role !== 'investor' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only investors can post funding opportunities' });
        }

        const { title, description, amount, type, deadline, requirements, interest_rate } = req.body;

        const newProgram = await FundingProgram.create({
            title,
            description,
            amount,
            type,
            deadline,
            requirements,
            interest_rate,
            provider_id: req.user.id
        });

        res.status(201).json(newProgram);
    } catch (error) {
        console.error('Error creating funding program:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get program by ID
exports.getProgramById = async (req, res) => {
    try {
        const program = await FundingProgram.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name', 'email', 'is_verified']
                }
            ]
        });
        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }
        res.json(program);
    } catch (error) {
        console.error('Error fetching program by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a funding program
exports.deleteProgram = async (req, res) => {
    try {
        const program = await FundingProgram.findByPk(req.params.id);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        // Check ownership
        if (program.provider_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this program' });
        }

        await program.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
