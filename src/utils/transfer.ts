import { TransferFile, TransferConfig, Transfer, ExpirationOption } from '../types';

// Generate cryptographically random public ID
export function generatePublicId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const segments = [8, 4, 4];
  return segments
    .map(len => {
      const arr = new Uint8Array(len);
      crypto.getRandomValues(arr);
      return Array.from(arr)
        .map(b => chars[b % chars.length])
        .join('');
    })
    .join('-');
}

// Generate unique file ID
export function generateFileId(): string {
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Get expiration date from option
export function getExpirationDate(option: ExpirationOption): Date {
  const now = new Date();
  switch (option) {
    case '1h': return new Date(now.getTime() + 60 * 60 * 1000);
    case '24h': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '3d': return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    case '7d': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
}

// Format expiration label
export function formatExpiration(option: ExpirationOption): string {
  switch (option) {
    case '1h': return '1 hour';
    case '24h': return '24 hours';
    case '3d': return '3 days';
    case '7d': return '7 days';
  }
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

// Get file icon based on type
export function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('zip') || type.includes('rar') || type.includes('tar') || type.includes('7z')) return 'archive';
  if (type.includes('word') || type.includes('document')) return 'document';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'spreadsheet';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'presentation';
  if (type.startsWith('text/')) return 'text';
  return 'file';
}

// Validate file
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
  const MAX_FILENAME_LENGTH = 255;
  
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File exceeds 5GB limit' };
  }
  
  if (file.name.length > MAX_FILENAME_LENGTH) {
    return { valid: false, error: 'Filename too long' };
  }
  
  // Check for suspicious extensions
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif'];
  const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (suspiciousExtensions.includes(ext)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  return { valid: true };
}

// Simulate chunked upload with real progress
export async function simulateUpload(
  file: TransferFile,
  onProgress: (progress: number) => void,
  signal?: AbortSignal
): Promise<boolean> {
  const CHUNKS = 20;
  const CHUNK_DELAY = Math.max(50, Math.min(200, file.size / (1024 * 1024 * 10)));
  
  for (let i = 0; i < CHUNKS; i++) {
    if (signal?.aborted) return false;
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, CHUNK_DELAY + Math.random() * 50);
      signal?.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Upload cancelled'));
      }, { once: true });
    });
    
    onProgress(((i + 1) / CHUNKS) * 100);
  }
  
  return true;
}

// Create transfer object
export function createTransfer(files: TransferFile[], config: TransferConfig): Transfer {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  
  return {
    id: generatePublicId(),
    publicId: generatePublicId(),
    files,
    config,
    status: 'CREATED',
    totalSize,
    createdAt: new Date(),
    expiresAt: getExpirationDate(config.expiration),
    downloadCount: 0,
  };
}

// Store transfer in localStorage
export function storeTransfer(transfer: Transfer): void {
  const data = JSON.stringify({
    ...transfer,
    files: transfer.files.map(f => ({
      ...f,
      file: undefined, // Can't serialize File objects
    })),
  });
  localStorage.setItem(`rift_transfer_${transfer.publicId}`, data);
}

// Retrieve transfer from localStorage
export function getTransfer(publicId: string): Transfer | null {
  const data = localStorage.getItem(`rift_transfer_${publicId}`);
  if (!data) return null;
  
  try {
    const transfer = JSON.parse(data);
    transfer.createdAt = new Date(transfer.createdAt);
    transfer.expiresAt = new Date(transfer.expiresAt);
    return transfer;
  } catch {
    return null;
  }
}

// Delete transfer
export function deleteTransfer(publicId: string): void {
  localStorage.removeItem(`rift_transfer_${publicId}`);
}
