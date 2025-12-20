const { FundingApplication, FundingProgram, User } = require('../models');

// Apply for funding (Farmers only)
exports.applyForFunding = async (req, res) => {
    try {
        if (req.user.role !== 'farmer') {
            return res.status(403).json({ message: 'Only farmers can apply for funding' });
        }

        const { program_id, proposal_text, amount_requested, documents } = req.body;

        // Check if already applied
        const existingApplication = await FundingApplication.findOne({
            where: { program_id, applicant_id: req.user.id }
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this program' });
        }

        const application = await FundingApplication.create({
            program_id,
            applicant_id: req.user.id,
            proposal_text,
            amount_requested,
            documents
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Error applying for funding:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get applications for a specific program (Investor/Provider only)
exports.getProgramApplications = async (req, res) => {
    try {
        const { programId } = req.params;

        // Verify ownership of the program
        const program = await FundingProgram.findByPk(programId);
        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        if (program.provider_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view these applications' });
        }

        const applications = await FundingApplication.findAll({
            where: { program_id: programId },
            include: [
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id', 'name', 'email', 'phone', 'region']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get my applications (Farmer)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await FundingApplication.findAll({
            where: { applicant_id: req.user.id },
            include: [
                {
                    model: FundingProgram,
                    as: 'program',
                    attributes: ['id', 'title', 'type', 'amount']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching my applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update application status (Investor only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await FundingApplication.findByPk(id, {
            include: [{ model: FundingProgram, as: 'program' }]
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify ownership via program
        if (application.program.provider_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        application.status = status;
        application.reviewed_at = new Date();
        await application.save();

        res.json(application);
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Get all applications for all programs owned by the provider (Investor)
exports.getProviderApplications = async (req, res) => {
    try {
        // First find all programs owned by this user
        const programs = await FundingProgram.findAll({
            where: { provider_id: req.user.id },
            attributes: ['id']
        });

        const programIds = programs.map(p => p.id);

        const applications = await FundingApplication.findAll({
            where: { program_id: programIds },
            include: [
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id', 'name', 'email', 'phone', 'region']
                },
                {
                    model: FundingProgram,
                    as: 'program',
                    attributes: ['id', 'title', 'type', 'amount']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(applications);
    } catch (error) {
        console.error('Error fetching provider applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
