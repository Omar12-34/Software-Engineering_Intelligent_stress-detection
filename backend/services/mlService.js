const axios = require('axios');

const getPrediction = async (data) => {
  const res = await axios.post(process.env.ML_SERVICE_URL, data);
  return res.data;
};

module.exports = getPrediction;