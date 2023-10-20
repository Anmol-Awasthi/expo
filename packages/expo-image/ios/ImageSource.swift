// Copyright 2022-present 650 Industries. All rights reserved.

import ExpoModulesCore

struct ImageSource: Record, Equatable {
  @Field
  var width: Double = 0.0

  @Field
  var height: Double = 0.0

  @Field
  var uri: URL? = nil

  @Field
  var scale: Double = 1.0

  @Field
  var headers: [String: String]?

  @Field
  var cacheKey: String?

  var pixelCount: Double {
    return width * height * scale * scale
  }

  var isBlurhash: Bool {
    return uri?.scheme == "blurhash"
  }

  var isThumbhash: Bool {
    return uri?.scheme == "thumbhash"
  }

  var isPhotoLibraryAsset: Bool {
    return isPhotoLibraryAssetUrl(uri)
  }

  var isCachingAllowed: Bool {
    // TODO: Don't cache other non-network requests (e.g. data URIs, local files)
    return !isPhotoLibraryAsset
  }

  static func == (lhs: ImageSource, rhs: ImageSource) -> Bool {
    return lhs.width == rhs.width &&
    lhs.height == rhs.height &&
    lhs.uri == rhs.uri &&
    lhs.scale == rhs.scale &&
    lhs.headers == rhs.headers &&
    lhs.cacheKey == rhs.cacheKey
  }
}
