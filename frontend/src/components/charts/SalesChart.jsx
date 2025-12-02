import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Loader } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/constants';

const SalesChart = ({ data, loading = false, period = 'month' }) => {
  // Calculate chart dimensions
  const chartHeight = 300;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = 0;
    const range = maxValue - minValue || 1;

    // Calculate scales
    const xStep = (chartWidth - padding.left - padding.right) / (data.length - 1 || 1);
    const yScale = (chartHeight - padding.top - padding.bottom) / range;

    // Generate points for line
    const points = data.map((item, index) => {
      const x = padding.left + index * xStep;
      const y = chartHeight - padding.bottom - (item.value - minValue) * yScale;
      return { x, y, value: item.value, label: item.label };
    });

    // Generate path for line
    const linePath = points
      .map((point, index) => {
        return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
      })
      .join(' ');

    // Generate path for area under line
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

    // Y-axis labels
    const yAxisLabels = [];
    const labelCount = 5;
    for (let i = 0; i <= labelCount; i++) {
      const value = minValue + (range / labelCount) * i;
      const y = chartHeight - padding.bottom - (value - minValue) * yScale;
      yAxisLabels.push({ value, y });
    }

    return {
      points,
      linePath,
      areaPath,
      yAxisLabels,
      maxValue,
    };
  }, [data, chartWidth, chartHeight, padding]);

  const periodLabels = {
    day: 'Aujourd\'hui',
    week: 'Cette semaine',
    month: 'Ce mois',
    year: 'Cette année',
  };

  if (loading) {
    return (
      <Card title={`Ventes - ${periodLabels[period] || 'Période'}`}>
        <div className="flex justify-center items-center h-80">
          <Loader size="lg" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title={`Ventes - ${periodLabels[period] || 'Période'}`}>
        <div className="flex flex-col justify-center items-center h-80 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p>Aucune donnée disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`Ventes - ${periodLabels[period] || 'Période'}`}
      subtitle={`Total: ${formatCurrency(data.reduce((sum, d) => sum + d.value, 0))}`}
    >
      <div className="relative">
        {/* Chart SVG */}
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          style={{ maxHeight: '400px' }}
        >
          {/* Grid lines */}
          {chartData.yAxisLabels.map((label, index) => (
            <g key={index}>
              <line
                x1={padding.left}
                y1={label.y}
                x2={chartWidth - padding.right}
                y2={label.y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
                strokeDasharray="4 4"
              />
            </g>
          ))}

          {/* Area under line */}
          <path
            d={chartData.areaPath}
            fill={CHART_COLORS.primary}
            fillOpacity="0.1"
          />

          {/* Line */}
          <path
            d={chartData.linePath}
            stroke={CHART_COLORS.primary}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {chartData.points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#fff"
                stroke={CHART_COLORS.primary}
                strokeWidth="3"
                className="cursor-pointer hover:r-7 transition-all"
              />
              {/* Tooltip on hover */}
              <title>{`${point.label}: ${formatCurrency(point.value)}`}</title>
            </g>
          ))}

          {/* X-axis labels */}
          {chartData.points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - padding.bottom + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600 dark:fill-gray-400"
            >
              {point.label}
            </text>
          ))}

          {/* Y-axis labels */}
          {chartData.yAxisLabels.map((label, index) => (
            <text
              key={index}
              x={padding.left - 10}
              y={label.y + 4}
              textAnchor="end"
              className="text-xs fill-gray-600 dark:fill-gray-400"
            >
              {(label.value / 1000).toFixed(0)}K
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: CHART_COLORS.primary }}
            />
            <span>Ventes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

SalesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
  period: PropTypes.oneOf(['day', 'week', 'month', 'year']),
};

export default SalesChart;
