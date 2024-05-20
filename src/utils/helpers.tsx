export const handleCardClick = (url: string) => {
  if (url) {
    window.open(url, '_blank');
  }
};

export const extractUrl = (text: string): any => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  return urls ? urls[0] : null;
};
