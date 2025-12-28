import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  private readonly INFO_ICON = 'ℹ️ ';
  private readonly FATAL_ICON = '❗️ ';
  private readonly ERROR_ICON = '❌ ';
  private readonly WARN_ICON = '⚠️ ';
  private readonly DEBUG_ICON = '🐞 ';
  private readonly VERBOSE_ICON = '🔍 ';

  private readonly INFO_PREFIX = '[INFO] ';
  private readonly FATAL_PREFIX = '[FATAL] ';
  private readonly ERROR_PREFIX = '[ERROR] ';
  private readonly WARN_PREFIX = '[WARN] ';
  private readonly DEBUG_PREFIX = '[DEBUG] ';
  private readonly VERBOSE_PREFIX = '[VERBOSE] ';

  logMessage(message: any, ...optionalParams: any[]) {
    this.log(this.INFO_ICON + this.INFO_PREFIX + message, ...optionalParams);
  }

  fatalMessage(message: any, ...optionalParams: any[]) {
    this.fatal(
      this.FATAL_ICON + this.FATAL_PREFIX + message,
      ...optionalParams,
    );
  }

  errorMessage(message: any, ...optionalParams: any[]) {
    this.error(
      this.ERROR_ICON + this.ERROR_PREFIX + message,
      ...optionalParams,
    );
  }

  warnMessage(message: any, ...optionalParams: any[]) {
    this.warn(this.WARN_ICON + this.WARN_PREFIX + message, ...optionalParams);
  }

  debugMessage?(message: any, ...optionalParams: any[]) {
    this.debug(
      this.DEBUG_ICON + this.DEBUG_PREFIX + message,
      ...optionalParams,
    );
  }

  verboseMessage?(message: any, ...optionalParams: any[]) {
    this.verbose(
      this.VERBOSE_ICON + this.VERBOSE_PREFIX + message,
      ...optionalParams,
    );
  }
}
