export interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  previewUrl: string;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateCategory {
  id: number;
  name: string;
  description?: string;
}

export interface TemplateDownload {
  id: number;
  templateId: number;
  userId?: number;
  downloadedAt: Date;
  ipAddress?: string;
  userAgent?: string;
} 