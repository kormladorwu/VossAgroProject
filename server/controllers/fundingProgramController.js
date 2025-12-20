const { FundingProgram, User } = require('../models');

// Get all funding programs
exports.getAllFundingPrograms = async (req, res) => {
  try {
    const fundingPrograms = await FundingProgram.findAll({
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'region', 'is_verified']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(fundingPrograms);
  } catch (error) {
    console.error('Error fetching funding programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get funding program by ID
exports.getFundingProgramById = async (req, res) => {
  try {
    const fundingProgram = await FundingProgram.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'region', 'is_verified']
        }
      ]
    });
    if (!fundingProgram) {
      return res.status(404).json({ message: 'Funding program not found' });
    }
    res.json(fundingProgram);
  } catch (error) {
    console.error('Error fetching funding program by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new funding program
exports.createFundingProgram = async (req, res) => {
  try {
    // Set provider_id from authenticated user
    const programData = {
      ...req.body,
      provider_id: req.user.id
    };
    const newFundingProgram = await FundingProgram.create(programData);
    res.status(201).json(newFundingProgram);
  } catch (error) {
    console.error('Error creating funding program:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a funding program
exports.updateFundingProgram = async (req, res) => {
  try {
    const [updatedRows] = await FundingProgram.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Funding program not found' });
    }
    const updatedFundingProgram = await FundingProgram.findByPk(req.params.id);
    res.json(updatedFundingProgram);
  } catch (error) {
    console.error('Error updating funding program:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a funding program (only the provider can delete their own programs)
exports.deleteFundingProgram = async (req, res) => {
  try {
    // First, find the program to check ownership
    const program = await FundingProgram.findByPk(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Funding program not found' });
    }

    // Check if the authenticated user is the provider who created this program
    if (program.provider_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own funding programs' });
    }

    await program.destroy();
    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error('Error deleting funding program:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
