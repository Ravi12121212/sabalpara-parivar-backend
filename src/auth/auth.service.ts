import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { PasswordResetToken } from '../schemas/password-reset-token.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PasswordResetToken.name) private resetTokenModel: Model<PasswordResetToken>,
    private jwt: JwtService,
  ) {}

  async signup(data: SignupDto) {
    const existing = await this.userModel.findOne({ $or: [{ email: data.email }, { phone: data.phone }] });
    if (existing) throw new ConflictException('Email or phone already in use');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const userDoc = await this.userModel.create({ email: data.email, phone: data.phone, passwordHash, role: 'user' });
  return this.signToken((userDoc._id as Types.ObjectId).toString(), userDoc.email, userDoc.role);
  }

  async login(data: LoginDto) {
    const user = await this.userModel.findOne({ $or: [{ email: data.email }, { phone: data.phone }] }) as User | null;
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
  return this.signToken((user._id as Types.ObjectId).toString(), user.email, (user as any).role);
  }

  async me(userId: string) {
    const user = await this.userModel.findById(userId) as User | null;
    if (!user) throw new NotFoundException();
    return { id: (user._id as Types.ObjectId).toString(), email: user.email, phone: user.phone, role: (user as any).role, createdAt: user.createdAt };
  }

  async forgotPassword(identifier: string) {
  const user = await this.userModel.findOne({ $or: [{ email: identifier }, { phone: identifier }] }) as User | null;
    if (!user) throw new NotFoundException('User not found');
    // Generate token
    const rawToken = randomUUID();
    const token = await bcrypt.hash(rawToken, 10);
    await this.resetTokenModel.create({
      userId: new Types.ObjectId((user._id as Types.ObjectId).toString()),
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 min
    });
    return { resetToken: rawToken }; // For dev only
  }

  async resetPassword(rawToken: string, newPassword: string) {
  const record = await this.resetTokenModel.findOne({ expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    if (!record) throw new BadRequestException('Invalid or expired token');
    const match = await bcrypt.compare(rawToken, record.token);
    if (!match) throw new BadRequestException('Invalid or expired token');
    const passwordHash = await bcrypt.hash(newPassword, 10);
  await this.userModel.updateOne({ _id: record.userId }, { $set: { passwordHash } });
  await this.resetTokenModel.deleteOne({ _id: record._id });
    return { success: true };
  }

  private signToken(userId: string, email: string, role: string) {
    const isAdmin = role === 'admin' || email === 'admin@sabalpara.com';
    const payload = { sub: userId, email, role, isAdmin };
    return { accessToken: this.jwt.sign(payload), isAdmin };
  }
}
