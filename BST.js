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
    const buildTreeRec = (arr, start, end) => {
      if (start > end) {
        return null;
      }
      const mid = Math.floor((start + end) / 2);
      const root = new Node(arr[mid]);
      root.left = buildTreeRec(arr, start, mid - 1);
      root.right = buildTreeRec(arr, mid + 1, end);
      return root;
    }
    arr = [...new Set(arr)].sort((a, b) => a - b); //sort & removeDup
    return buildTreeRec(arr, 0, arr.length - 1);
  }

  insert(value) { //RECURSIVE VERSION
    const insertRec = (value, node) => {
      if (node === null) {
        node = new Node(value);
      } else if (value < node.data) {
        node.left = insertRec(value, node.left);
      } else if (value > node.data) {
        node.right = insertRec(value, node.right);
      }
      return node;
    }
    this.root = insertRec(value, this.root);
  }

  delete(value) { // RECURSIVE VERSION
    const deleteRec = (value, node) => {
      if (node === null) {
        return null;
      }
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
    this.root = deleteRec(value, this.root);
  }

  find(value) {
    const findRec = (value, node) => {
      if (node === null || value === node.data) {
        return node;
      }
      if (value < node.data) {
        return findRec(value, node.left);
      }
      if (value > node.data) {
        return findRec(value, node.right);
      }
    }
    return findRec(value, this.root);
  }

  levelOrder(callback) { // RECURSIVE VERSION
    const levelOrderRec = (q, node) => {
      if (node === null) return;
      Tree.#visit(node, arr, callback);
      q.push(node.left);
      q.push(node.right);
      while (q.length > 0) {
        levelOrderRec(q, q.shift());
      }
    }
    const q = [];
    const arr = [];
    levelOrderRec(q, this.root);
    if (!callback) return arr;
  }

  inOrder(callback) { // RECURSIVE VERSION
    const inOrderRec = (node) => {
      if (node === null) return;
      inOrderRec(node.left);
      Tree.#visit(node, arr, callback);
      inOrderRec(node.right);
    }
    const arr = [];
    inOrderRec(this.root);
    if (!callback) return arr;
  }

  preOrder(callback) { // RECURSIVE VERSION
    const preOrderRec = (node) => {
      if (node === null) return;
      Tree.#visit(node, arr, callback);
      preOrderRec(node.left);
      preOrderRec(node.right);
    }
    const arr = [];
    preOrderRec(this.root);
    if (!callback) return arr;
  }

  postOrder(callback) { // RECURSIVE VERSION
    const postOrderRec = (node) => {
      if (node === null) return;
      postOrderRec(node.left);
      postOrderRec(node.right);
      Tree.#visit(node, arr, callback);
    }
    const arr = [];
    postOrderRec(this.root);
    if (!callback) return arr;
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
    let balance = true;
    this.levelOrder((node) => {
      const lh = Tree.height(node.left);
      const rh = Tree.height(node.right);
      if (Math.abs(lh - rh) > 1) {
        return (balance = false);
      }
    });
    return balance;
  }

  rebalance() {
    this.root = Tree.buildTree(this.levelOrder());
  }

  static #visit(node, arr, callback) { //util for traversal methods
    if (callback) {
      callback(node);
    } else {
      arr.push(node.data);
    }
  }

  prettyPrint(node = this.root, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
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
    let parent = null;
    this.levelOrder(node => {
      if (node.left !== null && node.left.data === value) {
        return (parent = node);
      }
      if (node.right !== null && node.right.data === value) {
        return (parent = node);
      }
    });
    return parent;
  }

  levelOrder(callback) { // NON-RECURSIVE VERSION
    if (this.root === null) return [];
    const arr = [];
    const q = [this.root];
    while (q.length > 0) {
      const node = q.shift(); //dequeue
      Tree.#visit(node, arr, callback);
      if (node.left !== null) {
        q.push(node.left); //enqueue
      }
      if (node.right !== null) {
        q.push(node.right); //enqueue
      }
    }
    if (!callback) return arr;
  }

  inOrder(callback) { // NON-RECURSIVE VERSION
    const arr = [];
    const stack = [];
    let node = this.root;
    while (true) {
      if (node !== null) {
        stack.push(node);
        node = node.left;
      } else {
        if (stack.length === 0) break;
        node = stack.pop();
        Tree.#visit(node, arr, callback);
        node = node.right;
      }
    }
    if (!callback) return arr;
  }

  preOrder(callback) { // NON-RECURSIVE VERSION
    const arr = [];
    const stack = [];
    let node = this.root;
    while (true) {
      if (node !== null) {
        Tree.#visit(node, arr, callback);
        stack.push(node);
        node = node.left;
      } else {
        if (stack.length === 0) break;
        node = stack.pop();
        node = node.right;
      }
    }
    if (!callback) return arr;
  }

  postOrder(callback) { // NON-RECURSIVE VERSION
    const arr = [];
    const stack = [];
    let node = this.root;
    while (true) {
      while (node !== null) {
        stack.push(node);
        stack.push(node);
        node = node.left;
      }
      if (stack.length === 0) break;
      node = stack.pop();
      if (stack.length !== 0 && stack[stack.length - 1] === node) {
        node = node.right;
      } else {
        Tree.#visit(node, arr, callback);
        node = null;
      }
    }
    if (!callback) return arr;
  } */
}

// Tie it all together

function printOrders(tree) {
  console.log(tree.levelOrder());
  console.log(tree.preOrder());
  console.log(tree.postOrder());
  console.log(tree.inOrder());
}

const randArr = [...Array(10)].map(() => Math.floor((Math.random()*100)))
const tree = new Tree(randArr);

tree.prettyPrint();
console.log(tree.isBalanced());
printOrders(tree);

tree.insert(150);
tree.insert(200);

console.log(tree.isBalanced());

tree.rebalance();

tree.prettyPrint();
printOrders(tree);