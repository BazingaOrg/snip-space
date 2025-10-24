export const MOTION = {
  duration: {
    xxs: 120,
    xs: 180,
    sm: 240,
  },
  easing: {
    mac: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export const IMAGE_LIMIT = 10 * 1024 * 1024; // 10 MB limit for uploads

export const ENTRY_IMAGES_BUCKET = "entry-images";
