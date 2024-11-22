import React from 'react';
import useStore from '../store/useStore';

export function TaskProvider({ children }) {
  const { selectedNode, editingNode, editingTask } = useStore();

  return (
    <>
      {children}
    </>
  );
}