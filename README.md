# Google Docs Merge Action

A GitHub Action to make a copy of a template Google Doc then apply some 'replacements', like a mail merge process. 

The template can include any number of placeholders like `{{userName}}` and `{{favouriteColor}}`. The `replacements` parameter to this action is a stringified object like:
```
{
  "userName": "Deadpool",
  "favouriteColor": "red"
}
```

# Prerequisites
Create a [Google Service Account](https://cloud.google.com/iam/docs/creating-managing-service-accounts)

# Usage

```yaml
- name: Prepare google docs input
  id: prepare-google-dec
  run: |
    echo ::set-output name=replacements::'{ "userName": "${{ github.event.inputs.userName }}", "favouriteColor": "red" }'
- name: 
  uses: bsdeducation/google-docs-merge-action@v0.0.1
  with:
    googleServiceAccountEmail: service-account-name@my-project.iam.gserviceaccount.com
    googleServiceAccountPrivateKey: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY }}
    templateDocId: 1yBx6HSnu_gbV2sk1nChJOFo_g3AizBhr-PpkyKAwcTg
    ownerEmailAddress: something@example.com
    newTitle: New doc title
    replacements: ${{ steps.prepare-google-doc.outputs.replacements}}
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:

<p align="center">
  <a href="https://github.com/bsdeducation/google-docs-merge-action/actions"><img alt="javscript-action status" src="https://github.com/bsdeducation/google-docs-merge-action/workflows/units-test/badge.svg"></a>
</p>


# Developing this action
## Code in Main

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)
...
```

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v0.0.1
git commit -a -m "v0.0.1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)


