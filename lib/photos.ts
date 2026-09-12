export interface Photo {
  id: string;
  url: string;
  isHeic: boolean;
}

const RAW = [
  { id: "IMG_8045", format: "heic" },
  { id: "IMG_8047", format: "heic" },
  { id: "IMG_8041", format: "jpg" },
  { id: "IMG_8030", format: "jpg" },
  { id: "IMG_8028", format: "heic" },
  { id: "IMG_8064", format: "heic" },
  { id: "IMG_8026", format: "jpg" },
  { id: "IMG_8033", format: "jpg" },
  { id: "IMG_8050", format: "jpg" },
  { id: "IMG_8054", format: "heic" },
];

const SUFFIX: Record<string, string> = {
  IMG_8045: "hzyzsc",
  IMG_8047: "uav0vv",
  IMG_8041: "ueaxkk",
  IMG_8030: "iqbj5t",
  IMG_8028: "dh4iqr",
  IMG_8064: "iyqyn2",
  IMG_8026: "sgnunr",
  IMG_8033: "nsdn5b",
  IMG_8050: "ekqlng",
  IMG_8054: "bvbtwe",
};

const CLOUD_BASE =
  "https://res.cloudinary.com/dx3k7hbnc/image/upload";
const VERSION = "v1789228440"; // any valid version works for delivery

// f_auto,q_auto handles heic -> browser-friendly format automatically
export const PHOTOS: Photo[] = RAW.map(({ id, format }) => ({
  id,
  isHeic: format === "heic",
  url: `${CLOUD_BASE}/f_auto,q_auto/${VERSION}/${id}_${SUFFIX[id]}`,
}));

export const HERO_PHOTO_URL = `${CLOUD_BASE}/f_auto,q_auto,e_blur:200/v1789228439/IMG_8064_iyqyn2`;
