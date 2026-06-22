const axios = require('axios');
const Applicant = require('../models/Applicant');
const Decision = require('../models/Decision');

exports.evaluateRisk = async (req, res) => {
  try {
    const { fullName, creditScore, annualIncome, loanAmount, debtToIncomeRatio, employmentDurationYears } = req.body;
    const underwriterId = req.user.id; // Extracted safely from the JWT token middleware

    // 1. Save the historical financial profile into the 'applicants' table
    const applicant = await Applicant.create({
      fullName, creditScore, annualIncome, loanAmount, debtToIncomeRatio, employmentDurationYears
    });

    // 2. Forward parameters to the Python FastAPI microservice on port 8000
    const pythonPayload = {
      credit_score: parseInt(creditScore),
      annual_income: parseFloat(annualIncome),
      loan_amount: parseFloat(loanAmount),
      debt_to_income_ratio: parseFloat(debtToIncomeRatio),
      employment_duration_years: parseInt(employmentDurationYears)
    };

    const pythonResponse = await axios.post(`${process.env.PYTHON_MODEL_URL}/predict`, pythonPayload);
    const { approved, confidence_score } = pythonResponse.data;

    // 3. Log the result inside the 'decisions' table for structural audit trailing
    const decisionLog = await Decision.create({
      applicantId: applicant.id,
      underwriterId,
      approved,
      confidenceScore: confidence_score
    });

    // 4. Return unified response back to frontend dashboard
    res.status(200).json({
      message: "Underwriting decision generated.",
      applicantId: applicant.id,
      decisionId: decisionLog.id,
      approved, // 1 or 0
      confidenceScore: confidence_score
    });

  } catch (error) {
    console.error("Pipeline breakdown:", error.message);
    res.status(500).json({ error: "Risk evaluation pipeline failed to resolve downstream services." });
  }
};

// Fetch historical records to supply the visual analytics dashboard table
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await Decision.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};