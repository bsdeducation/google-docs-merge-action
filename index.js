const core = require('@actions/core');
const createGoogleDoc = require('./createGoogleDoc');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const googleServiceAccountEmail = core.getInput('googleServiceAccountEmail');
    const googleServiceAccountPrivateKey = core.getInput('googleServiceAccountPrivateKey');
    const templateDocId = core.getInput('templateDocId');
    const ownerEmailAddress = core.getInput('ownerEmailAddress');
    const newTitle = core.getInput('newTitle');
    const replacements = JSON.parse(core.getInput('replacements'));

    const {newFileId, url} = await createGoogleDoc({
      googleServiceAccountEmail,
      googleServiceAccountPrivateKey,
      templateDocId,
      ownerEmailAddress, newTitle, replacements
    });

    core.setOutput('newFileId', newFileId);
    core.setOutput('url', url);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
