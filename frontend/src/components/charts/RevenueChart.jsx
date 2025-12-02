import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Loader } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/constants';

const RevenueChart = ({ data, loading = false }) => {
  // Calculate chart dimensions
  const chartHeight = 300;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 60, left: 60 };

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => Math.max(d.revenue, d.expense)));
    const minValue = 0;
    const range = maxValue - minValue || 1;

    // Calculate scales
    const barWidth = (chartWidth - padding.left - padding.right) / data.length;
    const yScale = (chartHeight - padding.top - padding.bottom) / range;

    // Generate bars
    const bars = data.map((item, index) => {
      const x = padding.left + index * barWidth;
      const revenueHeight = item.revenue * yScale;
      const expenseHeight = item.expense * yScale;

      return {
        x,
        label: item.label,
        revenue: {
          x: x + barWidth * 0.15,
          y: chartHeight - padding.bottom - revenueHeight,
          width: barWidth * 0.35,
          height: revenueHeight,
          value: item.revenue,
        },
        expense: {
          x: x + barWidth * 0.55,
          y: chartHeight - padding.bottom - expenseHeight,
          width: barWidth * 0.35,
          height: expenseHeight,
          value: item.expense,
        },
      };
    });

    // Y-axis labels
    const yAxisLabels = [];
    const labelCount = 5;
    for (let i = 0; i <= labelCount; i++) {
      const value = minValue + (range / labelCount) * i;
      const y = chartHeight - padding.bottom - (value - minValue) * yScale;
      yAxisLabels.push({ value, y });
    }

    return { bars, yAxisLabels, maxValue };
  }, [data, chartWidth, chartHeight, padding]);

  if (loading) {
    return (
      <Card title="Revenus vs Dépenses">
        <div className="flex justify-center items-center h-80">
          <Loader size="lg" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Revenus vs Dépenses">
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

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);
  const profit = totalRevenue - totalExpense;

  return (
    <Card title="Revenus vs Dépenses">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenus</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Dépenses</p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Bénéfice</p>
          <p
            className={`text-lg font-semibold ${
              profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatCurrency(profit)}
          </p>
        </div>
      </div>

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

          {/* Bars */}
          {chartData.bars.map((bar, index) => (
            <g key={index}>
              {/* Revenue bar */}
              <rect
                x={bar.revenue.x}
                y={bar.revenue.y}
                width={bar.revenue.width}
                height={bar.revenue.height}
                fill={CHART_COLORS.success}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`Revenus: ${formatCurrency(bar.revenue.value)}`}</title>
              </rect>

              {/* Expense bar */}
              <rect
                x={bar.expense.x}
                y={bar.expense.y}
                width={bar.expense.width}
                height={bar.expense.height}
                fill={CHART_COLORS.danger}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`Dépenses: ${formatCurrency(bar.expense.value)}`}</title>
              </rect>

              {/* X-axis label */}
              <text
                x={bar.x + (chartWidth - padding.left - padding.right) / data.length / 2}
                y={chartHeight - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {bar.label}
              </text>
            </g>
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
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: CHART_COLORS.success }}
            />
            <span>Revenus</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: CHART_COLORS.danger }}
            />
            <span>Dépenses</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      revenue: PropTypes.number.isRequired,
      expense: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

export default RevenueChart;
