const MerkleRecord = require('../model/MerkleRecord');

const uploadMerkleData = async (students) => {
  try {
    const toInsert = students
      .filter((s) => s.hashedAadhaar) // skip invalids
      .map((s) => ({
        AADHAR_NUMBER: s["AADHAR NUMBER"],
        studentData: s,
        hashedAadhaar: s.hashedAadhaar,
        merkleProof: s.merkleProof
      }));

    await MerkleRecord.insertMany(toInsert);
    console.log('Merkle data inserted into MongoDB.');
  } catch (error) {
    console.error('Error inserting into MongoDB:', error.message);
    throw error;
  }
};

module.exports = uploadMerkleData;
