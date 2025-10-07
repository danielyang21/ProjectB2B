const { GoogleGenerativeAI } = require('@google/generative-ai');
const Service = require('../models/Service');

// Match companies based on user prompt using AI
exports.matchCompanies = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(400).json({
        success: false,
        message: 'Google Gemini API key not configured. Add GEMINI_API_KEY to your .env file.'
      });
    }

    // Get all approved companies from database
    const allCompanies = await Service.find({ approved: true });

    if (allCompanies.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No companies available for matching'
      });
    }

    // Prepare company data for AI
    const companyData = allCompanies.map(c => ({
      id: c._id,
      name: c.companyName,
      rating: c.rating,
      location: c.location,
      companySize: c.companySize,
      industry: c.industry,
      services: c.services,
      verified: c.verified,
      description: c.description,
      founded: c.founded,
      employees: c.employees,
      certifications: c.certifications
    }));

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Create prompt for Gemini
    const aiPrompt = `You are an expert B2B service consultant. A user is looking for B2B services with the following requirements:

"${prompt}"

Here are all available companies:
${companyData.map((c, i) => `
${i + 1}. ${c.name}
   - ID: ${c.id}
   - Rating: ${c.rating}/5.0
   - Company Size: ${c.companySize}
   - Industry: ${c.industry}
   - Location: ${c.location}
   - Services: ${c.services?.join(', ')}
   - Verified: ${c.verified ? 'Yes' : 'No'}
   - Description: ${c.description}
   ${c.founded ? `- Founded: ${c.founded}` : ''}
   ${c.employees ? `- Employees: ${c.employees}` : ''}
   ${c.certifications?.length > 0 ? `- Certifications: ${c.certifications.join(', ')}` : ''}
`).join('\n')}

Based on the user's requirements, analyze each company and:
1. Calculate a match percentage (0-100%) for how well each company matches their needs
2. Consider: services offered, industry relevance, certifications, company size, location, ratings, and description alignment
3. Return ONLY the top 10-15 best matches (companies with match percentage >= 60%)
4. Order by match percentage (highest first)

Respond ONLY with valid JSON (no markdown, no code blocks) in this exact format:
{
  "matches": [
    {
      "companyId": "company_id_here",
      "matchPercentage": 95,
      "matchReason": "Brief 1-2 sentence explanation of why this is a good match"
    }
  ]
}`;

    // Call Gemini API
    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse AI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse AI response:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate and enrich matches with full company data
    const enrichedMatches = aiResponse.matches
      .map(match => {
        const company = allCompanies.find(c => c._id.toString() === match.companyId);
        if (!company) return null;

        return {
          ...company.toObject(),
          id: company._id,
          matchPercentage: match.matchPercentage,
          matchReason: match.matchReason
        };
      })
      .filter(match => match !== null);

    res.status(200).json({
      success: true,
      matches: enrichedMatches,
      totalMatches: enrichedMatches.length
    });

  } catch (error) {
    console.error('AI Matching Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to match companies. Please try again.',
      error: error.message
    });
  }
};

// Generate AI comparison analysis
exports.compareCompanies = async (req, res) => {
  try {
    const { companies, userPreferences } = req.body;

    if (!companies || companies.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 companies are required for comparison'
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(200).json({
        success: true,
        data: {
          summary: "Google Gemini API key not configured. Add GEMINI_API_KEY to your .env file to enable AI-powered comparisons.",
          recommendations: companies.map(c => ({
            companyName: c.companyName,
            recommendation: "Configure Google Gemini API to get AI-powered recommendations"
          })),
          winner: null
        }
      });
    }

    // Prepare company data for AI
    const companyData = companies.map(c => ({
      name: c.companyName,
      matchScore: c.matchScore,
      rating: c.rating,
      location: c.location,
      companySize: c.companySize,
      industry: c.industry,
      services: c.services,
      verified: c.verified,
      description: c.description,
      founded: c.founded,
      employees: c.employees
    }));

    // Initialize Gemini client here (lazy loading)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create prompt for Gemini
    const prompt = `You are an expert B2B SaaS consultant analyzing companies for a potential buyer.

User's Preferences:
${userPreferences ? `
- Service Type: ${userPreferences.serviceType || 'Any'}
- Company Size: ${userPreferences.companySize || 'Any'}
- Budget: ${userPreferences.budget || 'Flexible'}
- Priority: ${userPreferences.priority || 'Balanced'}
` : 'No specific preferences provided'}

Companies to Compare:
${companyData.map((c, i) => `
${i + 1}. ${c.name}
   - Match Score: ${c.matchScore}%
   - Rating: ${c.rating}/5.0
   - Company Size: ${c.companySize}
   - Industry: ${c.industry}
   - Location: ${c.location}
   - Services: ${c.services?.join(', ')}
   - Verified: ${c.verified ? 'Yes' : 'No'}
   - Description: ${c.description}
   ${c.founded ? `- Founded: ${c.founded}` : ''}
   ${c.employees ? `- Employees: ${c.employees}` : ''}
`).join('\n')}

Please provide:
1. A brief executive summary comparing these companies (2-3 sentences)
2. Specific recommendations for each company explaining their strengths and weaknesses (2-3 sentences each)
3. Which company would be the best choice for this user and why (1-2 sentences)

Format your response as JSON with this structure:
{
  "summary": "executive summary here",
  "recommendations": [
    {
      "companyName": "Company Name",
      "recommendation": "detailed recommendation"
    }
  ],
  "winner": {
    "companyName": "Best Company Name",
    "reason": "why this is the best choice"
  }
}`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse AI response (Gemini returns plain text, so we need to extract JSON)
    let aiResponse;
    try {
      // Try to parse as direct JSON
      aiResponse = JSON.parse(text);
    } catch (e) {
      // If that fails, try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    res.status(200).json({
      success: true,
      data: aiResponse
    });

  } catch (error) {
    console.error('AI Comparison Error:', error.message);

    // Provide fallback response on error
    res.status(200).json({
      success: true,
      data: {
        summary: "Unable to generate AI analysis at this time. Please try again later.",
        recommendations: req.body.companies.map(c => ({
          companyName: c.companyName,
          recommendation: `${c.companyName} has a ${c.matchScore}% match score with your requirements and a ${c.rating}/5.0 rating.`
        })),
        winner: null
      }
    });
  }
};
