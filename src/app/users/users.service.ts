import { HttpException, Injectable } from '@nestjs/common';
import { AuthTokenResponse, CreateUserInput, LoginUserInput, UpdateUserInput } from './dto/user.input';
import { User } from './entities/user.entity';
import { PrismaService } from '@/prisma.service';
import { User as PUser, Prisma } from '@prisma/client';
import { UserFromToken, AuthToken } from '@/common/types.model';
import { CryptoService } from '@/providers/crypto/crypto.service';
import { CustomJwtService } from '@/providers/crypto/jwt.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    private jwtService: CustomJwtService,
    private cryptoService: CryptoService,
    ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<PUser | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
  

  async register(data: CreateUserInput): Promise<User> {
    data.password = await this.cryptoService.createHash(data.password);
    const createUsr = await this.prisma.user.create({
      data
      // data: { email: data.email, name: data.name, password: data.password },
    });
    return createUsr
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async update(id: number, data: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: { ...data },
    });
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }

  

  async login(input : LoginUserInput): Promise<AuthTokenResponse>{
    const user = await this.findByEmail(input.email)
    if(!user) throw new HttpException("email or password wrong", 400);


    const isMatch = await this.cryptoService.verifyHash(user.password, input.password);
    if(!isMatch) throw new HttpException("email or password wrong", 400);

    const authToken: AuthToken = await this.generateAuthToken({
      id: user.id,
      role: user.role,
    });
    return { user: user, authToken}

  }


  public async generateAuthToken(payload: UserFromToken, update = false): Promise<AuthToken> {

    const newPayload: UserFromToken = {
      id: payload.id,
      role: payload.role,
    };

    const accessToken = await this.jwtService.signAccessToken(newPayload);
    const refreshToken = await this.jwtService.signRefreshToken(newPayload);

    const authToken: AuthToken = {
      accessToken,
      refreshToken,
    };
    return authToken;
  }

  // TODO implement refresh token
}
