export type FileStatus = 'CREATED' | 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED' | 'EXPIRED' | 'DELETED';

export type TransferStatus = 'CREATED' | 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED' | 'EXPIRED' | 'DELETED';

export type ExpirationOption = '1h' | '24h' | '3d' | '7d';

export type DownloadLimit = 'unlimited' | '1' | '5' | '10' | '25';

export interface TransferFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: FileStatus;
  file: File;
}

export interface TransferConfig {
  expiration: ExpirationOption;
  password: string;
  downloadLimit: DownloadLimit;
}

export interface Transfer {
  id: string;
  publicId: string;
  files: TransferFile[];
  config: TransferConfig;
  status: TransferStatus;
  totalSize: number;
  createdAt: Date;
  expiresAt: Date;
  downloadCount: number;
}

export type AppView = 'landing' | 'uploading' | 'ready' | 'recipient';
