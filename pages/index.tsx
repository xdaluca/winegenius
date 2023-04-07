import { useState } from 'react';
import axios from 'axios';

const WineRecommendationApp = () => {
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/wine-recommendation', { preferences });
      setRecommendations(response.data.recommendations.split('\n'));
    } catch (err) {
      setError('An error occurred while fetching recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Wine Recommendation App</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="preferences">Enter your preferences:</label>
        <input
          type="text"
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>

      {error && <p>{error}</p>}

      {recommendations.length > 0 && (
        <>
          <h2>Wine Recommendations</h2>
          <ul>
            {recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default WineRecommendationApp;
