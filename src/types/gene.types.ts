export interface Gene {
  ensembl: string;
  geneSymbol: string | null;
  name: string | null;
  biotype: string;
  chromosome: string | number;
  seqRegionStart: number;
  seqRegionEnd: number;
}

export interface DynamicColumn {
  id: string;
  header: string;
  data: Record<string, number>;
}
