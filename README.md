# Bottleneck Analysis App

### Contents

- [Introduction](#intro)
- [Project Structure](#project-structure)
- [Pre-requisites](#pre-requisites)
- [Getting started](#started)
- [Running the app](#running)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)

## <a name="intro">Introduction<a/>

Bottleneck analysis (BNA) is a structured analysis of the determinants of coverage for a wide range of interventions
delivered through the health sector, useful to supporting targeted operational planning. It is a systematic,
outcome-based approach to equitable health programming and real-time monitoring that strengthens the health system,
complementing and building on what exists.

The BNA App is developed and maintained by the HISP Community (UiO, HISP-Tanzania and HISP Uganda) in collaboration with
UNICEF.

## <a name="project-structure">Project Structure<a/>

The project is divided into 4 main modules:

### Intervention

This module include all intervention viewing and analysis features. It's sub-modules include:

- Intervention Header: Lists all the accessible interventions
- BNA chart (Analysis chart): View of the Determinants in a bar chart
- Sub-Level analysis: Has 3 parts, Sub level table analysis, Sub level map, and Indicator dictionary for the configured
  determinants
- Root cause analysis: Allows management of root causes based on the configured determinants.

### Intervention Configuration

This module includes all intervention configuration features. This is done in 3 steps:

- Step 1: Includes name, period, organisation unit, legend definitions, and map configuration
- Step 2: Includes determinants selection and configuration
- Step 3: Includes sharing settings

### Archiving

This module contains the archiving feature. It allows view and management of archived interventions.

### Migration

This module contains features that allow auto-migration of intervention configuration from the previous BNA versions to
the new version.

## <a name="pre-requisites" >Pre-requisites</a>

This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform). To start
development you require:

- Node - 16.x or later
- Yarn - 1.22.19 or later

## <a name="started" >Getting started</a>

To get started with the project, clone the project into your local environment

```shell
git clone https://github.com/hisptz/bottleneck-analysis-app
```

Then open your project and run:

```shell
 yarn install
```

## <a name="running" >Running the app</a>

To start the app in development mode run:

### `yarn start`

This command runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `.env` file Usage

To avoid having to specify the server URL everytime you start the app, you can duplicate the `.env.example` file and
rename it to `.env`. Then change the `REACT_APP_DHIS2_BASE_URL` variable to the URL of your DHIS2 instances

#### CORS issues

When running in development mode, you may encounter CORS error. To fix this issue, proxy your DHIS2 instance by
appending `--proxy http://link-to-dhis2-instance` to the start command. This will start a local proxy server
at `http://localhost:8080` (It may change ports if 8080 is busy)
. You can then point your app to `http://localhost:8080`

## <a name="building" >Building</a>

To build your app ready for production run:

### `yarn build`

This command builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

## <a name="testing" >Testing</a>

In the project directory, you can run:

### `yarn test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

To run end-to-end testing, use:

### `yarn e2e:open`

To open the cypress test runner or use:

### `yarn e2e:run`

To run the tests without opening the runner

## <a name="deployment">Deployment</a>

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App
Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.
