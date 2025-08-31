import axios from 'axios';
import Papa from 'papaparse';
import type { Gene } from '../types/gene.types';

interface CSVRow {
  Ensembl?: string;
  'Gene symbol'?: string;
  Name?: string;
  Biotype?: string;
  Chromosome?: string | number;
  SeqRegionStart?: number;
  SeqRegionEnd?: number;
}

export const parseGeneCSV = (csvContent: string): Gene[] => {
  const parsedData = Papa.parse(csvContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimiter: ';',
    transformHeader: header => header.trim(),
  });

  return (parsedData.data as CSVRow[]).map(row => ({
    ensembl: row['Ensembl'] || '',
    geneSymbol: row['Gene symbol'] || null,
    name: row['Name'] || null,
    biotype: row['Biotype'] || '',
    chromosome: row['Chromosome'] || '',
    seqRegionStart: row['SeqRegionStart'] || 0,
    seqRegionEnd: row['SeqRegionEnd'] || 0,
  }));
};

export const loadGeneData = async (): Promise<Gene[]> => {
  try {
    const response = await axios.get('/src/data/genes_human.csv', {
      responseType: 'text', // ensures CSV comes back as raw text
    });
    return parseGeneCSV(response.data);
  } catch (error) {
    console.error('Error loading gene data:', error);
    return [];
  }
};
