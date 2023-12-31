import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWhitelistAddressListDto } from './dto/create-whitelist-address-list';
import { GetMerkleProofDto } from './dto/get-merkle-proof';
import { VerifyWalletDto } from './dto/verify-wallet';
import { WalletEntity } from './entity/wallet.entity';
import { MerkleTreeHelper } from './helper/merkle';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  async createWhitelistAddressList(
    payload: CreateWhitelistAddressListDto,
  ): Promise<{
    walletData: WalletEntity;
  }> {
    const { walletAddresses } = payload;

    const tree = MerkleTreeHelper.createMerkleTree(walletAddresses);
    const treeRoot = MerkleTreeHelper.getMerkleRoot(tree);
    let walletData = await this.walletRepository.findOne({
      where: { treeRoot },
    });

    if (walletData) {
      await this.walletRepository.update(walletData.id, {
        treeRoot,
        walletList: walletAddresses,
      });
    } else {
      walletData = this.walletRepository.create({
        treeRoot,
        walletList: walletAddresses,
      });
      await this.walletRepository.save(walletData);
    }
    return { walletData };
  }

  async getMerkleProof(
    query: GetMerkleProofDto,
  ): Promise<{ merkleProof: string[]; message: string }> {
    const { walletAddress } = query;
    const walletData = await this.walletRepository.find({ skip: 0, take: 1 });
    if (!walletData[0])
      throw new HttpException('Whitelist not found', HttpStatus.BAD_REQUEST);

    const walletListTree = MerkleTreeHelper.createMerkleTree(
      walletData[0].walletList,
    );
    const merkleProof = MerkleTreeHelper.getMerkleHexProof(
      walletListTree,
      walletAddress,
    );
    if (!merkleProof.length)
      throw new HttpException(
        'Your wallet address is not eligible to mint',
        HttpStatus.BAD_REQUEST,
      );
    return { merkleProof, message: 'Get merkle proof successfully' };
  }

  async verifyWalletAddress(query: VerifyWalletDto): Promise<{
    message: string;
  }> {
    const { walletAddress } = query;
    const walletData = await this.walletRepository.find({ skip: 0, take: 1 });

    if (!walletData[0]) return { message: 'Whitelist not found' };

    const whitelistTree = MerkleTreeHelper.createMerkleTree(
      walletData[0].walletList,
    );

    const isWhitelist = MerkleTreeHelper.verifyLeafInclusion(
      whitelistTree,
      walletAddress,
    );
    const message = isWhitelist
      ? 'Wallet is in whitelist'
      : 'Wallet is NOT in whitelist';
    return {
      message,
    };
  }
}
