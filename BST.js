class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.root = Tree.buildTree(arr);
  }

  static buildTree(arr) {
    arr = [...new Set(arr)].sort((a, b) => a - b); //sort & noDup
    return buildTreeRec(arr, 0, arr.length - 1);
    function buildTreeRec(arr, start, end) {
      if (start > end) return null;
      const mid = Math.floor((start + end) / 2);
      const root = new Node(arr[mid]);
      root.left = buildTreeRec(arr, start, mid - 1);
      root.right = buildTreeRec(arr, mid + 1, end);
      return root;
    }
  }

  insert(value) { //RECURSIVE VERSION
    this.root = insertRec(value, this.root);
    function insertRec(value, node) {
      if (node === null) {
        node = new Node(value);
      } else if (value < node.data) {
        node.left = insertRec(value, node.left);
      } else if (value > node.data) {
        node.right = insertRec(value, node.right);
      }
      return node;
    }
  }

  delete(value) { // RECURSIVE VERSION
    this.root = deleteRec(value, this.root);
    function deleteRec(value, node) {
      if (node === null) return null;
      if (value < node.data) {
        node.left = deleteRec(value, node.left);
      } else if (value > node.data) {
        node.right = deleteRec(value, node.right);
      } else {
        if (node.left === null || node.right === null) {
          node = node.left === null ? node.right : node.left;
        } else {
          let newNode = node.right;
          while (newNode.left !== null) {
            newNode = newNode.left;
          }
          node.data = newNode.data;
          node.right = deleteRec(newNode, node.right);
        }
      }
      return node;
    }
  }

  find(value) {
    function findRec(value, node) {
      if (node === null || value === node.data) return node;
      if (value < node.data) return findRec(value, node.left);
      if (value > node.data) return findRec(value, node.right);
    }
    return findRec(value, this.root);
  }

  levelOrder(callback) { // RECURSIVE VERSION
    const q = [];
    const arr = [];
    levelOrderRec(q, this.root, arr);
    function levelOrderRec(q, node, arr) {
      if (node === null) return null;
      Tree.#arrOrCallback(node, arr, callback);
      q.push(node.left);
      q.push(node.right);
      while (q.length > 0) {
        levelOrderRec(q, q.shift(), arr);
      }
    }
    return arr || callback;
  }

  inOrder(callback) {
    const arr = [];
    inOrderRec(this.root, arr);
    function inOrderRec(node, arr) {
      if (node === null) return;
      inOrderRec(node.left, arr);
      Tree.#arrOrCallback(node, arr, callback);
      inOrderRec(node.right, arr);
    }
    return arr || callback;
  }

  preOrder(callback) {
    const arr = [];
    preOrderRec(this.root, arr);
    function preOrderRec(node, arr) {
      if (node === null) return;
      Tree.#arrOrCallback(node, arr, callback);
      preOrderRec(node.left, arr);
      preOrderRec(node.right, arr);
    }
    return arr || callback;
  }

  postOrder(callback) {
    const arr = [];
    postOrderRec(this.root, arr);
    function postOrderRec(node, arr) {
      if (node === null) return;
      postOrderRec(node.left, arr);
      postOrderRec(node.right, arr);
      Tree.#arrOrCallback(node, arr, callback);
    }
    return arr || callback;
  }

  static height(node) {
    return node === null
      ? -1
      : Math.max(Tree.height(node.left), Tree.height(node.right)) + 1;
  }

  depth(node) {
    return Tree.height(this.root) - Tree.height(node);
  }

  isBalanced() {
    let output = true;
    this.levelOrder((node) => {
      const lh = Tree.height(node.left);
      const rh = Tree.height(node.right);
      if (Math.abs(lh - rh) > 1) {
        return (output = false);
      }
    });
    return output;
  }

  rebalance() {
    this.root = Tree.buildTree(this.levelOrder());
  }

  static #arrOrCallback(node, arr, callback) { //util for order methods
    if (callback) callback(node);
    else arr.push(node.data);
  }

/*
  insert(value) { // NON-RECURSIVE VERSION
    if (this.find(value)) return;
    let r = this.root;
    if (r === null) {
      this.root = new Node(value); return;
    }
    while (true) {
      if (value < r.data) {
        if (r.left !== null) {
          r = r.left; continue;
        } else {
          r.left = new Node(value); return;
        }
      } else if (value > r.data) {
        if (r.right !== null) {
          r = r.right; continue;
        } else {
          r.right = new Node(value); return;
        }
      }
    }
  }

  delete(value) { // NON-RECURSIVE VERSION
    if (!this.find(value)) return;
    const node = this.find(value);
    const delEasyNode = (node) => { //delete leaf or single child node
      const parent = this.#findParent(node.data);
      const del = node.left === null ? node.right : node.left;
      if (node.data < parent.data) {
        parent.left = del;
      } else {
        parent.right = del;
      }
    }
    if (node.left === null || node.right === null) {
      delEasyNode(node);
    } else {
      let newNode = node.right;
      while (newNode.left !== null) {
        newNode = newNode.left;
      }
      const temp = newNode.data;
      delEasyNode(newNode);
      node.data = temp;
    }
  }

  #findParent(value) { // util function for non-recursive delete
    let parent;
    this.levelOrder(node => {
      if (node.left !== null && node.left.data === value) {
          return (parent = node);
        }
      if (node.right !== null && node.right.data === value) {
          return (parent = node);
        }
    })
    return parent;
  }

  levelOrder(callback) { // NON-RECURSIVE VERSION
    if (this.root === null) return [];
    const arr = [];
    const q = [this.root];
    while (q.length > 0) {
      const node = q.shift(); //dequeue
      Tree.#arrOrCallback(node, arr, callback);
      if (node.left !== null) q.push(node.left); //enqueue
      if (node.right !== null) q.push(node.right); //enqueue
    }
    return arr || callback;
  } */
}

function prettyPrint(node, prefix = '', isLeft = true) {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
}