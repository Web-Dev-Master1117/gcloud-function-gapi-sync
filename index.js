'use strict';
require('dotenv/config');
const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');

const getLatestDeviceData = require('./lib');

functions.http('sync-olpc-devices', async (_, res) => {
  const storage = new Storage({
        projectId: process.env.GCP_PROJECT_ID
  });
  const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET_NAME);
  const fileName = `${process.env.GCP_STORAGE_BUCKET_FOLDER_NAME}/devices.json`;
  const file = bucket.file(fileName);
  // get the data
  const rawData = await getLatestDeviceData();
  // stringify it
  const data = rawData.map(jsonStringRow => JSON.stringify(jsonStringRow)).join('\n');

  // store to GCP storage
  await file.save(data);
  res.send({ status: 'OK' });
});
