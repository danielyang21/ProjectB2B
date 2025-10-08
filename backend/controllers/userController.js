const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google OAuth token and login/register user
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if email already exists
      user = await User.findOne({ email });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.picture = picture;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId,
          email,
          name,
          picture
        });
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.',
      error: error.message
    });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        matches: user.matches,
        passedCompanies: user.passedCompanies,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Get User Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.preferences = req.body;
    await user.save();

    res.status(200).json({
      success: true,
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update Preferences Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
};

// Add a match
exports.addMatch = async (req, res) => {
  try {
    const { companyId, matchScore, matchReason } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already matched
    const alreadyMatched = user.matches.some(m => m.companyId.toString() === companyId);
    if (alreadyMatched) {
      return res.status(400).json({
        success: false,
        message: 'Company already matched'
      });
    }

    user.matches.push({
      companyId,
      matchScore,
      matchReason
    });

    await user.save();

    res.status(200).json({
      success: true,
      matches: user.matches
    });

  } catch (error) {
    console.error('Add Match Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add match',
      error: error.message
    });
  }
};

// Add a pass
exports.addPass = async (req, res) => {
  try {
    const { companyId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already passed
    if (user.passedCompanies.includes(companyId)) {
      return res.status(400).json({
        success: false,
        message: 'Company already passed'
      });
    }

    user.passedCompanies.push(companyId);
    await user.save();

    res.status(200).json({
      success: true,
      passedCompanies: user.passedCompanies
    });

  } catch (error) {
    console.error('Add Pass Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add pass',
      error: error.message
    });
  }
};

// Get user's matches with company details
exports.getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('matches.companyId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      matches: user.matches
    });

  } catch (error) {
    console.error('Get Matches Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get matches',
      error: error.message
    });
  }
};
