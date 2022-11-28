import multer from 'multer';

/// Storage Config
const fileStorageEngine = multer.memoryStorage();

export const upload = multer({ storage: fileStorageEngine });
