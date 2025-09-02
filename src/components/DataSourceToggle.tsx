import React, { useState, useEffect } from 'react';
import { type DataSourceType, DATA_SOURCES } from '../config/dataSource';
import { getDataSourceStatus, switchDataSource } from '../utils/dataLoader';
import type { Gene } from '../types/gene.types';
import './DataSourceToggle.css';

interface DataSourceToggleProps {
  onDataSourceChange?: (genes: Gene[]) => void;
  className?: string;
}

interface DataSourceStatus {
  current: DataSourceType;
  available: Record<DataSourceType, boolean>;
}

export const DataSourceToggle: React.FC<DataSourceToggleProps> = React.memo(({
  onDataSourceChange,
  className = '',
}) => {
  const [status, setStatus] = useState<DataSourceStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const currentStatus = await getDataSourceStatus();
        setStatus(currentStatus);
      } catch (err) {
        console.error('Failed to load data source status:', err);
        setError('Failed to load data source status');
      }
    };

    loadStatus();
  }, []);

  const handleSourceChange = async (newSource: DataSourceType) => {
    if (!status || loading) return;

    setLoading(true);
    setError(null);

    try {
      const genes = await switchDataSource(newSource);

      // Update status
      setStatus({
        ...status,
        current: newSource,
      });

      // Notify parent component
      onDataSourceChange?.(genes);
    } catch (err) {
      console.error('Failed to switch data source:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to switch data source'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return (
      <div className={`data-source-toggle ${className}`}>
        <span>Loading data sources...</span>
      </div>
    );
  }

  return (
    <div className={`data-source-toggle ${className}`}>
      <div className="data-source-header">
        <label className="data-source-label">Data Source:</label>
        {loading && <span className="loading-indicator">Switching...</span>}
      </div>

      <div className="data-source-options">
        {Object.entries(DATA_SOURCES).map(([sourceKey, sourceConfig]) => {
          const source = sourceKey as DataSourceType;
          const isAvailable = status.available[source];
          const isCurrent = status.current === source;

          return (
            <button
              key={source}
              onClick={() => handleSourceChange(source)}
              disabled={!isAvailable || loading || isCurrent}
              className={`
                data-source-option
                ${isCurrent ? 'active' : ''}
                ${!isAvailable ? 'unavailable' : ''}
                ${loading ? 'loading' : ''}
              `}
              title={
                !isAvailable
                  ? `${sourceConfig.name} is not available`
                  : sourceConfig.description
              }
            >
              <span className="source-name">{sourceConfig.name}</span>
              <span className="source-status">
                {isCurrent && '✓ Active'}
                {!isCurrent && isAvailable && 'Available'}
                {!isAvailable && '✗ Unavailable'}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="data-source-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}

      <div className="data-source-info">
        Current: <strong>{DATA_SOURCES[status.current].name}</strong>
      </div>
    </div>
  );
});

export default DataSourceToggle;
