import { useState, useEffect } from 'react';
import type { Gene } from './types/gene.types';
import { loadGeneData } from './utils/csvParser';
import './App.css';

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadGeneData();
        setGenes(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Genes Data</h1>
      {genes.length > 0 &&
        genes.map((gene, i) => (
          <div key={`${gene.ensemble || 'unknown'}-${i}`}>
            <p>{gene.geneSymbol}</p>
            <p>{gene.name}</p>
            <p>{gene.biotype}</p>
          </div>
        ))}
    </>
  );
}

export default App;
