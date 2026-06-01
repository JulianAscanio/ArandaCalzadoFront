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
            backgroundColor: activeFilter === state ? '#b1223a' : 'transparent',
            color: activeFilter === state ? '#FFFFFF' : '#4b3a35',
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
    display: 'inline-flex',
    backgroundColor: '#FFFFFF',
    padding: '6px',
    borderRadius: '30px',
    gap: '4px',
    marginBottom: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
  },
  filterBtn: {
    padding: '8px 20px',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease',
  }
};