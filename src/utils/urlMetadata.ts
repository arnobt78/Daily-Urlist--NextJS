import { getBaseUrl } from '@/lib/utils';

export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/metadata?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {};
  }
} 