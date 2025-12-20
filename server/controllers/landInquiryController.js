const { LandInquiry, LandListing, User } = require('../models');

// Create a new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const { land_id, message } = req.body;
        const buyer_id = req.user.id;

        // Check if land exists
        const land = await LandListing.findByPk(land_id);
        if (!land) {
            return res.status(404).json({ message: 'Land listing not found' });
        }

        // Prevent owner from inquiring on their own land
        if (land.owner_id === buyer_id) {
            return res.status(400).json({ message: 'You cannot inquire on your own land' });
        }

        const newInquiry = await LandInquiry.create({
            land_id,
            buyer_id,
            message,
            status: 'pending'
        });

        res.status(201).json(newInquiry);
    } catch (error) {
        console.error('Error creating land inquiry:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get inquiries for a land owner (Farmer view)
exports.getOwnerInquiries = async (req, res) => {
    try {
        const owner_id = req.user.id;

        const inquiries = await LandInquiry.findAll({
            include: [
                {
                    model: LandListing,
                    as: 'land',
                    where: { owner_id },
                    attributes: ['id', 'title', 'location', 'region']
                },
                {
                    model: User,
                    as: 'buyer',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching owner inquiries:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get inquiries sent by a buyer (Buyer view)
exports.getBuyerInquiries = async (req, res) => {
    try {
        const buyer_id = req.user.id;

        const inquiries = await LandInquiry.findAll({
            where: { buyer_id },
            include: [
                {
                    model: LandListing,
                    as: 'land',
                    attributes: ['id', 'title', 'location', 'region', 'price', 'type', 'images'],
                    include: [
                        {
                            model: User,
                            as: 'owner',
                            attributes: ['id', 'name', 'email', 'phone']
                        }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching buyer inquiries:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await LandInquiry.findByPk(req.params.id, {
            include: [{ model: LandListing, as: 'land' }]
        });

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        // Only the land owner can update the status
        if (inquiry.land.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this inquiry' });
        }

        inquiry.status = status;
        await inquiry.save();

        res.json(inquiry);
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
