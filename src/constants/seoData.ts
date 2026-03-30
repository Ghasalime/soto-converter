import { FileIcon, FileImage, FileText, FileVideo, Gift, Scissors, SlidersHorizontal, Type, Wand2, Zap } from 'lucide-react';

export interface InternalLink {
  path: string;
  label: string;
  icon: any;
  category: 'Dasar' | 'Optimasi' | 'Dokumen' | 'Kreatif';
}

export const internalLinks: InternalLink[] = [
  // Konversi Dasar
  { path: '/', label: 'WebP Converter', icon: Zap, category: 'Dasar' },
  { path: '/jpg-to-png', label: 'JPG to PNG', icon: FileImage, category: 'Dasar' },
  { path: '/png-to-jpg', label: 'PNG to JPG', icon: FileImage, category: 'Dasar' },
  { path: '/heic-to-jpg', label: 'HEIC to JPG', icon: Rocket, category: 'Dasar' },
  
  // Optimasi
  { path: '/image-compressor', label: 'Kompres Gambar', icon: SlidersHorizontal, category: 'Optimasi' },
  { path: '/image-upscaler', label: 'AI Image Enhancer', icon: Rocket, category: 'Optimasi' },
  
  // Dokumen
  { path: '/image-to-pdf', label: 'Image to PDF', icon: FileText, category: 'Dokumen' },
  { path: '/pdf-to-image', label: 'PDF to Image', icon: FileIcon, category: 'Dokumen' },
  
  // Kreatif
  { path: '/gif-to-webp', label: 'GIF to WebP', icon: Gift, category: 'Kreatif' },
  { path: '/webp-to-gif', label: 'WebP to GIF', icon: FileVideo, category: 'Kreatif' },
  { path: '/image-to-svg', label: 'Vectorize (SVG)', icon: Scissors, category: 'Kreatif' },
  { path: '/image-watermark', label: 'Watermarking', icon: Type, category: 'Kreatif' },
  { path: '/image-editor', label: 'Mini Studio', icon: Wand2, category: 'Kreatif' },
];

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif' | 'image/bmp' | 'image/svg+xml';

export const seoConfig: Record<string, { title: string; desc: string; defaultTarget: ImageFormat }> = {
  '/': {
    title: 'Soto Converter - Konversi Harian Segala Ekstensi Secara Lokal',
    desc: 'Ubah format PNG, JPG, WEBP, AVIF, HEIC, GIF sesuka Anda. Aplikasi murni berjalan tanpa mengunggah ke server manapun.',
    defaultTarget: 'image/webp'
  },
  '/jpg-to-png': {
    title: 'Convert JPG to PNG - Cepat & Aman | Soto Converter',
    desc: 'Ekstrak gambar JPG menjadi PNG berkualitas tinggi secara instan di browser Anda.',
    defaultTarget: 'image/png'
  },
  '/png-to-jpg': {
    title: 'Convert PNG to JPG - Optimasi Media | Soto Converter',
    desc: 'Ubah file PNG ke JPG dengan ukuran lebih kecil dan latar belakang putih otomatis.',
    defaultTarget: 'image/jpeg'
  },
  '/heic-to-jpg': {
    title: 'Convert HEIC to JPG Offline - Apple Photos | Soto Converter',
    desc: 'Konversi foto iPhone HEIC ke format JPG yang kompatibel di mana saja secara lokal.',
    defaultTarget: 'image/jpeg'
  },
  '/image-to-pdf': {
    title: 'Image to PDF Converter - Gabung Gambar ke PDF | Soto Converter',
    desc: 'Ubah koleksi foto Anda menjadi satu file dokumen PDF profesional secara instan.',
    defaultTarget: 'image/jpeg' // Placeholder format
  },
  '/pdf-to-image': {
    title: 'PDF to Image Converter - Ekstrak Halaman PDF | Soto Converter',
    desc: 'Ambil semua halaman dari file PDF Anda dan simpan sebagai gambar PNG/JPG berkualitas.',
    defaultTarget: 'image/png'
  },
  '/gif-to-webp': {
    title: 'GIF to WebP Converter - Animasi Ringan | Soto Converter',
    desc: 'Optimalkan animasi GIF Anda menjadi format WebP yang jauh lebih ringan dan cepat.',
    defaultTarget: 'image/webp'
  },
  '/webp-to-gif': {
    title: 'WebP to GIF Converter - Support Animasi | Soto Converter',
    desc: 'Kembalikan format WebP animasi Anda menjadi GIF standar yang didukung di semua platform.',
    defaultTarget: 'image/gif'
  },
  '/image-to-svg': {
    title: 'Vectorizer - Convert PNG/JPG to SVG | Soto Converter',
    desc: 'Ubah gambar raster Anda menjadi vektor SVG yang tajam dan tidak pecah saat diperbesar.',
    defaultTarget: 'image/svg+xml'
  },
  '/image-watermark': {
    title: 'Batch Watermark Tool - Lindungi Karya Anda | Soto Converter',
    desc: 'Tambahkan label cap air atau watermark ke banyak gambar sekaligus dengan mudah.',
    defaultTarget: 'image/webp'
  }
};
