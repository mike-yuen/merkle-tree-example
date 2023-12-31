import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'tree_root' })
  treeRoot: string;

  @Column({ name: 'wallet_list', type: 'json' })
  walletList: string[];
}
