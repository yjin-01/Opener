type Password = {
  password: string;
};

export class UserUpdatePasswordDto {
  password: string;

  passwordCheck: string;

  excludePasswordCheck(): Password {
    return { password: this.password };
  }

  isValidPassword(): boolean {
    return this.password.length > 7 && this.password === this.passwordCheck;
  }

  async encrypt(configService, fn) {
    this.password = await fn(configService, this.password);
  }
}
