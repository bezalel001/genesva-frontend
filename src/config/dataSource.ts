// Data source configuration
export type DataSourceType = 'csv' | 'api';

export interface DataSourceConfig {
  type: DataSourceType;
  name: string;
  description: string;
  enabled: boolean;
}

// Available data sources
export const DATA_SOURCES: Record<DataSourceType, DataSourceConfig> = {
  csv: {
    type: 'csv',
    name: 'CSV File',
    description: 'Load data from local CSV file',
    enabled: true,
  },
  api: {
    type: 'api',
    name: 'Backend API',
    description: 'Load data from PostgreSQL via FastAPI backend',
    enabled: true,
  },
};

// Default data source - can be changed via environment variable
const DEFAULT_DATA_SOURCE: DataSourceType =
  (import.meta.env.VITE_DATA_SOURCE as DataSourceType) || 'csv';

// Current data source state
let currentDataSource: DataSourceType = DEFAULT_DATA_SOURCE;

// Data source management
export const dataSourceManager = {
  // Get current data source
  getCurrentSource(): DataSourceType {
    return currentDataSource;
  },

  // Set data source
  setDataSource(source: DataSourceType): void {
    if (!DATA_SOURCES[source]?.enabled) {
      throw new Error(`Data source '${source}' is not available`);
    }
    currentDataSource = source;
    console.log(`Data source switched to: ${DATA_SOURCES[source].name}`);
  },

  // Get available data sources
  getAvailableSources(): DataSourceConfig[] {
    return Object.values(DATA_SOURCES).filter(source => source.enabled);
  },

  // Get data source info
  getSourceInfo(source: DataSourceType): DataSourceConfig {
    return DATA_SOURCES[source];
  },

  // Check if source is available
  isSourceAvailable(source: DataSourceType): boolean {
    return DATA_SOURCES[source]?.enabled || false;
  },
};

export default dataSourceManager;
