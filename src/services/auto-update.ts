import { getLogger } from '../utils/logger';

export class AutoUpdate {
  private readonly logger = getLogger();

  constructor() {
    this.logger.info('AutoUpdate constructor');
  }
}
