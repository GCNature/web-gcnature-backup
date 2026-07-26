import path from 'path';
import fs from 'fs';

/**
 * Automatically syncs an uploaded file from the public directory to the dist directory
 * so it is immediately served by Apache/NGINX in production without rebuild.
 * 
 * @param relativePath Folder path relative to public/ e.g., 'products', 'reviews', 'uploads/banners'
 * @param filename Filename of the uploaded file
 */
export function syncFileToDist(relativePath: string, filename: string) {
  try {
    const publicPath = path.resolve(__dirname, '../../../public', relativePath);
    const distPath = path.resolve(__dirname, '../../../dist', relativePath);
    
    // Ensure dist subfolder exists
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }
    
    const srcFile = path.join(publicPath, filename);
    const destFile = path.join(distPath, filename);
    
    console.log(`[FileSync] Debug: __dirname = ${__dirname}`);
    console.log(`[FileSync] Debug: publicPath = ${publicPath}`);
    console.log(`[FileSync] Debug: distPath = ${distPath}`);

    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`[FileSync] Synced ${filename} from public/${relativePath} to dist/${relativePath}`);
    } else {
      console.warn(`[FileSync] Source file not found: ${srcFile}`);
    }
  } catch (error) {
    console.error(`[FileSync] Error syncing file ${filename} to dist:`, error);
  }
}

/**
 * Automatically deletes a file from the dist directory when it is deleted from public.
 */
export function deleteFileFromDist(relativePath: string, filename: string) {
  try {
    const distPath = path.resolve(__dirname, '../../../dist', relativePath);
    const destFile = path.join(distPath, filename);
    if (fs.existsSync(destFile)) {
      fs.unlinkSync(destFile);
      console.log(`[FileSync] Deleted ${filename} from dist/${relativePath}`);
    }
  } catch (error) {
    console.error(`[FileSync] Error deleting file ${filename} from dist:`, error);
  }
}

/**
 * Automatically renames a file in the dist directory when it is renamed in public.
 */
export function renameFileInDist(relativePath: string, oldFilename: string, newFilename: string) {
  try {
    const distPath = path.resolve(__dirname, '../../../dist', relativePath);
    const oldFile = path.join(distPath, oldFilename);
    const newFile = path.join(distPath, newFilename);
    
    // Ensure dist directory exists
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }

    if (fs.existsSync(oldFile)) {
      fs.renameSync(oldFile, newFile);
      console.log(`[FileSync] Renamed in dist: ${oldFilename} -> ${newFilename} inside dist/${relativePath}`);
    } else {
      // If the old file wasn't in dist, try to copy the new file from public
      const publicPath = path.resolve(__dirname, '../../../public', relativePath);
      const newSrcFile = path.join(publicPath, newFilename);
      if (fs.existsSync(newSrcFile)) {
        fs.copyFileSync(newSrcFile, newFile);
        console.log(`[FileSync] Copied new renamed file ${newFilename} from public/${relativePath} to dist/${relativePath}`);
      }
    }
  } catch (error) {
    console.error(`[FileSync] Error renaming file in dist from ${oldFilename} to ${newFilename}:`, error);
  }
}
