export type UploadedPicture = {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
};

export type UploadPicturesType = {
  images: UploadedPicture[];
  maxImages?: number;
  onChange: (images: UploadedPicture[]) => void;
};
