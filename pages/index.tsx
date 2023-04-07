import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

const WineRecommendationApp = () => {
  const [preferences, setPreferences] = useState('');
  const [dish, setDish] = useState(''); // New state for dish input
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/wine-recommendation', { preferences, dish }); // Include dish in the request
      setRecommendations(response.data.recommendations.split('\n'));
    } catch (err) {
      setError('An error occurred while fetching recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <span className={styles.grapeIcon}>🍇</span>
        <h1 className={styles.title}>Wine Recommendation App</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="preferences" className={styles.label}>Enter your preferences:</label>
        <input
          type="text"
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          required
          className={styles.input}
        />
        <label htmlFor="dish" className={styles.label}>Enter a dish to pair with:</label>
        <input
          type="text"
          id="dish"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>

        {error && <p className={styles.error}>{error}</p>}

        {recommendations.length > 0 && (
          <>
            <h2 className={styles.recommendationsTitle}>Wine Recommendations</h2>
            <ul className={styles.recommendationsList}>
              {recommendations.map((recommendation, index) => (
                <li key={index} className={styles.recommendationItem}>{recommendation}</li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default WineRecommendationApp;
