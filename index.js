const core = require('@actions/core');
const createGoogleDoc = require('./createGoogleDoc');

async function run() {
  try {
    const googleServiceAccountEmail = core.getInput('googleServiceAccountEmail');
    const googleServiceAccountPrivateKey = core.getInput('googleServiceAccountPrivateKey');
    const templateDocId = core.getInput('templateDocId');
    const writerEmails = core.getInput('writerEmails');
    const newTitle = core.getInput('newTitle');
    const replacements = core.getInput('replacements');

    const {newDocId, url} = await createGoogleDoc({
      googleServiceAccountEmail,
      googleServiceAccountPrivateKey,
      templateDocId,
      writerEmails: writerEmails && writerEmails.split(/[,;|]/),
      newTitle,
      replacements: JSON.parse(replacements),
    });

    core.setOutput('newDocId', newDocId);
    core.setOutput('url', url);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
