const SHA256 = require('crypto-js/sha256');
const { MerkleTree } = require('merkletreejs');
const {findStudentByHashedAadhaar}=require("../services/fetchMerkledata");

// Reuse the same hash function
const sha256 = (data) => Buffer.from(SHA256(data).toString(), 'hex');

const STORED_MERKLE_ROOT = '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e';

const verifyAadhaar = async (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar) {
    return res.status(400).json({ error: 'Aadhaar number is required' });
  }

  let aadhaarHash;
  try {
    aadhaarHash = SHA256(String(aadhaar)).toString();
  } catch (err) {
    console.error("Error hashing Aadhaar:", err.message);
    return res.status(500).json({ error: 'Hashing error' });
  }

  let student;
  try {
    student = await findStudentByHashedAadhaar(aadhaarHash);
    if (!student) {
      return res.status(404).json({ status: 'Not Verified', message: 'Student not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  let isVerified;
  try {
    const proof = student.merkleProof.map(p => ({
      position: p.position,
      data: Buffer.from(p.data, 'hex'),
    }));

    const rootBuffer = Buffer.from(STORED_MERKLE_ROOT, 'hex');
    isVerified = MerkleTree.verify(proof, Buffer.from(aadhaarHash, 'hex'), rootBuffer, sha256);
  } catch (err) {
    console.error("Verification error:", err.message);
    return res.status(500).json({ error: 'Verification failed' });
  }

  return res.json({
    status: isVerified ? 'Verified' : 'Not Verified',
    student: isVerified ? student : null
  });
};

module.exports = {
  verifyAadhaar
};
