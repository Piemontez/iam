const defaultIamConfig = {
  IAM_PASS_SECRET_SALT: 'IAM_PASS_SECRET_SALT_2VTga2Vr4m',
};

const iamConfig = {
  PRODCTION_MODE: process.env.NODE_ENV === 'production',
  // Região Principal
  MAIN_REGION: 'global',
  // Aplicação de authenticação SSO
  MAIN_APP_IAM: 'iam',
  // Aplicação de gestão do IAM SSO
  MAIN_APP_IAM_MGT: 'iam_mgt',

  // Salt adicional na gerão do password
  IAM_PASS_SECRET_SALT: process.env.IAM_PASS_SECRET_SALT || defaultIamConfig.IAM_PASS_SECRET_SALT,

  // Máximo de tentativa de registros por IP
  REGISTER_RATE_LIMITE: 10,
  // Tempo que registra
  REGISTER_RATE_LIMITE_RESET_TIME: 60,
  // Máximo de registros por minuto
  REGISTER_MAX_PER_MINUTE: 2,
  // Máximo de registros por hora
  REGISTER_MAX_PER_HOUR: 5,
  // Máximo de registros por semana
  REGISTER_MAX_PER_WEEK: 20,
  // Máximo de registros por mês
  REGISTER_MAX_PER_MONTH: 30,
};

export default iamConfig;
