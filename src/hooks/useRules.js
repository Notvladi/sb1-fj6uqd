import { useCallback } from 'react';
import { RULES_ENGINE } from '../config';

export const useRules = () => {
  // Node placement rules
  const canAddNode = useCallback((parentNode, nodeType) => {
    return RULES_ENGINE.node.canAddChild(parentNode, nodeType);
  }, []);

  const getOptimalPosition = useCallback((parentNode, siblings, nodeType) => {
    return RULES_ENGINE.node.calculateOptimalPosition(parentNode, siblings, nodeType);
  }, []);

  // Visual rules
  const getNodeStyle = useCallback((node) => {
    const size = RULES_ENGINE.visual.getNodeSize(node.type);
    const color = RULES_ENGINE.visual.getNodeColor(node.type, node.category);
    const statusColor = RULES_ENGINE.visual.getStatusColor(node.status);
    
    return { size, color, statusColor };
  }, []);

  // Business rules
  const calculateNodeStatus = useCallback((node) => {
    const progress = RULES_ENGINE.business.calculateProgress(node);
    const riskStatus = RULES_ENGINE.business.calculateRisk(node);
    const budgetStatus = RULES_ENGINE.business.calculateBudgetStatus(node);
    
    return {
      progress,
      status: riskStatus === 'delayed' || budgetStatus === 'delayed' ? 
        'delayed' : riskStatus === 'at-risk' || budgetStatus === 'at-risk' ? 
        'at-risk' : 'on-track'
    };
  }, []);

  // Validation rules
  const validateNode = useCallback((node) => {
    const rules = RULES_ENGINE.validation.NODE;
    const errors = {};

    if (!node.name || node.name.length < rules.name.minLength) {
      errors.name = `Name must be at least ${rules.name.minLength} characters`;
    }

    if (node.description && node.description.length > rules.description.maxLength) {
      errors.description = `Description cannot exceed ${rules.description.maxLength} characters`;
    }

    if (node.budget && (node.budget < rules.budget.min || node.budget > rules.budget.max)) {
      errors.budget = `Budget must be between ${rules.budget.min} and ${rules.budget.max}`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  return {
    canAddNode,
    getOptimalPosition,
    getNodeStyle,
    calculateNodeStatus,
    validateNode
  };
};