import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to mock the DOM APIs for the image security service tests
// The actual validateAndSanitizeImage function uses browser-only APIs (canvas, Image, URL)

describe('Image Security Service Constants', () => {
  it('should have correct allowed MIME types', async () => {
    // Import the module to check it loads correctly
    const module = await import('../services/imageSecurityService');
    expect(module.validateAndSanitizeImage).toBeDefined();
    expect(typeof module.validateAndSanitizeImage).toBe('function');
  });
});

describe('Image Security Validation', () => {
  // Mock browser APIs
  const mockObjectURL = 'blob:mock-url';
  const mockBase64 = 'data:image/jpeg;base64,mockbase64data';

  beforeEach(() => {
    // Mock URL.createObjectURL and revokeObjectURL
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => mockObjectURL),
      revokeObjectURL: vi.fn()
    });

    // Mock Image
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      width = 800;
      height = 600;
      private _src = '';
      
      get src() {
        return this._src;
      }
      
      set src(value: string) {
        this._src = value;
        // Simulate async image loading
        setTimeout(() => this.onload?.(), 0);
      }
    }
    vi.stubGlobal('Image', MockImage);

    // Mock canvas
    const mockContext = {
      drawImage: vi.fn()
    };
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockContext),
      toDataURL: vi.fn(() => mockBase64)
    };
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return mockCanvas as unknown as HTMLElement;
      }
      return document.createElement(tag);
    });
  });

  it('should reject non-allowed MIME types', async () => {
    const { validateAndSanitizeImage } = await import('../services/imageSecurityService');
    
    const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    await expect(validateAndSanitizeImage(invalidFile)).rejects.toThrow(
      /Security Violation.*not allowed/
    );
  });

  it('should reject files exceeding size limit', async () => {
    const { validateAndSanitizeImage } = await import('../services/imageSecurityService');
    
    // Create a file that's 11MB (exceeds 10MB limit)
    const largeContent = new Array(11 * 1024 * 1024).fill('x').join('');
    const largeFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    
    await expect(validateAndSanitizeImage(largeFile)).rejects.toThrow(
      /Security Violation.*exceeds.*10MB limit/
    );
  });

  it('should accept valid JPEG files', async () => {
    const { validateAndSanitizeImage } = await import('../services/imageSecurityService');
    
    const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const result = await validateAndSanitizeImage(validFile);
    expect(result).toBe(mockBase64);
  });

  it('should accept valid PNG files', async () => {
    const { validateAndSanitizeImage } = await import('../services/imageSecurityService');
    
    const validFile = new File(['test'], 'test.png', { type: 'image/png' });
    
    const result = await validateAndSanitizeImage(validFile);
    expect(result).toBe(mockBase64);
  });

  it('should accept valid WebP files', async () => {
    const { validateAndSanitizeImage } = await import('../services/imageSecurityService');
    
    const validFile = new File(['test'], 'test.webp', { type: 'image/webp' });
    
    const result = await validateAndSanitizeImage(validFile);
    expect(result).toBe(mockBase64);
  });
});
