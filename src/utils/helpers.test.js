import { handleCardClick,extractUrl } from "./helpers";
// Mock window.open
global.open = jest.fn();

describe('handleCardClick', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open the URL in a new tab if the URL is provided', () => {
    const url = 'https://example.com';
    handleCardClick(url);
    expect(global.open).toHaveBeenCalledWith(url, '_blank');
  });

  it('should not open a new tab if the URL is not provided', () => {
    handleCardClick(null);
    expect(global.open).not.toHaveBeenCalled();
  });
});

describe('extractUrl', () => {
  it('should return the first URL if present in the text', () => {
    const text =
      'Check this link: https://example.com and this one: https://another-example.com';
    const result = extractUrl(text);
    expect(result).toBe('https://example.com');
  });

  it('should return null if no URL is present in the text', () => {
    const text = 'No URLs here!';
    const result = extractUrl(text);
    expect(result).toBeNull();
  });

  it('should handle empty text input', () => {
    const text = '';
    const result = extractUrl(text);
    expect(result).toBeNull();
  });

  it('should handle text with only spaces', () => {
    const text = '     ';
    const result = extractUrl(text);
    expect(result).toBeNull();
  });

  it('should return the correct URL when multiple URLs are present', () => {
    const text = 'Here are two links: https://first.com and https://second.com';
    const result = extractUrl(text);
    expect(result).toBe('https://first.com');
  });

  it('should handle text with a URL at the end', () => {
    const text = 'Check out this site: https://example.com';
    const result = extractUrl(text);
    expect(result).toBe('https://example.com');
  });

  it('should handle text with a URL at the beginning', () => {
    const text = 'https://example.com is a great site!';
    const result = extractUrl(text);
    expect(result).toBe('https://example.com');
  });
});
