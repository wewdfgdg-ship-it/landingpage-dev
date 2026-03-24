import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Lazy initialization — 환경변수 없어도 모듈 import가 실패하지 않음
let _client: S3Client | null = null;

function getBucket(): string {
  return (process.env.R2_BUCKET_NAME ?? '').replace(/"/g, '');
}

function getClient(): S3Client {
  if (_client) return _client;

  const endpoint = (process.env.R2_ENDPOINT ?? '').replace(/"/g, '');
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID ?? '').replace(/"/g, '');
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY ?? '').replace(/"/g, '');

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 환경변수가 설정되지 않았습니다 (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)');
  }

  _client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

// 기존 코드 호환을 위한 Proxy export
export const r2 = new Proxy({} as S3Client, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function' ? (value as CallableFunction).bind(client) : value;
  },
});

export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({ Bucket: getBucket(), Key: key, ContentType: contentType });
  return getSignedUrl(getClient(), command, { expiresIn: 600 });
}

export async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: getBucket(), Key: key });
  return getSignedUrl(getClient(), command, { expiresIn: 7200 });
}

export async function deleteObject(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }));
}

export function getCdnUrl(key: string): string {
  const cdnUrl = (process.env.R2_CDN_URL ?? '').replace(/"/g, '');
  return `${cdnUrl}/${key}`;
}

export async function getObjectBuffer(key: string): Promise<Buffer> {
  const response = await getClient().send(new GetObjectCommand({ Bucket: getBucket(), Key: key }));
  if (!response.Body) {
    throw new Error(`R2 객체를 찾을 수 없습니다: ${key}`);
  }
  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
