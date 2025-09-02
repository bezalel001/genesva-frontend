import { useState, useEffect, useCallback } from 'react';
import { Container, Grid, LoadingOverlay, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import type { Gene } from './types/gene.types';
import { loadGeneData, getCurrentLoader } from './utils/dataLoader';

import { GeneTable } from './components/GeneTable';
import { GeneDetailView } from './components/GeneDetailView';
import './App.css';
import { Layout } from './components/Layouts';
import { DataSourceToggle } from './components/DataSourceToggle';
import './components/DataSourceIndicator.css';

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [selectedGene, setSelectedGene] = useState<Gene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh data (can be called from child components)
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Handle data source change from toggle component
  const handleDataSourceChange = useCallback((newGenes: Gene[]) => {
    setGenes(newGenes);
    const loader = getCurrentLoader();
    setCurrentSource(loader.getSourceName());
    setSelectedGene(null); // Reset selection when switching sources
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadGeneData();
        const loader = getCurrentLoader();
        setGenes(data);
        setCurrentSource(loader.getSourceName());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refreshTrigger]);

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (error) {
    return (
      <Layout>
        <Container>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
          >
            {error}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <>
      <h1>Genes Data</h1>
      <Layout>
        <Container fluid>
          <div className="data-source-indicator">
            <span className="data-source-indicator-text">
              📊 <strong>Data Source:</strong> {currentSource || 'Loading...'}
              {genes.length > 0 &&
                ` • ${genes.length.toLocaleString()} genes loaded`}
            </span>
            <button onClick={refreshData} className="data-source-refresh-btn">
              🔄 Refresh
            </button>
          </div>
          <DataSourceToggle onDataSourceChange={handleDataSourceChange} />
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
