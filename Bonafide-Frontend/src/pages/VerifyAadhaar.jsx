import React, { useState } from 'react';
import axios from 'axios';

const VerifyAadhaar = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!aadhaar) {
      setError('Please enter your Aadhaar number.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/block/verify', { aadhaar });
      setResult(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || err.response.data.error);
      } else {
        setError('Server error. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Aadhaar</h2>
      
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter Aadhaar number"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Verify
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600 text-center">{error}</p>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Status: <span className={result.status === 'Verified' ? 'text-green-600' : 'text-red-600'}>{result.status}</span>
          </h3>
          {result.student && (
            <pre className="bg-white p-3 rounded text-sm overflow-auto">
              {JSON.stringify(result.student, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyAadhaar;
