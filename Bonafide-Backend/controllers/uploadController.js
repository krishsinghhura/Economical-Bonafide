// uploadController.js
const redis = require('../redis/redisClient');

const uploadData = async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Data must be an array of rows.' });
    }

    // Save to Redis with key 'excel_data'
    await redis.set('excel_data', JSON.stringify(data), 'EX', 3600); // Expires in 1 hour

    return res.status(200).json({ message: '✅ Data cached in Redis successfully!' });
  } catch (err) {
    console.error('Redis Error:', err);
    return res.status(500).json({ error: '❌ Failed to cache data in Redis.' });
  }
};

const getDataFromRedis = async (req, res) => {
  try {
    const data = await redis.get('excel_data');
    res.json({ data: JSON.parse(data || '[]') });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Redis' });
  }
};

const saveChanges=async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "No data provided" });
  }

  // Save updated data to Redis (JSON.stringify for serialization)
  client.set("cachedData", JSON.stringify(data), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save data" });
    }
    res.json({ message: "Changes saved to Redis!" });
  });
};

module.exports = {
  uploadData,
  getDataFromRedis,
  saveChanges
};
