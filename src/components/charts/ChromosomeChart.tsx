import { useMemo } from 'react';
import { Card } from '@mantine/core';
import ReactECharts from 'echarts-for-react';
import type { Gene } from '../../types/gene.types';

interface ChromosomeChartProps {
  gene: Gene;
  allGenes: Gene[];
}

export function ChromosomeChart({ gene, allGenes }: ChromosomeChartProps) {
  const option = useMemo(() => {
    // Count genes per chromosome
    const chromCount: Record<string, number> = {};
    allGenes.forEach(g => {
      const chr = g.chromosome;
      chromCount[chr] = (chromCount[chr] || 0) + 1;
    });

    // Sort chromosomes naturally (1-22, X, Y, MT)
    const sortedData = Object.entries(chromCount)
      .sort((a, b) => {
        const aNum = parseInt(a[0]);
        const bNum = parseInt(b[0]);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        if (!isNaN(aNum)) return -1;
        if (!isNaN(bNum)) return 1;
        return a[0].localeCompare(b[0]);
      })
      .slice(0, 15); // Show top 15 chromosomes

    return {
      title: {
        text: 'Genes per Chromosome',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'normal' },
      },
      tooltip: {
        trigger: 'axis',
        formatter: 'Chr {b}: {c} genes',
      },
      xAxis: {
        type: 'category',
        data: sortedData.map(([chr]) => chr),
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
        name: 'Chromosome',
        nameLocation: 'middle',
        nameGap: 35,
      },
      yAxis: {
        type: 'value',
        name: 'Gene Count',
        nameLocation: 'middle',
        nameGap: 40,
      },
      series: [
        {
          type: 'bar',
          data: sortedData.map(([chr, count]) => ({
            value: count,
            itemStyle: {
              color: chr === String(gene.chromosome) ? '#ff6b6b' : '#73c0de',
            },
          })),
          label: {
            show: false,
          },
        },
      ],
      grid: {
        left: '15%',
        right: '5%',
        bottom: '20%',
        top: '15%',
      },
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
