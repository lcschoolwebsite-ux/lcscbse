const axios = require('axios');
const API_BASE = 'https://lorettocentralschool.edu.in/backend';

async function checkPrivacyData() {
  try {
    const res = await axios.get(`${API_BASE}/api/school-info/privacy-policy`);
    console.log('Privacy Data:', JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error('Error fetching privacy data:', e.message);
  }
}

checkPrivacyData();
