const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

// Custom hash function to return Buffer
const sha256 = (data) => Buffer.from(SHA256(data).toString(), 'hex');

const hashAadhaar = (student) => {
  const aadhaar = student["AADHAR NUMBER"];
  if (!aadhaar) return null;
  return SHA256(aadhaar.toString()).toString();
};

const confirmData = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid or missing data array' });
    }

    const hashedAadhaars = data.map((student, index) => {
      const hash = hashAadhaar(student);
      if (!hash) console.warn(`Missing Aadhaar for student at index ${index}`);
      return hash;
    }).filter(Boolean);

    if (hashedAadhaars.length === 0) {
      return res.status(400).json({ error: 'No valid Aadhaar numbers found.' });
    }

    const leaves = hashedAadhaars.map((x) => Buffer.from(x, 'hex'));
    const merkleTree = new MerkleTree(leaves, sha256);
    const root = merkleTree.getRoot().toString('hex');

    const enrichedData = data.map((student) => {
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

    console.log("Merkle Root:", root);
    res.json({
      merkleRoot: root,
      students: enrichedData
    });

  } catch (error) {
    console.error('Error in confirmData:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  confirmData
};
