import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import iamConfig from '../../../config/iam.config';

@Injectable()
export class GlobalIamHeadersCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GlobalIamHeadersCheckMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const region = req.header('region');
    const application = req.header('application');
    if (!region || !application) {
      this.logger.error('Tentativa de uso de área restrita');
      throw new UnauthorizedException('Region and application required');
    }
    if (region !== iamConfig.MAIN_REGION || application !== iamConfig.MAIN_APP_IAM_MGT) {
      this.logger.error('Tentativa de uso de área restrita');
      throw new UnauthorizedException('Region and application not allowed');
    }
    next();
  }
}

@Injectable()
export class RegionAppHeadersCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GlobalIamHeadersCheckMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const region = req.header('region');
    const application = req.header('application');
    if (!region || !application) {
      this.logger.error('Tentativa de sem informar a região ou aplicação');
      throw new UnauthorizedException('Region and application required');
    }
    next();
  }
}
