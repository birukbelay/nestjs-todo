import { Module } from '@nestjs/common';

import { GqlJwtGuard } from './guard.gql';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  providers: [ GqlJwtGuard],
  exports: [ GqlJwtGuard],
})
export class GuardsModule {}
