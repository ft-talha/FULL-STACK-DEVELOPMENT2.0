import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  private readonly publicDir = join(process.cwd(), 'public');

  resolveHtmlPage(requestedFile: string): string {
    const directPath = join(this.publicDir, requestedFile);
    if (fs.existsSync(directPath)) {
      return directPath;
    }

    if (requestedFile.toLowerCase() === 'auth.html') {
      const upperAuthPath = join(this.publicDir, 'Auth.html');
      if (fs.existsSync(upperAuthPath)) {
        return upperAuthPath;
      }
      const lowerAuthPath = join(this.publicDir, 'auth.html');
      if (fs.existsSync(lowerAuthPath)) {
        return lowerAuthPath;
      }
    }

    throw new NotFoundException(
      `HTML file "${requestedFile}" not found inside public/ directory`,
    );
  }
}