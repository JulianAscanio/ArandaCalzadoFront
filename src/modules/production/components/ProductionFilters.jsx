import React from 'react';

export const ProductionFilters = ({ activeFilter, onFilterChange }) => {
  const states = ['Todos', 'Pendiente', 'En producción'];

  return (
    <div style={styles.filterContainer}>
      {states.map((state) => (
        <button
          key={state}
          onClick={() => onFilterChange(state)}
          style={{
            ...styles.filterBtn,
            backgroundColor: activeFilter === state ? '#b1223a' : '#FFFFFF',
            color: activeFilter === state ? '#FFFFFF' : '#6f5d56',
            border: activeFilter === state ? '1px solid #b1223a' : '1px solid #d8ccc4',
          }}
        >
          {state}
        </button>
      ))}
    </div>
  );
};

const styles = {
  filterContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};