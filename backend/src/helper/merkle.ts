const keccak256 = require('keccak256')
import MerkleTree from 'merkletreejs';

export interface IMerkleProof {
  position: 'left' | 'right';
  data: Buffer;
}

export class MerkleTreeHelper {
  static createMerkleTree(values: string[]): MerkleTree {
    const leaves = values.map((x) => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    return tree;
  }

  static getMerkleRoot(tree: MerkleTree): string {
    return '0x' + tree.getRoot().toString('hex');
  }

  static getMerkleProof(tree: MerkleTree, leaf: string): IMerkleProof[] {
    try {
      const hexLeaf = keccak256(leaf);
      const proof = tree.getProof(hexLeaf);
      return proof;
    } catch (error: unknown) {
      console.log('getMerkleProof error: ', error);
    }
  }

  static getMerkleHexProof(tree: MerkleTree, leaf: string): string[] {
    try {
      const hexLeaf = keccak256(leaf);
      const proof = tree.getHexProof(hexLeaf);
      return proof;
    } catch (error: unknown) {
      console.log('getMerkleHexProof error: ', error);
    }
  }

  static verifyLeafInclusion(tree: MerkleTree, leaf: string): boolean {
    let isLeafInclusion = false;
    try {
      const hexLeaf = keccak256(leaf);
      const root = this.getMerkleRoot(tree);
      const proof = this.getMerkleProof(tree, leaf);
      isLeafInclusion = tree.verify(proof, hexLeaf, root);
    } catch (error: unknown) {
      console.log('verifyLeafInclusion error: ', error);
    }
    return isLeafInclusion;
  }
}
