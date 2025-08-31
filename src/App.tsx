import { useState, useEffect } from 'react';
import { Container, Grid } from '@mantine/core';
import type { Gene } from './types/gene.types';
import { loadGeneData } from './utils/csvParser';

import { GeneTable } from './components/GeneTable';
import { GeneDetailView } from './components/GeneDetailView';
import './App.css';
import { Layout } from './components/Layouts';

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [selectedGene, setSelectedGene] = useState<Gene | null>(null);
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
      <Layout>
        <Container fluid>
          <Grid>
            <Grid.Col span={12} lg={7}>
              <GeneTable genes={genes} onRowSelect={setSelectedGene} />
            </Grid.Col>
            <Grid.Col span={12} lg={5}>
              <GeneDetailView gene={selectedGene} allGenes={genes} />
            </Grid.Col>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}

export default App;
