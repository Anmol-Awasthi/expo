import NativeVideoModule from './NativeVideoModule';

/**
 * Returns whether the current device supports Picture in Picture (PiP) mode.
 *
 * @returns A `boolean` which is `true` if the device supports PiP mode, and `false` otherwise.
 * @platform android
 * @platform ios
 */
export function isPictureInPictureSupported(): boolean {
  return NativeVideoModule.isPictureInPictureSupported();
}

/**
 * Cleans all video cache.
 * > This function should be called only if there are existing `VideoPlayer` instances.
 *
 * @returns A promise that fulfills after the cache has been cleaned.
 * @platform android
 * @platform ios
 */
export function cleanVideoCacheAsync(): Promise<void> {
  return NativeVideoModule.cleanVideoCacheAsync();
}

/**
 * Sets desired video cache size in bytes. The default video cache size is 1GB. Value set by this function is persistent.
 * The cache size is not guaranteed to be exact and the actual cache size may be slightly larger. The cache is evicted on a least-recently-used basis.
 * > This function should be called only if there are existing `VideoPlayer` instances.
 *
 * @returnss A promise that fulfills after the cache size has been set.
 * @platform android
 * @platform ios
 */
export function setVideoCacheSizeAsync(sizeBytes: number): Promise<void> {
  return NativeVideoModule.setVideoCacheSizeAsync(sizeBytes);
}

/**
 * Returns the space currently occupied by the video cache in bytes.
 *
 * @platform android
 * @platform ios
 */
export function getCurrentVideoCacheSize(): number {
  return NativeVideoModule.getCurrentVideoCacheSize();
}
