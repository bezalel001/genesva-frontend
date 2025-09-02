import axios from 'axios';
import type { Gene } from '../types/gene.types';

// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_V1_PREFIX = '/api/v1';

// API client instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_V1_PREFIX}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response types
interface ApiGene {
  id: number;
  ensembl: string;
  gene_symbol: string | null;
  name: string | null;
  biotype: string;
  chromosome: string;
  seq_region_start: number;
  seq_region_end: number;
}

interface GeneStats {
  total_genes: number;
  chromosomes: string[];
  biotypes: string[];
}

// Transform API response to match frontend Gene type
const transformApiGene = (apiGene: ApiGene): Gene => ({
  ensembl: apiGene.ensembl,
  geneSymbol: apiGene.gene_symbol,
  name: apiGene.name,
  biotype: apiGene.biotype,
  chromosome: apiGene.chromosome,
  seqRegionStart: apiGene.seq_region_start,
  seqRegionEnd: apiGene.seq_region_end,
});

// API client methods
export const geneApi = {
  // Get all genes with pagination and filtering
  async getGenes(params?: {
    skip?: number;
    limit?: number;
    chromosome?: string;
    biotype?: string;
  }): Promise<Gene[]> {
    try {
      const response = await apiClient.get<ApiGene[]>('/genes/', { params });
      return response.data.map(transformApiGene);
    } catch (error) {
      console.error('Error fetching genes:', error);
      throw new Error('Failed to fetch genes from API');
    }
  },

  // Get a specific gene by ID
  async getGeneById(id: number): Promise<Gene> {
    try {
      const response = await apiClient.get<ApiGene>(`/genes/${id}`);
      return transformApiGene(response.data);
    } catch (error) {
      console.error(`Error fetching gene ${id}:`, error);
      throw new Error(`Failed to fetch gene with ID ${id}`);
    }
  },

  // Search genes by symbol
  async searchBySymbol(symbol: string, exact = false): Promise<Gene[]> {
    try {
      const response = await apiClient.get<ApiGene[]>(
        `/genes/search/symbol/${symbol}`,
        {
          params: { exact },
        }
      );
      return response.data.map(transformApiGene);
    } catch (error) {
      console.error(`Error searching genes by symbol ${symbol}:`, error);
      throw new Error(`Failed to search genes by symbol: ${symbol}`);
    }
  },

  // Get gene by Ensembl ID
  async getByEnsemblId(ensemblId: string): Promise<Gene> {
    try {
      const response = await apiClient.get<ApiGene>(
        `/genes/search/ensembl/${ensemblId}`
      );
      return transformApiGene(response.data);
    } catch (error) {
      console.error(`Error fetching gene by Ensembl ID ${ensemblId}:`, error);
      throw new Error(`Failed to fetch gene by Ensembl ID: ${ensemblId}`);
    }
  },

  // Search genes by name
  async searchByName(name: string, exact = false): Promise<Gene[]> {
    try {
      const response = await apiClient.get<ApiGene[]>(
        `/genes/search/name/${name}`,
        {
          params: { exact },
        }
      );
      return response.data.map(transformApiGene);
    } catch (error) {
      console.error(`Error searching genes by name ${name}:`, error);
      throw new Error(`Failed to search genes by name: ${name}`);
    }
  },

  // Get database statistics
  async getStats(): Promise<GeneStats> {
    try {
      const response = await apiClient.get<GeneStats>('/genes/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching gene statistics:', error);
      throw new Error('Failed to fetch gene statistics');
    }
  },
};

// Main function to load all gene data (equivalent to loadGeneData from csvParser)
export const loadGeneData = async (): Promise<Gene[]> => {
  try {
    // Load genes in batches to handle large datasets
    const limit = 1000;
    let allGenes: Gene[] = [];
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const genes = await geneApi.getGenes({ skip, limit });
      allGenes = [...allGenes, ...genes];

      // If we got fewer genes than the limit, we've reached the end
      hasMore = genes.length === limit;
      skip += limit;
    }

    return allGenes;
  } catch (error) {
    console.error('Error loading gene data:', error);
    return [];
  }
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default geneApi;
