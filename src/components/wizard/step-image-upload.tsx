'use client';

import { useCallback, useRef } from 'react';
import { useWizardStore, type UploadedImage } from '@/stores/wizard-store';

function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function uploadToR2(file: File, imageId: string): Promise<string> {
  // 1. presigned URL 요청
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: `${imageId}_${file.name}`,
      contentType: file.type,
    }),
  });

  if (!res.ok) throw new Error('업로드 URL 생성 실패');
  const { uploadUrl, storageKey } = (await res.json()) as {
    uploadUrl: string;
    storageKey: string;
  };

  // 2. R2에 직접 업로드
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('이미지 업로드 실패');

  return storageKey;
}

function ImageCard({
  image,
  onRemove,
}: {
  image: UploadedImage;
  onRemove: (id: string) => void;
}): React.ReactElement {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-square">
        <img
          src={image.previewUrl}
          alt="업로드된 이미지"
          className="h-full w-full object-cover"
        />
        {image.uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
        aria-label="이미지 삭제"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {image.storageKey && (
        <div className="absolute bottom-1.5 left-1.5">
          <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
            완료
          </span>
        </div>
      )}
    </div>
  );
}

export function StepImageUpload(): React.ReactElement {
  const { images, addImage, removeImage, updateImage } = useWizardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const remaining = 5 - images.length;
      const filesToAdd = Array.from(files).slice(0, remaining);

      for (const file of filesToAdd) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) continue; // 10MB 제한

        const id = generateId();
        const previewUrl = URL.createObjectURL(file);

        const newImage: UploadedImage = {
          id,
          file,
          previewUrl,
          storageKey: '',
          uploading: true,
        };

        addImage(newImage);

        try {
          const storageKey = await uploadToR2(file, id);
          updateImage(id, { storageKey, uploading: false });
        } catch {
          updateImage(id, { uploading: false });
        }
      }
    },
    [images.length, addImage, updateImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">제품 이미지</h2>
        <p className="mt-1 text-sm text-gray-500">
          제품/서비스 이미지를 업로드해주세요 (최대 5장)
        </p>
      </div>

      {/* 업로드 영역 */}
      {images.length < 5 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 transition-colors hover:border-gray-400 hover:bg-gray-100"
        >
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              클릭하거나 이미지를 드래그하세요
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, WEBP (최대 10MB, {5 - images.length}장 추가 가능)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* 이미지 그리드 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <ImageCard key={img.id} image={img} onRemove={removeImage} />
          ))}
        </div>
      )}

      {/* 안내 */}
      <div className="rounded-lg bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          <strong>팁:</strong> 제품 정면, 사용 장면, 패키지 등 다양한 각도의
          이미지를 올리면 더 높은 품질의 랜딩페이지를 생성할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
