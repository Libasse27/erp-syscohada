import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Loader, Badge } from '../common';

const StockChart = ({ data, loading = false }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = -90; // Start from top
    const slices = data.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;

      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      // Calculate path for donut slice
      const radius = 100;
      const innerRadius = 60;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 150 + radius * Math.cos(startRad);
      const y1 = 150 + radius * Math.sin(startRad);
      const x2 = 150 + radius * Math.cos(endRad);
      const y2 = 150 + radius * Math.sin(endRad);
      const x3 = 150 + innerRadius * Math.cos(endRad);
      const y3 = 150 + innerRadius * Math.sin(endRad);
      const x4 = 150 + innerRadius * Math.cos(startRad);
      const y4 = 150 + innerRadius * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');

      return {
        ...item,
        path,
        percentage,
        startAngle,
        endAngle,
      };
    });

    return { slices, total };
  }, [data]);

  const colors = [
    '#10B981', // Green
    '#3B82F6', // Blue
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
  ];

  const getStatusVariant = (status) => {
    const variants = {
      good: 'success',
      low: 'warning',
      critical: 'danger',
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <Card title="État du stock">
        <div className="flex justify-center items-center h-80">
          <Loader size="lg" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title="État du stock">
        <div className="flex flex-col justify-center items-center h-80 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p>Aucune donnée disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="État du stock">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex justify-center items-center">
          <svg viewBox="0 0 300 300" className="w-full max-w-xs">
            {/* Donut slices */}
            {chartData.slices.map((slice, index) => (
              <g key={index}>
                <path
                  d={slice.path}
                  fill={slice.color || colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  strokeWidth="2"
                  stroke="#fff"
                >
                  <title>{`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`}</title>
                </path>
              </g>
            ))}

            {/* Center text */}
            <text
              x="150"
              y="140"
              textAnchor="middle"
              className="text-2xl font-bold fill-gray-900 dark:fill-white"
            >
              {chartData.total}
            </text>
            <text
              x="150"
              y="165"
              textAnchor="middle"
              className="text-sm fill-gray-600 dark:fill-gray-400"
            >
              Produits
            </text>
          </svg>
        </div>

        {/* Legend and details */}
        <div className="space-y-3">
          {chartData.slices.map((slice, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: slice.color || colors[index % colors.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {slice.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {slice.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {slice.value}
                </span>
                {slice.status && (
                  <Badge variant={getStatusVariant(slice.status)} size="sm">
                    {slice.status === 'good' && 'OK'}
                    {slice.status === 'low' && 'Bas'}
                    {slice.status === 'critical' && 'Critique'}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      {data.some((item) => item.status) && (
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.filter((item) => item.status === 'good').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stock normal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.filter((item) => item.status === 'low').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stock faible</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {data.filter((item) => item.status === 'critical').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rupture</p>
          </div>
        </div>
      )}
    </Card>
  );
};

StockChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      status: PropTypes.oneOf(['good', 'low', 'critical']),
      color: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

export default StockChart;
