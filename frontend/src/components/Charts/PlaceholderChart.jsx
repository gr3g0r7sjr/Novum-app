// frontend/src/components/Charts/PlaceholderChart.jsx
import React from 'react';

const PlaceholderChart = ({ title }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 flex items-center justify-center h-64 text-gray-500 text-center">
      <p className="text-lg">{title} (Próximamente un gráfico real)</p>
    </div>
  );
};

export default PlaceholderChart;
