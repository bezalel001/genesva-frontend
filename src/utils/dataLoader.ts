import type { Gene } from '../types/gene.types';
import { dataSourceManager, type DataSourceType } from '../config/dataSource';
import { loadGeneData as loadFromCSV } from './csvParser';
import { loadGeneData as loadFromAPI, checkApiHealth } from './apiClient';

// Unified data loading interface
export interface DataLoader {
  loadGenes(): Promise<Gene[]>;
  getSourceName(): string;
  isAvailable(): Promise<boolean>;
}

// CSV data loader
const csvLoader: DataLoader = {
  async loadGenes(): Promise<Gene[]> {
    return await loadFromCSV();
  },

  getSourceName(): string {
    return 'CSV File';
  },

  async isAvailable(): Promise<boolean> {
    // CSV is always available (local file)
    return true;
  },
};

// API data loader
const apiLoader: DataLoader = {
  async loadGenes(): Promise<Gene[]> {
    return await loadFromAPI();
  },

  getSourceName(): string {
    return 'Backend API';
  },

  async isAvailable(): Promise<boolean> {
    return await checkApiHealth();
  },
};

// Data loader registry
const DATA_LOADERS: Record<DataSourceType, DataLoader> = {
  csv: csvLoader,
  api: apiLoader,
};

// Main data loading function
export const loadGeneData = async (): Promise<Gene[]> => {
  const currentSource = dataSourceManager.getCurrentSource();
  const loader = DATA_LOADERS[currentSource];

  if (!loader) {
    throw new Error(`No loader available for data source: ${currentSource}`);
  }

  // Check if the data source is available
  const isAvailable = await loader.isAvailable();
  if (!isAvailable) {
    console.warn(
      `Data source '${currentSource}' is not available, falling back to CSV`
    );

    // Fallback to CSV if current source is not available
    if (currentSource !== 'csv') {
      dataSourceManager.setDataSource('csv');
      return await csvLoader.loadGenes();
    }

    throw new Error('No data sources are available');
  }

  console.log(`Loading data from: ${loader.getSourceName()}`);
  return await loader.loadGenes();
};

// Get current data loader
export const getCurrentLoader = (): DataLoader => {
  const currentSource = dataSourceManager.getCurrentSource();
  return DATA_LOADERS[currentSource];
};

// Switch data source and reload
export const switchDataSource = async (
  newSource: DataSourceType
): Promise<Gene[]> => {
  const loader = DATA_LOADERS[newSource];
  if (!loader) {
    throw new Error(`Invalid data source: ${newSource}`);
  }

  // Check availability
  const isAvailable = await loader.isAvailable();
  if (!isAvailable) {
    throw new Error(`Data source '${newSource}' is not available`);
  }

  // Switch source
  dataSourceManager.setDataSource(newSource);

  // Load data from new source
  return await loader.loadGenes();
};

// Get data source status
export const getDataSourceStatus = async (): Promise<{
  current: DataSourceType;
  available: Record<DataSourceType, boolean>;
}> => {
  const current = dataSourceManager.getCurrentSource();

  const available: Record<DataSourceType, boolean> = {
    csv: await csvLoader.isAvailable(),
    api: await apiLoader.isAvailable(),
  };

  return { current, available };
};

export default {
  loadGeneData,
  getCurrentLoader,
  switchDataSource,
  getDataSourceStatus,
};
