import 'dart:convert';
import 'dart:io';

import 'package:convex_flutter/convex_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

/// Orchestrates the three-step upload of a media file to R2 via the
/// Convex `media:*` mutations:
///
///   1. Pick a file (image picker for now; broader picker later).
///   2. Convex `media:generateUploadUrl` → returns a signed R2 PUT URL
///      and a pre-allocated `mediaId` in `pending` status.
///   3. PUT the bytes to the URL.
///   4. Convex `media:finalizeUpload({ mediaId })` flips the row to
///      `active`, marks any prior user_photo `orphaned`, and patches
///      `users.photoMediaId`.
///
/// Failures at the PUT step trigger a `media:cancelUpload` to clean up
/// the dangling `pending` row.
class MediaService {
  MediaService._();

  static final ImagePicker _picker = ImagePicker();

  /// Pick an image from the user's photo library and upload it as the
  /// signed-in user's profile photo. Returns the new `mediaId` on
  /// success, or null if the user cancelled the picker. Throws on
  /// upload failure.
  static Future<String?> pickAndUploadUserPhoto() async {
    final pick = await _picker.pickImage(
      source: ImageSource.gallery,
      // On-device compression — keeps payloads small without bringing
      // a server-side transform pipeline. 1500px wide is generous for
      // any avatar render size we have today.
      imageQuality: 85,
      maxWidth: 1500,
    );
    if (pick == null) return null;
    return _uploadFile(File(pick.path), kind: 'user_photo');
  }

  // ── Internals ─────────────────────────────────────────────────────

  static Future<String> _uploadFile(File file, {required String kind}) async {
    final bytes = await file.readAsBytes();
    final mimeType = _mimeFromPath(file.path);

    // Step 1: ask Convex for a signed PUT URL + pre-allocated row.
    final genRaw = await ConvexClient.instance.mutation(
      name: 'media:generateUploadUrl',
      args: {
        'kind': kind,
        'mimeType': mimeType,
        'sizeBytes': bytes.length,
      },
    );
    final gen = jsonDecode(genRaw) as Map<String, dynamic>;
    final uploadUrl = gen['uploadUrl'] as String;
    final mediaId = gen['mediaId'] as String;

    // Step 2: PUT bytes directly to R2. The presigned URL embeds the
    // bucket + key + auth so we don't need to add headers beyond
    // Content-Type.
    try {
      final response = await http.put(
        Uri.parse(uploadUrl),
        headers: {'Content-Type': mimeType},
        body: bytes,
      );
      if (response.statusCode < 200 || response.statusCode >= 300) {
        await _cancel(mediaId);
        throw Exception(
          'R2 upload failed (${response.statusCode}): ${response.body}',
        );
      }
    } catch (_) {
      await _cancel(mediaId);
      rethrow;
    }

    // Step 3: tell Convex the bytes landed.
    await ConvexClient.instance.mutation(
      name: 'media:finalizeUpload',
      args: {'mediaId': mediaId},
    );
    return mediaId;
  }

  static Future<void> _cancel(String mediaId) async {
    try {
      await ConvexClient.instance.mutation(
        name: 'media:cancelUpload',
        args: {'mediaId': mediaId},
      );
    } catch (_) {
      // Best-effort. The orphaned `pending` row gets reaped by the
      // future GC cron.
    }
  }

  static String _mimeFromPath(String path) {
    final lower = path.toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.gif')) return 'image/gif';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
    return 'image/jpeg';
  }
}
