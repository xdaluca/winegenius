import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';
import { Recommendation } from '../types/types';

const WineRecommendationApp = () => {
  const [preferences, setPreferences] = useState('');
  const [dish, setDish] = useState('');
  const [budget, setBudget] = useState('');
  const [region, setRegion] = useState('');
  const [grapeVariety, setGrapeVariety] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/wine-recommendation', { preferences, dish, budget, region, grapeVariety });
      const parsedRecommendations = response.data.recommendations;
      setRecommendations(parsedRecommendations);
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
          className={styles.input}
        />
        <label htmlFor="budget" className={styles.label}>Budget:</label>
        <input
          type="text"
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
          className={styles.input}
        />
        <label htmlFor="region" className={styles.label}>Region:</label>
        <input
          type="text"
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
          className={styles.input}
        />
        <label htmlFor="grapeVariety" className={styles.label}>Grape variety:</label>
        <input
          type="text"
          id="grapeVariety"
          value={grapeVariety}
          onChange={(e) => setGrapeVariety(e.target.value)}
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
                <li key={index} className={styles.recommendationItem}>
                  <div>
                    <strong>Wine Name:</strong> {recommendation.wineName}
                  </div>
                  <div>
                    <strong>Region:</strong> {recommendation.region}
                  </div>
                  <div>
                    <strong>Price Range:</strong> {recommendation.priceRange}
                  </div>
                  <div>
                    <strong>Grape Variety:</strong> {recommendation.grapeVariety}
                  </div>
                  <div>
                    <strong>Description:</strong> {recommendation.description}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default WineRecommendationApp;
