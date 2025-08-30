import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { Badge, Group, Text, ColorSwatch } from '@mantine/core';

import type { Gene } from '../types/gene.types';

interface GeneTableProps {
  genes: Gene[];
  onRowSelect: (row: Gene | null) => void;
}

const CHROMOSOME_COLORS: Record<string, string> = {
  '1': '#FF6B6B',
  '2': '#4ECDC4',
  '3': '#45B7D1',
  '4': '#96CEB4',
  '5': '#FFEAA7',
  '6': '#DDA0DD',
  '7': '#FFA07A',
  '8': '#98D8C8',
  '9': '#6C5CE7',
  '10': '#A29BFE',
  '11': '#FD79A8',
  '12': '#FDCB6E',
  '13': '#6C5CE7',
  '14': '#00B894',
  '15': '#00CEC9',
  '16': '#0984E3',
  '17': '#B983FF',
  '18': '#F8B500',
  '19': '#FF6348',
  '20': '#30336B',
  '21': '#95AFC0',
  '22': '#535C68',
  X: '#FF9FF3',
  Y: '#54A0FF',
  MT: '#48DBFB',
};

const getBiotypeColor = (biotype: string): string => {
  const biotypeColors: Record<string, string> = {
    'Protein Coding': 'blue',
    'Linc R N A': 'yellow',
    'Processed Pseudogene': 'green',
    'Unprocessed Pseudogene': 'orange',
    'Processed Transcript': 'purple',
  };
  return biotypeColors[biotype] || 'gray';
};

export function GeneTable({ genes, onRowSelect }: GeneTableProps) {
  const [selectedGene, setSelectedGene] = useState<Gene | null>(null);

  const columns = useMemo<MRT_ColumnDef<Gene>[]>(
    () => [
      {
        accessorKey: 'ensemble',
        header: 'Ensembl',
        size: 150,
      },
      {
        accessorKey: 'geneSymbol',
        header: 'Gene Symbol',
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 300,
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | null;
          if (!value) return '-';

          // Clean up the name by removing source information
          const cleanName = value.split('[Source:')[0].trim();
          return (
            <Text size="sm" lineClamp={2}>
              {cleanName}
            </Text>
          );
        },
      },
      {
        accessorKey: 'biotype',
        header: 'Biotype',
        size: 150,
        Cell: ({ cell }) => (
          <Badge
            color={getBiotypeColor(cell.getValue() as string)}
            variant="light"
          >
            {cell.getValue() as string}
          </Badge>
        ),
      },
      {
        accessorKey: 'chromosome',
        header: 'Chromosome',
        size: 150,
        Cell: ({ cell }) => {
          const chr = String(cell.getValue());
          return (
            <Group spacing="xs">
              <ColorSwatch color={CHROMOSOME_COLORS[chr] || '#666'} size={20} />
              <Text fw={500}>{chr}</Text>
            </Group>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable<Gene>({
    columns,
    data: genes,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: updater => {
      const newSelection =
        typeof updater === 'function' ? updater({}) : updater;

      const selectedId = Object.keys(newSelection)[0];
      if (selectedId !== undefined) {
        const gene = genes[parseInt(selectedId)];
        setSelectedGene(gene);
        onRowSelect(gene);
      } else {
        setSelectedGene(null);
        onRowSelect(null);
      }
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        const gene = row.original as Gene;
        setSelectedGene(gene);
        onRowSelect(gene);
      },
      sx: theme => ({
        cursor: 'pointer',
        backgroundColor:
          selectedGene && selectedGene.ensembl === row.original.ensembl
            ? theme.colors.blue[0]
            : undefined,
        '&:hover': {
          backgroundColor: theme.colors.gray[1],
        },
      }),
    }),
    initialState: {
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
      sorting: [{ id: 'geneSymbol', desc: false }],
    },
    enableGlobalFilter: true,
    enableStickyHeader: true,
    mantineTableContainerProps: { sx: { maxHeight: '500px' } },
  });

  return <MantineReactTable table={table} />;
}
