export type FileType = 'NationalCard' | 'BirthCertificate' | 'BasicInsurance';

export const FileTypesList = ['NationalCard', 'BirthCertificate', 'BasicInsurance'];

export const FileTypeEnum: Record<FileType, { ext: string, maxSize: number }[]> = {
    NationalCard: [
        { ext: process.env.upload_file_image_mime, maxSize: 10 },
        { ext: process.env.upload_file_pdf_mime, maxSize: 1 },
    ],
    BirthCertificate: [
        { ext: process.env.upload_file_image_mime, maxSize: 10 },
        { ext: process.env.upload_file_pdf_mime, maxSize: 1 },
    ],
    BasicInsurance: [
        { ext: process.env.upload_file_image_mime, maxSize: 10 },
        { ext: process.env.upload_file_pdf_mime, maxSize: 1 },
    ],
};
