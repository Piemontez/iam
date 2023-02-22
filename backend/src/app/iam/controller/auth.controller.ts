import { Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { AuthService, AuthLoginResp } from '../../auth/service/auth.service';
import { AuthRegisterNameUseCase } from '../usecase/auth-register-name.usecase';
import { AuthRegisterPasswordUseCase } from '../usecase/auth-register-password.usecase';
import { AuthRegisterUsernameUseCase } from '../usecase/auth-register-username.usecase';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

@Controller('iam/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Registra um novo usuário.
   * As validações são realizadas por meio de casos de uso
   * @param body
   * @returns
   */
  @Post('local/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localRegister(@Body() body: AuthRegisterDto): Promise<AuthLoginResp> {
    this.logger.log('Registro Local de Usuários');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      await AuthRegisterNameUseCase.execute(body),
      await AuthRegisterUsernameUseCase.execute(body),
      await AuthRegisterPasswordUseCase.execute(body),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    await this.authService.localRegister(body);

    return this.authService.localLogin(body.username, body.password);
  }

  /**
   * Realiza o login do usuário
   * @param body
   * @returns
   */
  @Post('local/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localLogin(@Body() body: AuthLoginDto): Promise<AuthLoginResp> {
    this.logger.log('Login Local');

    return await this.authService.localLogin(body.username, body.password);
  }
}
