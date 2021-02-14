const createGoogleDoc = require('./createGoogleDoc');
const process = require('process');

test('createGoogleDoc', async () => {
  const issues = `#123 First one
#124 second one`;
  const googleServiceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const googleServiceAccountPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const {newFileId, url} = await createGoogleDoc({
    googleServiceAccountEmail,
    googleServiceAccountPrivateKey,
    templateDocId: '1KpPTxUmgPCiwe0kr9lc4RFqfVfN4DgT3X-0dhm0BsjA',
    ownerEmailAddress: 'nm@bsd.education',
    newTitle: 'Release Notes: r108',
    replacements: {
      date: '10th Feb 2021',
      releaseId: 'Release 108',
      newFeatures: issues,
      enhancements: issues,
      bugFixes: issues,
      dev: issues
    }
  });
  console.log('New file: ', url);
  expect(newFileId).toBeTruthy();
  expect(url).toContain(newFileId);
});