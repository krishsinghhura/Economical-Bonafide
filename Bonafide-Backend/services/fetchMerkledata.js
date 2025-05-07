const Student = require('../model/MerkleRecord');

const findStudentByHashedAadhaar = async (hashedAadhaar) => {
    try {
      const student = await Student.findOne({ hashedAadhaar });
      return student;
    } catch (err) {
      console.error("Database query error:", err.message);
      throw new Error('Database error');
    }
  };

  module.exports={
    findStudentByHashedAadhaar
  }