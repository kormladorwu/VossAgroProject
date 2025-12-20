const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const productRoutes = require('./routes/productRoutes');
const fundingProgramRoutes = require('./routes/fundingProgramRoutes');
const landListingRoutes = require('./routes/landListingRoutes');
const landInquiryRoutes = require('./routes/landInquiryRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const fundingRoutes = require('./routes/fundingRoutes');
const fundingApplicationRoutes = require('./routes/fundingApplicationRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(helmet()); // Set security HTTP headers
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs (relaxed for dev)
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Use product routes
app.use('/api/products', productRoutes);
// Use funding program routes
app.use('/api/funding-programs', fundingProgramRoutes);
// Use land listing routes
app.use('/api/land-listings', landListingRoutes);
app.use('/api/land-inquiries', landInquiryRoutes);
// Use AI routes
app.use('/api/ai', aiRoutes);
// Use Auth routes
app.use('/api/auth', authRoutes);
// Use Order routes
app.use('/api/orders', orderRoutes);
// Use Funding routes
app.use('/api/funding', fundingRoutes);
// Use Funding Application routes
app.use('/api/funding-applications', fundingApplicationRoutes);
// Use Admin routes
app.use('/api/admin', adminRoutes);

// Catch-all for 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
