import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateWhitelistAddressListDto } from './dto/create-whitelist-address-list';
import { GetMerkleProofDto } from './dto/get-merkle-proof';
import { AppService } from './app.service';
import { VerifyWalletDto } from './dto/verify-wallet';

@Controller()
export class AppController {
  constructor(private readonly walletService: AppService) {}

  @Post('whitelist-address-list')
  async createWhitelistAddressList(
    @Body() payload: CreateWhitelistAddressListDto,
  ) {
    return this.walletService.createWhitelistAddressList(payload);
  }

  @Get('merkle-proof')
  async getMerkleProof(@Query() query: GetMerkleProofDto) {
    return this.walletService.getMerkleProof(query);
  }

  @Get('verify-wallet')
  async verifyWalletAddress(@Query() query: VerifyWalletDto) {
    return this.walletService.verifyWalletAddress(query);
  }
}
