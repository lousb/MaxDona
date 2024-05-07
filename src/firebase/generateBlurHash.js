const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { encode } = require('blurhash');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const fetch = require('node-fetch');

admin.initializeApp();

exports.generateBlurHash = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.

  const bucket = admin.storage().bucket(fileBucket);
  const file = bucket.file(filePath);

  // Check if the file is an image.
  if (!file.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Download the image.
  const tempFilePath = `/tmp/${filePath}`;
  await file.download({ destination: tempFilePath });

  // Resize the image to 100px width (keeping aspect ratio).
  const resizedFilePath = `/tmp/resized_${filePath}`;
  await sharp(tempFilePath).resize({ width: 100 }).toFile(resizedFilePath);

  // Generate BlurHash for the resized image.
  const [url] = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
  const blurhash = encode(await fetch(url), 4, 3);

  // Store the BlurHash value in Firestore.
  const db = admin.firestore();
  const docRef = db.collection('images').doc(filePath);
  await docRef.set({ url, blurhash });

  return null;
});
