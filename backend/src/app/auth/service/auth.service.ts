import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DateTime } from 'luxon';
import iamConfig from '../../../config/iam.config';
import jwtConfig from '../../../config/jwt.config';
import { User } from '../../../model/User';
import { UserLogin, UserLoginType } from '../../../model/UserLogin';
import { UserToken } from '../../../model/UserToken';
import { AuthLoginRespDto } from '../controller/dto/auth.dto';
import { JwtUserInfo } from '../jwt/jwt-user-info';
import { CryptService } from './crypt.service';

export type LoginInfo = {
  userUuid: string;
  userLoginUuid: string;

  clientId: string;
  userAgent: string;
  ip: string;
  responseType: string;
  redirectUri: string;
  scope: string;

  sessionToken: string;
  accessToken: string;
  expiresIn: Date;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserLogin) private readonly userLoginRepository: EntityRepository<UserLogin>,
    @InjectRepository(UserToken) private readonly userTokenRepository: EntityRepository<UserToken>,
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptService,
  ) {
    this.logger.log('starting');
  }

  /**
   * Registra um novo usuário no sistema
   * @param props
   * @returns
   */
  async register({ name, username, password }: { name: string; username: string; password: string }): Promise<UserLogin> {
    this.logger.verbose('Registro Local de Usuários');

    // Gera o Salta e o Hash da senha
    const _salt = this.cryptService.generateRandomString(64);
    const _password = this.cryptService.encrypt(iamConfig.IAM_PASS_SECRET_SALT, _salt, password);

    // Registra o Usuário
    const user = this.userRepository.create({ name });
    await this.userLoginRepository.flush();

    // Registrao o login de acesso
    const userLogin = this.userLoginRepository.create({
      user,
      type: UserLoginType.LOCAL,
      username,
      _salt,
      _password,
    });
    await this.userLoginRepository.flush();

    return userLogin;
  }

  /**
   * Valida o login e gera o token jwt de acesso
   * @param username
   * @param password
   * @returns
   */
  async loginJwt(username: string, password: string, appInfo: LoginInfo): Promise<AuthLoginRespDto> {
    this.logger.verbose('Login Local');

    const expiresIn = DateTime.now().plus({ seconds: jwtConfig.MAX_AGE }).toJSDate();
    const userLogin = await this.validateLocalUser(username, password);
    const user = userLogin.user;

    const info = this.userInfo(user, appInfo);
    const access_token = this.generateJwt(info, jwtConfig.MAX_AGE);

    appInfo.userUuid = user.uuid;
    appInfo.userLoginUuid = userLogin.uuid;
    appInfo.accessToken = access_token;
    appInfo.expiresIn = expiresIn;

    return {
      token_type: '',
      scope: ['appInfo.scope'].join(' '),
      access_token,
      info,
    };
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const userLogin = await this.userLoginRepository.findOne({ username, type: UserLoginType.LOCAL });
    return !!userLogin;
  }

  async createUserToken(appInfo: LoginInfo) {
    this.userTokenRepository.create({
      // USER
      user: this.userRepository.getReference(appInfo.userUuid),
      login: this.userLoginRepository.getReference(appInfo.userLoginUuid),
      // OAUTH
      application: appInfo.clientId,
      ip: appInfo.ip,
      userAgent: appInfo.userAgent,
      responseType: appInfo.responseType,
      redirectUri: appInfo.redirectUri,
      scope: appInfo.scope,
      // TOKENS
      sessionToken: appInfo.sessionToken,
      accessToken: appInfo.accessToken,
      expiresIn: appInfo.expiresIn,
    });
    await this.userTokenRepository.flush();
  }

  /*async invalidateSession(sessionId: string): Promise<void> {
    const expiresIn = DateTime.now().minus({ minutes: 30 }).toJSDate();

    await this.userTokenRepository.nativeUpdate({ sessionToken: sessionId }, { expiresIn: expiresIn });
    this.userTokenRepository.flush();
  }*/

  /**
   * Carrega o usuário e verifica seu senha
   * @param username
   * @param password
   * @returns
   */
  private async validateLocalUser(username: string, password: string): Promise<UserLogin> {
    this.logger.verbose('Valida login Local');

    const userLogin = await this.userLoginRepository.findOne({ username, type: UserLoginType.LOCAL }, { populate: ['user'] });
    if (!userLogin) {
      throw new NotFoundException('User does not exist.');
    }

    const _password = this.cryptService.encrypt(iamConfig.IAM_PASS_SECRET_SALT, userLogin._salt, password);

    if (_password === userLogin._password) {
      return userLogin;
    } else {
      throw new BadRequestException('Password incorrect.');
    }
  }

  private userInfo(user: User, { clientId: application }: LoginInfo): JwtUserInfo {
    return {
      uuid: user.uuid,
      name: user.name,
      applicationLogged: application,
    };
  }

  private generateJwt(user: JwtUserInfo, expiresInSeconds: number): string {
    return this.jwtService.sign(user, { expiresIn: expiresInSeconds });
  }
}
