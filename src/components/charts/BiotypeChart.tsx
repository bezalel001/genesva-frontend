import { useMemo } from 'react';
import { Card, useMantineTheme } from '@mantine/core';
import ReactECharts from 'echarts-for-react';
import type { Gene } from '../../types/gene.types';

interface BiotypeChartProps {
  gene: Gene;
  allGenes: Gene[];
}

export function BiotypeChart({ gene, allGenes }: BiotypeChartProps) {
  // Use Mantine theme to detect dark mode
  const theme = useMantineTheme();
  const isDarkMode = theme.colorScheme === 'dark';
  // Define colors based on theme
  const textColor = isDarkMode ? theme.colors.gray[2] : theme.colors.dark[8];

  const chartData = useMemo(() => {
    // Count biotypes on the same chromosome
    const chromosomeGenes = allGenes.filter(
      g => g.chromosome === gene.chromosome
    );
    const biotypeCount: Record<string, number> = {};

    chromosomeGenes.forEach(g => {
      const biotype = g.biotype || 'Unknown';
      biotypeCount[biotype] = (biotypeCount[biotype] || 0) + 1;
    });

    // Convert to array, sort, and take top 6
    return Object.entries(biotypeCount)
      .map(([name, value]) => ({
        name,
        value,
        itemStyle: {
          color: name === gene.biotype ? '#ff6b6b' : undefined,
        },
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [gene, allGenes]);

  const option = useMemo(() => {
    return {
      title: {
        text: `Gene Types on Chr ${gene.chromosome}`,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            fontSize: 10,
          },
        },
      ],
      color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
    };
  }, [gene.chromosome, textColor, chartData]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <ReactECharts
        option={option}
        style={{ height: '280px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        theme={isDarkMode ? 'dark' : undefined}
      />
    </Card>
  );
}
