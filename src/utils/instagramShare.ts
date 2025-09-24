import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';

export const shareToInstagramStory = async (canvas: HTMLCanvasElement): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Web fallback - download image
      const link = document.createElement('a');
      link.download = 'bingo-story.png';
      link.href = canvas.toDataURL();
      link.click();
      return false;
    }

    // Convert canvas to base64
    const base64Data = canvas.toDataURL('image/png').split(',')[1];
    
    // Save to temporary file
    const fileName = `bingo_${Date.now()}.png`;
    const result = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache,
    });

    const platform = Capacitor.getPlatform();
    
    if (platform === 'android') {
      // Android - Use Intent to open Instagram Story
      return await openInstagramStoryAndroid(result.uri);
    } else if (platform === 'ios') {
      // iOS - Use URL scheme to open Instagram Story
      return await openInstagramStoryIOS(result.uri);
    }
    
    return false;
  } catch (error) {
    console.error('Failed to share to Instagram Story:', error);
    return false;
  }
};

const openInstagramStoryAndroid = async (fileUri: string): Promise<boolean> => {
  try {
    // Try to open Instagram Story with the image using URL scheme
    await Browser.open({
      url: `instagram://story-camera`
    });
    
    return true;
  } catch (error) {
    console.error('Android Instagram Story share failed:', error);
    
    // Fallback - open Instagram in browser
    try {
      await Browser.open({
        url: 'https://www.instagram.com/'
      });
      return false;
    } catch {
      return false;
    }
  }
};

const openInstagramStoryIOS = async (fileUri: string): Promise<boolean> => {
  try {
    // iOS Instagram Story URL scheme
    await Browser.open({
      url: `instagram-stories://share`
    });
    
    return true;
  } catch (error) {
    console.error('iOS Instagram Story share failed:', error);
    
    // Fallback - open Instagram in browser
    try {
      await Browser.open({
        url: 'https://www.instagram.com/'
      });
      return false;
    } catch {
      return false;
    }
  }
};