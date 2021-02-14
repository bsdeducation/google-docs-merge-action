const {JWT} = require('google-auth-library');
const {google} = require('googleapis');
const {get} = require('lodash');

const SCOPES = ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'];

const createGoogleDoc = async function ({googleServiceAccountEmail, googleServiceAccountPrivateKey, templateDocId, ownerEmailAddress, newTitle, replacements}) {
  const googleAuth = new JWT(googleServiceAccountEmail, null, googleServiceAccountPrivateKey.split('\\n').join('\n'), SCOPES);

  try {
    const drive = google.drive({version: 'v3', auth: googleAuth});

    // Make a copy of the template document, with a new title.
    const newFile = await drive.files.copy({fileId: templateDocId,resource: {name: newTitle}});
    const newFileId = get(newFile, 'data.id');

    // Give permissions for the new document.
    await drive.permissions.create({
      fileId: newFileId,
      fields: 'id',
      // transferOwnership: true,
      resource: {
        type: 'user',
        // role: 'owner',
        role: 'writer',
        emailAddress: ownerEmailAddress
      },
    });

    // Use Docs API to do search / replace on all the replacements.
    const docs = google.docs({version: 'v1', auth: googleAuth});

    const requests = Object.entries(replacements).map(([search, replace]) => {
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
      documentId: newFileId,
      resource: {
        requests,
      },
    });
    
    return {
      newFileId,
      url: `https://docs.google.com/document/d/${newFileId}/edit`,
    }
  } catch (err) {
    console.log('Failed to get doc contents: ' + err);
    return {err};
  }
};

module.exports = createGoogleDoc;
