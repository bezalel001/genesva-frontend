import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Paper,
  SimpleGrid,
} from '@mantine/core';
import { IconDna2 } from '@tabler/icons-react';
import type { Gene } from '../types/gene.types';
import { BiotypeChart } from './charts/BiotypeChart';
import { ChromosomeChart } from './charts/ChromosomeChart';
import './GeneDetailView.css';

interface GeneDetailViewProps {
  gene: Gene | null;
  allGenes: Gene[];
}

export function GeneDetailView({ gene, allGenes }: GeneDetailViewProps) {
  // Show empty state if no gene selected
  if (!gene) {
    return (
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        className="empty-state"
      >
        <Stack align="center" justify="center" style={{ minHeight: '400px' }}>
          <IconDna2 size={48} stroke={1.5} color="gray" />
          <Title order={3} c="dimmed">
            No Gene Selected
          </Title>
          <Text c="dimmed" size="sm">
            Click on any row in the table to view details
          </Text>
        </Stack>
      </Card>
    );
  }

  // Calculate basic gene information
  const geneLength = gene.seqRegionEnd - gene.seqRegionStart;
  const geneLengthKb = (geneLength / 1000).toFixed(1);
  const position = `${gene.chromosome}:${gene.seqRegionStart.toLocaleString()}-${gene.seqRegionEnd.toLocaleString()}`;

  return (
    <Stack spacing="md">
      {/* Gene Information Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack spacing="md">
          {/* Header with gene name and biotype */}
          <Group align="space-between">
            <div>
              <Title order={3}>{gene.geneSymbol || gene.ensembl}</Title>
              <Text c="dimmed" size="sm">
                {gene.ensembl}
              </Text>
            </div>
            <Badge size="lg" color="blue" variant="light">
              {gene.biotype}
            </Badge>
          </Group>

          {/* Full gene name if available */}
          {gene.name && (
            <Paper p="sm" withBorder radius="sm" className="gene-name-panel">
              <Text size="xs" c="dimmed" fw={600}>
                Full Name
              </Text>
              <Text size="sm">{gene.name.split('[Source:')[0].trim()}</Text>
            </Paper>
          )}

          {/* Gene statistics */}
          <SimpleGrid cols={3} spacing="md">
            <Paper p="md" withBorder radius="md" className="stat-card">
              <Text size="xs" c="dimmed">
                Chromosome
              </Text>
              <Text size="xl" fw={600}>
                Chr {gene.chromosome}
              </Text>
            </Paper>

            <Paper p="md" withBorder radius="md" className="stat-card">
              <Text size="xs" c="dimmed">
                Length
              </Text>
              <Text size="xl" fw={600}>
                {geneLengthKb} kb
              </Text>
              <Text size="xs" c="dimmed">
                {geneLength.toLocaleString()} bp
              </Text>
            </Paper>

            <Paper p="md" withBorder radius="md" className="stat-card">
              <Text size="xs" c="dimmed">
                Position
              </Text>
              <Text size="xs" style={{ fontFamily: 'monospace' }}>
                {position}
              </Text>
            </Paper>
          </SimpleGrid>
        </Stack>
      </Card>

      {/* 1x2 Grid of Visualizations */}
      <SimpleGrid cols={2} spacing="md">
        <BiotypeChart gene={gene} allGenes={allGenes} />
        <ChromosomeChart gene={gene} allGenes={allGenes} />
      </SimpleGrid>
    </Stack>
  );
}

export default GeneDetailView;
