
import React from 'react';
import styles from './MetricCard.module.scss'; // Ruta relativa dentro de la misma carpeta

const MetricCard = ({ title, value, small = false }) => {
  return (
    <div className={`${styles.metricCard} bg-white rounded-lg shadow-md p-6 text-center flex flex-col justify-between
      ${small ? 'py-4 px-3' : 'py-8 px-6'}`}>
      <h3 className={`font-semibold text-gray-600 ${small ? 'text-sm mb-1' : 'text-lg mb-2'}`}>
        {title}
      </h3>
      <p className={`font-bold text-blue-600 ${small ? 'text-xl' : 'text-4xl'}`}>
        {value}
      </p>
    </div>
  );
};

export default MetricCard;
