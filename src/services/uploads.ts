import api from './api';

type UploadableImage = {
  uri?: string;
  fileName?: string;
  type?: string;
};

const isRemoteImage = (uri: string) => /^https?:\/\//i.test(uri);

const getImageUri = (image: unknown) => {
  if (typeof image === 'string') {
    return image;
  }

  if (image && typeof image === 'object' && 'uri' in image) {
    return String((image as UploadableImage).uri || '');
  }

  return '';
};

const getUploadableImages = (images: unknown[]) =>
  images
    .map(image => {
      const uri = getImageUri(image).trim();

      if (!uri || isRemoteImage(uri)) {
        return null;
      }

      if (typeof image === 'string') {
        return {
          uri,
          fileName: `profile-${Date.now()}.jpg`,
          type: 'image/jpeg',
        };
      }

      const imageObject = image as UploadableImage;

      return {
        uri,
        fileName: imageObject.fileName || `profile-${Date.now()}.jpg`,
        type: imageObject.type || 'image/jpeg',
      };
    })
    .filter((image): image is Required<UploadableImage> => Boolean(image));

export const uploadProfileImages = async (images: unknown) => {
  if (!Array.isArray(images)) {
    return [];
  }

  const remoteImages = images
    .map(getImageUri)
    .filter(uri => uri && isRemoteImage(uri));
  const uploadableImages = getUploadableImages(images);

  if (!uploadableImages.length) {
    return remoteImages;
  }

  const formData = new FormData();

  uploadableImages.forEach(image => {
    formData.append('images', {
      uri: image.uri,
      name: image.fileName,
      type: image.type,
    } as any);
  });

  const response = await api.post('/api/uploads/profile-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const uploadedUrls = Array.isArray(response.data?.urls)
    ? response.data.urls.map((url: unknown) => String(url)).filter(Boolean)
    : [];

  return [...remoteImages, ...uploadedUrls];
};
