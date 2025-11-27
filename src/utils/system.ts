import os from 'node:os';
import { APP_VERSION } from '../config/version';

export function makeUserAgent() {
  const app = APP_VERSION?.split('-')?.[0] || '';
  const system = os?.version?.()?.split(' ')?.[0] || '';
  const release = os?.release?.()?.split('.')?.[0] || '';
  const platform = os.platform();
  const arch = os.arch();
  // const node = `node/${process.version}`;
  return `art-w/${app} (${system} ${release}; ${platform}; ${arch}) +s4sbr.com`;
}
