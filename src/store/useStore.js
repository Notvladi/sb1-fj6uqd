import { create } from 'zustand';
import { produce } from 'immer';
import { initialNodes } from '../data/initialNodes';
import { v4 as uuidv4 } from 'uuid';

const useStore = create((set) => ({
  nodes: initialNodes,
  selectedNode: null,
  editingNode: null,
  editingTask: null,
  isAddingNode: false,

  setSelectedNode: (node) => set({ selectedNode: node }),
  setEditingNode: (node) => set({ editingNode: node }),
  setEditingTask: (task) => set({ editingTask: task }),
  setIsAddingNode: (isAdding) => set({ isAddingNode: isAdding }),
  
  updateNode: (updatedNode) => set(
    produce((state) => {
      const index = state.nodes.findIndex(n => n.id === updatedNode.id);
      if (index !== -1) {
        state.nodes[index] = updatedNode;
        if (state.selectedNode?.id === updatedNode.id) {
          state.selectedNode = updatedNode;
        }
      }
    })
  ),

  addNode: (node) => set(
    produce((state) => {
      const newNode = {
        ...node,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        tasks: [],
        progress: 0,
        status: 'on-track'
      };
      state.nodes.push(newNode);
      state.editingNode = null;
      state.isAddingNode = false;
    })
  ),

  removeNode: (nodeId) => set(
    produce((state) => {
      state.nodes = state.nodes.filter(n => n.id !== nodeId);
      if (state.selectedNode?.id === nodeId) {
        state.selectedNode = null;
      }
    })
  )
}));

export default useStore;