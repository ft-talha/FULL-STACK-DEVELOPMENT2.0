import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface SafeUser {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  private users: UserRecord[] = [
    {
      id: 1,
      name: 'curator',
      email: 'curator@verdant.com',
      password: 'verdant123',
    },
    {
      id: 2,
      name: 'Aisha Khan',
      email: 'aisha.khan@domain.com',
      password: 'Password123',
    },
  ];

  private nextId = 3;
  private activeUser: SafeUser | null = {
    id: 1,
    name: 'curator',
    email: 'curator@verdant.com',
  };

  login(email: string, password: string): {
    success: boolean;
    message: string;
    user: SafeUser;
  } {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!cleanEmail || !cleanPassword) {
      throw new BadRequestException('Email and password are required');
    }

    const user = this.users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    this.activeUser = safeUser;

    return {
      success: true,
      message: 'Signed in successfully',
      user: safeUser,
    };
  }

  register(
    name: string,
    email: string,
    password: string,
  ): {
    success: boolean;
    message: string;
    user: SafeUser;
  } {
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (cleanName.length < 2) {
      throw new BadRequestException('Full name must be at least 2 characters');
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new BadRequestException('Please provide a valid email address');
    }

    if (cleanPassword.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    const exists = this.users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      throw new ConflictException('An account with this email already exists');
    }

    const newUser: UserRecord = {
      id: this.nextId++,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
    };

    this.users.push(newUser);

    const safeUser: SafeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    this.activeUser = safeUser;

    return {
      success: true,
      message: 'Account registered successfully',
      user: safeUser,
    };
  }

  getActiveUser(): SafeUser | null {
    return this.activeUser;
  }

  logout(): { success: boolean; message: string } {
    this.activeUser = null;
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  getAllUsers(): SafeUser[] {
    return this.users.map(({ id, name, email }) => ({ id, name, email }));
  }
}