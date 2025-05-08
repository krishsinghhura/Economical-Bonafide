const SHA256 = require('crypto-js/sha256');
const { MerkleTree } = require('merkletreejs');
const { findStudentByHashedAadhaar } = require("../services/fetchMerkledata");

const sha256 = (data) => Buffer.from(SHA256(data).toString(), 'hex');

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

  let proof;
  try {
    proof = student.merkleProof.map(p => ({
      position: p.position,
      data: Buffer.from(p.data, 'hex'),
    }));
  } catch (err) {
    console.error("Error parsing Merkle proof:", err.message);
    return res.status(500).json({ error: 'Merkle proof error' });
  }

  
  let merkleRoot;
  try {
    const leaves = student.merkleProof.map(p => sha256(p.data.toString()));
    const tree = new MerkleTree(leaves, sha256);
    merkleRoot = tree.getRoot().toString('hex'); 
  } catch (err) {
    console.error("Error generating Merkle tree:", err.message);
    return res.status(500).json({ error: 'Merkle root generation failed' });
  }
  
  return res.json({
    status: 'Success',
    message: 'Student data and Merkle proofs processed successfully',
    merkleRoot: merkleRoot 
  });
};

module.exports = {
  verifyAadhaar
};
