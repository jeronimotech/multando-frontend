'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useReportForm, type EvidenceFile } from '@/hooks/use-report-form';
import { generateId } from '@/lib/utils';
import {
  Camera,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';

interface EvidenceUploadProps {
  className?: string;
}

// Supported file types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 5;

export function EvidenceUpload({ className }: EvidenceUploadProps) {
  const { evidences, description, addEvidence, removeEvidence, setDescription } =
    useReportForm();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Process files
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setUploadError(null);

      const fileArray = Array.from(files);
      const remainingSlots = MAX_FILES - evidences.length;

      if (fileArray.length > remainingSlots) {
        setUploadError(`You can only upload up to ${MAX_FILES} files. ${remainingSlots} slots remaining.`);
        return;
      }

      fileArray.forEach((file) => {
        // Validate file type
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setUploadError(`Invalid file type: ${file.name}. Only images and videos are allowed.`);
          return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          setUploadError(`File too large: ${file.name}. Maximum size is 50MB.`);
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

        const evidenceFile: EvidenceFile = {
          id: generateId(),
          file,
          previewUrl,
          type: isVideo ? 'video' : 'image',
        };

        addEvidence(evidenceFile);
      });
    },
    [evidences.length, addEvidence]
  );

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle remove evidence
  const handleRemove = (id: string) => {
    const evidence = evidences.find((e) => e.id === id);
    if (evidence) {
      URL.revokeObjectURL(evidence.previewUrl);
    }
    removeEvidence(id);
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = evidences.length < MAX_FILES;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <Camera className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            Add photos or videos of the incident
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            Upload evidence to support your report. Photos and videos help verify the
            violation. Maximum {MAX_FILES} files, 50MB each.
          </p>
        </div>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-900/20">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400" />
          <div>
            <h3 className="font-medium text-danger-900 dark:text-danger-100">
              Upload Error
            </h3>
            <p className="mt-1 text-sm text-danger-700 dark:text-danger-300">
              {uploadError}
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload area */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={cn(
            'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors',
            isDragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
              : 'border-surface-300 bg-surface-50 hover:border-brand-300 hover:bg-surface-100 dark:border-surface-600 dark:bg-surface-800/50 dark:hover:border-brand-700 dark:hover:bg-surface-800'
          )}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-700">
            <Upload className="h-8 w-8 text-surface-400" />
          </div>
          <h3 className="mt-4 font-medium text-surface-900 dark:text-white">
            {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
          </h3>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            JPG, PNG, WEBP, MP4, MOV, WEBM up to 50MB each
          </p>
          <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">
            {evidences.length} of {MAX_FILES} files uploaded
          </p>
        </div>
      )}

      {/* Evidence previews */}
      {evidences.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-200">
              Uploaded Evidence ({evidences.length}/{MAX_FILES})
            </label>
            {evidences.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  evidences.forEach((e) => {
                    URL.revokeObjectURL(e.previewUrl);
                    removeEvidence(e.id);
                  });
                }}
                className="text-danger-600 hover:text-danger-700"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {evidences.map((evidence) => (
              <div
                key={evidence.id}
                className="group relative overflow-hidden rounded-xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-800"
              >
                {/* Preview */}
                <div className="aspect-video bg-surface-100 dark:bg-surface-700">
                  {evidence.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={evidence.previewUrl}
                      alt="Evidence preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={evidence.previewUrl}
                      className="h-full w-full object-cover"
                      controls={false}
                      muted
                      playsInline
                    />
                  )}
                </div>

                {/* Type indicator */}
                <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white">
                  {evidence.type === 'image' ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(evidence.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-danger-500 text-white opacity-0 transition-opacity hover:bg-danger-600 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* File info */}
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-surface-900 dark:text-white">
                    {evidence.file.name}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    {(evidence.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}

            {/* Add more button */}
            {canAddMore && (
              <button
                type="button"
                onClick={openFilePicker}
                className="flex aspect-video flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 text-surface-400 transition-colors hover:border-brand-300 hover:bg-surface-100 hover:text-brand-500 dark:border-surface-600 dark:bg-surface-800/50 dark:hover:border-brand-700 dark:hover:bg-surface-800"
              >
                <Plus className="h-8 w-8" />
                <span className="mt-2 text-sm font-medium">Add more</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any additional details about the incident..."
          rows={3}
          className={cn(
            'flex w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900',
            'placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-500',
            'border-surface-200 focus:border-brand-500 focus:ring-brand-500/20',
            'dark:border-surface-700 dark:focus:border-brand-500',
            'resize-none'
          )}
          maxLength={500}
        />
        <p className="mt-1.5 text-right text-xs text-surface-500 dark:text-surface-400">
          {description.length}/500 characters
        </p>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
        <h4 className="font-medium text-surface-900 dark:text-white">
          Tips for good evidence
        </h4>
        <ul className="mt-2 space-y-1 text-sm text-surface-600 dark:text-surface-300">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-brand-500">&#x2022;</span>
            Clearly show the license plate number
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-brand-500">&#x2022;</span>
            Capture the violation in action if possible
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-brand-500">&#x2022;</span>
            Include landmarks to help identify the location
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-brand-500">&#x2022;</span>
            Avoid blurry or low-quality images
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EvidenceUpload;
