// tree.js — structure-aware helpers
export const isComposite = (node) =>
    !!node && (
      Array.isArray(node.pets) ||
      Array.isArray(node.weightLog) ||
      Array.isArray(node.meals)
    );
  
  export const childrenOf = (node) => {
    if (!node) return [];
    if (Array.isArray(node.pets)) return node.pets;                // Owner
    if (Array.isArray(node.weightLog) || Array.isArray(node.meals)) {
      return [...(node.weightLog ?? []), ...(node.meals ?? [])];   // Pet
    }
    return [];                                                     // leaves
  };
  
  // Optional: generic DFS
  export function walk(root, visit) {
    const stack = [root];
    while (stack.length) {
      const n = stack.pop();
      visit(n);
      if (isComposite(n)) stack.push(...childrenOf(n));
    }
  }
  