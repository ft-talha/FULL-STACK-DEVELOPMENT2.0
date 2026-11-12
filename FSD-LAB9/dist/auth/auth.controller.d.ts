import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: Record<string, any>): {
        success: boolean;
        message: string;
        user: import("./auth.service").SafeUser;
    };
    register(body: Record<string, any>): {
        success: boolean;
        message: string;
        user: import("./auth.service").SafeUser;
    };
    getCurrentUser(): {
        success: boolean;
        user: import("./auth.service").SafeUser | null;
    };
    logout(): {
        success: boolean;
        message: string;
    };
    getUsers(): {
        success: boolean;
        data: import("./auth.service").SafeUser[];
    };
}
