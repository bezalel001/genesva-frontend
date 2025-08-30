import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Paper,
  SimpleGrid,
  Divider,
  List,
  ThemeIcon,
} from '@mantine/core';
import {
  IconDna,
  IconMapPin,
  IconCategory,
  IconId,
  IconChartBar,
} from '@tabler/icons-react';
import type { Gene } from '../types/gene.types';

interface GeneDetailViewProps {
  gene: Gene | null;
}

export function GeneDetailView({ gene }: GeneDetailViewProps) {
  if (!gene) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack align="center" justify="center" h={400}>
          <IconDna size={48} color="gray" />
          <Text c="dimmed" ta="center">
            Select a gene from the table to view detailed information
          </Text>
        </Stack>
      </Card>
    );
  }

  // Calculate gene length
  const geneLength = gene.seqRegionEnd - gene.seqRegionStart;

  // Format large numbers with commas
  const formatNumber = (num: number) => num.toLocaleString();

  // Clean gene name (remove source annotations)
  const cleanName = gene.name ? gene.name.split('[Source:')[0].trim() : null;

  // Determine biotype category
  const getBiotypeCategory = (biotype: string) => {
    const categories: Record<string, string> = {
      'Protein Coding': 'Codes for proteins',
      'Linc R N A': 'Long intergenic non-coding RNA',
      'Processed Pseudogene': 'Pseudogene (processed)',
      'Unprocessed Pseudogene': 'Pseudogene (unprocessed)',
      'Processed Transcript': 'Processed transcript',
    };
    return categories[biotype] || biotype;
  };

  return (
    <Stack>
      {/* Main Gene Information Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack spacing="md">
          {/* Header with Gene Symbol/Name */}
          <div>
            <Group spacing="xs" mb={4}>
              <IconDna size={24} />
              <Title order={3}>{gene.geneSymbol || gene.ensembl}</Title>
            </Group>

            {cleanName && gene.geneSymbol && (
              <Text size="sm" c="dimmed" mt={4}>
                {cleanName}
              </Text>
            )}
          </div>

          <Divider />

          {/* Gene Identifiers */}
          <div>
            <Group spacing="xs" mb="xs">
              <ThemeIcon size="sm" variant="light" color="blue">
                <IconId size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>
                Identifiers
              </Text>
            </Group>
            <Paper p="xs" withBorder bg="gray.0">
              <SimpleGrid cols={2} spacing="xs">
                <div>
                  <Text size="xs" c="dimmed">
                    Ensembl ID
                  </Text>
                  <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>
                    {gene.ensembl}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Gene Symbol
                  </Text>
                  <Text size="sm" fw={500}>
                    {gene.geneSymbol || 'N/A'}
                  </Text>
                </div>
              </SimpleGrid>
            </Paper>
          </div>

          {/* Genomic Location */}
          <div>
            <Group spacing="xs" mb="xs">
              <ThemeIcon size="sm" variant="light" color="green">
                <IconMapPin size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>
                Genomic Location
              </Text>
            </Group>
            <Paper p="xs" withBorder bg="gray.0">
              <SimpleGrid cols={2} spacing="xs">
                <div>
                  <Text size="xs" c="dimmed">
                    Chromosome
                  </Text>
                  <Badge size="lg" variant="filled" color="green">
                    Chr {gene.chromosome}
                  </Badge>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Coordinates
                  </Text>
                  <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>
                    {formatNumber(gene.seqRegionStart)} -{' '}
                    {formatNumber(gene.seqRegionEnd)}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Length
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatNumber(geneLength)} bp
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    Size
                  </Text>
                  <Text size="sm" fw={500}>
                    {geneLength > 1000000
                      ? `${(geneLength / 1000000).toFixed(2)} Mb`
                      : geneLength > 1000
                        ? `${(geneLength / 1000).toFixed(1)} kb`
                        : `${geneLength} bp`}
                  </Text>
                </div>
              </SimpleGrid>
            </Paper>
          </div>

          {/* Gene Type Information */}
          <div>
            <Group spacing="xs" mb="xs">
              <ThemeIcon size="sm" variant="light" color="purple">
                <IconCategory size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>
                Gene Type
              </Text>
            </Group>
            <Paper p="xs" withBorder bg="gray.0">
              <Group spacing="md">
                <Badge size="lg" variant="light" color="purple">
                  {gene.biotype}
                </Badge>
                <Text size="sm" c="dimmed">
                  {getBiotypeCategory(gene.biotype)}
                </Text>
              </Group>
            </Paper>
          </div>
        </Stack>
      </Card>

      {/* Additional Information Card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack spacing="md">
          <Group spacing="xs">
            <ThemeIcon size="sm" variant="light" color="orange">
              <IconChartBar size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              Gene Statistics
            </Text>
          </Group>

          <SimpleGrid cols={3} spacing="md">
            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed" mb={4}>
                Region Span
              </Text>
              <Text size="lg" fw={600}>
                {(geneLength / 1000).toFixed(1)}k
              </Text>
              <Text size="xs" c="dimmed">
                base pairs
              </Text>
            </Paper>

            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed" mb={4}>
                Chromosome
              </Text>
              <Text size="lg" fw={600}>
                {gene.chromosome}
              </Text>
              <Text size="xs" c="dimmed">
                {gene.chromosome === 'X' || gene.chromosome === 'Y'
                  ? 'Sex chromosome'
                  : 'Autosome'}
              </Text>
            </Paper>

            <Paper p="sm" withBorder>
              <Text size="xs" c="dimmed" mb={4}>
                Type
              </Text>
              <Text size="lg" fw={600}>
                {gene.biotype.includes('Protein') ? 'Coding' : 'Non-coding'}
              </Text>
              <Text size="xs" c="dimmed">
                gene type
              </Text>
            </Paper>
          </SimpleGrid>

          {/* Quick Facts */}
          <div>
            <Text size="sm" fw={500} mb="xs">
              Quick Facts
            </Text>
            <List size="sm" spacing="xs">
              <List.Item>
                <strong>Location:</strong> Chromosome {gene.chromosome},
                positions {formatNumber(gene.seqRegionStart)} to{' '}
                {formatNumber(gene.seqRegionEnd)}
              </List.Item>
              <List.Item>
                <strong>Length:</strong> {formatNumber(geneLength)} base pairs (
                {(geneLength / 1000).toFixed(1)} kb)
              </List.Item>
              <List.Item>
                <strong>Type:</strong> {getBiotypeCategory(gene.biotype)}
              </List.Item>
              {gene.geneSymbol && (
                <List.Item>
                  <strong>Symbol:</strong> {gene.geneSymbol}
                </List.Item>
              )}
            </List>
          </div>

          {/* External Links (optional - you can add these) */}
          <div>
            <Text size="sm" fw={500} mb="xs">
              External Resources
            </Text>
            <Group spacing="xs">
              <Badge
                component="a"
                href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ensembl}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                style={{ cursor: 'pointer' }}
              >
                View in Ensembl
              </Badge>
              {gene.geneSymbol && (
                <Badge
                  component="a"
                  href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.geneSymbol}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  style={{ cursor: 'pointer' }}
                >
                  View in GeneCards
                </Badge>
              )}
            </Group>
          </div>
        </Stack>
      </Card>
    </Stack>
  );
}
