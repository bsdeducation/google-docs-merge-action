const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const {JWT} = require('google-auth-library');
const {google} = require('googleapis');
const {get} = require('lodash');

dayjs.extend(advancedFormat);

const SCOPES = ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'];

function getDefaultReplacements(replacements) {
  const keys = Object.keys(replacements);
  const defaultReplacements = [];
  if (!keys.includes('date')) {
    defaultReplacements.push({
      replaceAllText: {
        containsText: {
          text: `{{date}}`,
          matchCase: true,
        },
        replaceText: dayjs().format('Do MMMM YYYY'),
      }
    });
  }
  return defaultReplacements;
}

const createGoogleDoc = async function ({googleServiceAccountEmail, googleServiceAccountPrivateKey, templateDocId, writerEmails, newTitle, replacements}) {
  const googleAuth = new JWT({
    email: googleServiceAccountEmail, 
    key: googleServiceAccountPrivateKey.split('\\n').join('\n'),
    scopes: SCOPES,
  });
  const drive = google.drive({version: 'v3', auth: googleAuth});

  // Make a copy of the template document, with a new title.
  const resource = {};
  if (newTitle) {
    resource.name = newTitle;
  }
  const newFile = await drive.files.copy({fileId: templateDocId, resource});
  const newDocId = get(newFile, 'data.id');

  // Give write permissions for the new document.
  if (writerEmails) {
    // Note - we only provide 'writer' permissions at the moment.
    // It's not always possible to change the owner. The service account might not be in the same organisation as the target owner.
    for (const emailAddress of writerEmails) {
      await drive.permissions.create({fileId: newDocId, fields: 'id', resource: {type: 'user', role: 'writer', emailAddress}});
    }
  }
  
  // Use Docs API to do search / replace on all the replacements.
  const docs = google.docs({version: 'v1', auth: googleAuth});

  const customReplacements = Object.entries(replacements).map(([search, replace]) => {
    return {
      replaceAllText: {
        containsText: {
          text: `{{${search}}}`,
          matchCase: true,
        },
        replaceText: replace,
      }
    };
  });

  await docs.documents.batchUpdate({
    documentId: newDocId,
    resource: {
      requests: [...customReplacements, ...getDefaultReplacements(replacements)],
    },
  });
  
  return {
    newDocId,
    url: `https://docs.google.com/document/d/${newDocId}/edit`,
  }
};

module.exports = createGoogleDoc;
