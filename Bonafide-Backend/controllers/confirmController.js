const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');
const uploadMerkleData = require('../services/uploadMerkleData');

const sha256 = (data) => Buffer.from(SHA256(data).toString(), 'hex');

const hashAadhaar = (student) => {
  const aadhaar = student["AADHAR NUMBER"];
  if (!aadhaar) return null;
  return SHA256(aadhaar.toString()).toString();
};

const confirmData = async (req, res) => {
  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid or missing data array' });
  }

  let hashedAadhaars;
  try {
    hashedAadhaars = data.map((student, index) => {
      const hash = hashAadhaar(student);
      if (!hash) console.warn(`Missing Aadhaar for student at index ${index}`);
      return hash;
    }).filter(Boolean);

    if (hashedAadhaars.length === 0) {
      return res.status(400).json({ error: 'No valid Aadhaar numbers found.' });
    }
  } catch (err) {
    console.error("Error hashing Aadhaar numbers:", err.message);
    return res.status(500).json({ error: 'Error processing Aadhaar numbers' });
  }

  let merkleTree;
  try {
    const leaves = hashedAadhaars.map((x) => Buffer.from(x, 'hex'));
    merkleTree = new MerkleTree(leaves, sha256);
  } catch (err) {
    console.error("Error creating Merkle Tree:", err.message);
    return res.status(500).json({ error: 'Failed to create Merkle tree' });
  }

  let enrichedData;
  try {
    enrichedData = data.map((student) => {
      const hash = hashAadhaar(student);
      if (!hash) return { ...student, error: "Invalid Aadhaar" };

      const hashedBuffer = Buffer.from(hash, 'hex');
      const proof = merkleTree.getProof(hashedBuffer).map(p => ({
        position: p.position,
        data: p.data.toString('hex')
      }));

      return {
        ...student,
        hashedAadhaar: hash,
        merkleProof: proof
      };
    });
  } catch (err) {
    console.error("Error generating proofs:", err.message);
    return res.status(500).json({ error: 'Error generating Merkle proofs' });
  }

  try {
    await uploadMerkleData(enrichedData);
  } catch (err) {
    console.error("Error uploading data to DB:", err.message);
    return res.status(500).json({ error: 'Failed to upload data to database' });
  }

  const root = merkleTree.getRoot().toString('hex');
  console.log("Merkle Root:", root);

  return res.status(200).json({
    message: "Student data and Merkle proofs stored successfully",
    merkleRoot: root
  });
};

module.exports = {
  confirmData
};
