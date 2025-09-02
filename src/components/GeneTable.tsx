import React, { useMemo, useState, useCallback } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
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

export const GeneTable = React.memo(function GeneTable({ genes, onRowSelect }: GeneTableProps) {
  // Use proper row selection state
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [selectedGeneId, setSelectedGeneId] = useState<string | null>(null);

  const columns = useMemo<MRT_ColumnDef<Gene>[]>(
    () => [
      {
        accessorKey: 'ensembl',
        header: 'Ensembl',
        size: 150,
      },
      {
        accessorKey: 'geneSymbol',
        header: 'Gene Symbol',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | null;
          return <Text>{value || '—'}</Text>;
        },
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 300,
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | null;
          if (!value) return '—';

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

    // Enable single row selection
    enableRowSelection: true,
    enableMultiRowSelection: false,

    // Use the row's ensembl ID as the unique identifier
    getRowId: row => row.ensembl,

    // Manage row selection state
    state: {
      rowSelection,
    },

    // Handle selection changes
    onRowSelectionChange: useCallback(
      (
        updater:
          | MRT_RowSelectionState
          | ((old: MRT_RowSelectionState) => MRT_RowSelectionState)
      ) => {
        const newSelection =
          typeof updater === 'function' ? updater(rowSelection) : updater;

        setRowSelection(newSelection);

        // Get the selected gene
        const selectedKeys = Object.keys(newSelection);
        if (selectedKeys.length > 0) {
          const selectedEnsembl = selectedKeys[0];
          const gene = genes.find(g => g.ensembl === selectedEnsembl);
          if (gene) {
            setSelectedGeneId(selectedEnsembl);
            onRowSelect(gene);
          }
        } else {
          setSelectedGeneId(null);
          onRowSelect(null);
        }
      },
      [rowSelection, genes, onRowSelect]
    ),

    // Row click handler and styling
    mantineTableBodyRowProps: useCallback(
      ({ row }: { row: { id: string; original: Gene } }) => ({
        onClick: () => {
          if (rowSelection[row.id]) {
            // Deselect if already selected
            setRowSelection({});
            setSelectedGeneId(null);
            onRowSelect(null);
          } else {
            // Select this row
            const newSelection: MRT_RowSelectionState = { [row.id]: true };
            setRowSelection(newSelection);
            setSelectedGeneId(row.original.ensembl);
            onRowSelect(row.original);
          }
        },
        style: {
          cursor: 'pointer',
          backgroundColor:
            selectedGeneId === row.original.ensembl
              ? 'var(--mantine-color-blue-0)'
              : undefined,
          transition: 'background-color 0.2s ease',
        },
        sx: (theme: { colors: { blue: string[]; gray: string[] } }) => ({
          '&:hover': {
            backgroundColor:
              selectedGeneId === row.original.ensembl
                ? theme.colors.blue[1]
                : theme.colors.gray[0],
          },
        }),
      }),
      [rowSelection, selectedGeneId, onRowSelect]
    ),

    // Table configuration
    initialState: {
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
      sorting: [{ id: 'geneSymbol', desc: false }],
    },

    // Features
    enableGlobalFilter: true,
    enableStickyHeader: true,
    enablePagination: true,

    // Container props
    mantineTableContainerProps: {
      sx: {
        maxHeight: '600px',
        '& thead tr': {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },

    // Selection checkbox styling
    mantineSelectCheckboxProps: {
      color: 'blue',
      size: 'sm',
    },
  });

  return <MantineReactTable table={table} />;
});
