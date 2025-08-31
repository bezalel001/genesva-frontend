import { useMemo } from 'react';
import { Card } from '@mantine/core';
import ReactECharts from 'echarts-for-react';
import type { Gene } from '../../types/gene.types';

interface BiotypeChartProps {
  gene: Gene;
  allGenes: Gene[];
}

export function BiotypeChart({ gene, allGenes }: BiotypeChartProps) {
  const option = useMemo(() => {
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
    const data = Object.entries(biotypeCount)
      .map(([name, value]) => ({
        name,
        value,
        itemStyle: {
          color: name === gene.biotype ? '#ff6b6b' : undefined,
        },
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return {
      title: {
        text: `Gene Types on Chr ${gene.chromosome}`,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'normal' },
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
          data: data,
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
  }, [gene, allGenes]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <ReactECharts
        option={option}
        style={{ height: '280px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </Card>
  );
}
