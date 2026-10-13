# Music Player

This project now uses React, Vite, and Vitest with npm. Use Node.js
20.19+ or 22.12+ (Node 22 is used in CI).

```sh
npm ci --include=dev
npm audit --include=dev --audit-level=low
npm test
npm run build
```

`npm start` starts Vite at http://localhost:5173. Production output is in
`dist/`, which is tracked in this repository. There are no configured lint or
type-check scripts. CI checks the complete dependency tree, tests, and build on
pushes and pull requests; any audit finding fails the job. Scheduled dependency
update PRs and automated security-update PRs are disabled. Security alerts remain
enabled.

The October 2026 dependency security update resolves Browserslist to 4.29.3,
Nano ID to 3.3.20, and PostCSS to 8.5.30. The actual GitHub advisory IDs are
[GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g),
[GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w),
[GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849), and
[GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q).
PostCSS also exceeds the 8.5.23 minimum for the later incomplete-fix advisory.

These packages are indirect build dependencies: the React Vite plugin brings in
Babel and its compilation targets helper, which uses Browserslist. Vite uses
PostCSS, which uses Nano ID and source-map-js. Vitest also uses Vite.
Vite 7.3.7 and Vitest 4.1.11 address additional development-tool alerts; compatible
Babel and jsdom's ws dependencies were updated as well. No new overrides were
needed; the existing Babel runtime override remains.

The player uses iTunes genre searches and an in-memory playlist/autopilot queue.
It has no volume control, persistent saved data, free-text search, or AI service.
Regression tests mock API responses and media methods/events to check filtering,
queue advancement/selection, seeking, playback controls, and genre switching.
Real remote audio playback and API availability require a manual browser check.

## Historical Create React App documentation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
