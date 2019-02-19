[![Build Status](https://travis-ci.org/hisptz/bottleneck-analysis-app.svg?branch=develop)](https://travis-ci.org/hisptz/bottleneck-analysis-app)
[![dependencies Status](https://david-dm.org/hisptz/bottleneck-analysis-app/status.svg)](https://david-dm.org/hisptz/bottleneck-analysis-app)
[![Maintainability](https://api.codeclimate.com/v1/badges/0591d8a3672629944a9d/maintainability)](https://codeclimate.com/github/hisptz/bottleneck-analysis-app/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0591d8a3672629944a9d/test_coverage)](https://codeclimate.com/github/hisptz/bottleneck-analysis-app/test_coverage)

# Bottleneck Analysis app

The Bottleneck analysis app is a DHIS2 based application which is envisioned to provide real-time access to data to facilitate decision making at all levels and allow end-users to conduct bottleneck analysis, produce meaningful visualizations, and archive identified bottlenecks, root causes, and solutions; with the aim of guiding operational planning, tracking progress and performance over time and strengthening accountability for better results

## Setup

Run `npm install` to install all required dependencies for the app

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`.

This command will require proxy-config.json file available in the root of your source code, usually this file has this format

```
{
  "/api": {
    "target": "https://play.dhis2.org/2.29/",
    "secure": "false",
    "auth": "admin:district",
    "changeOrigin": "true"
  },
  "/": {
    "target": "https://play.dhis2.org/2.29/",
    "secure": "false",
    "auth": "admin:district",
    "changeOrigin": "true"
  }
}

```

We have provided `proxy-config.example.json` file as an example, make a copy and rename to `proxy-config.json`

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/`, this will included a zip file ready for deploying to any DHIS2 instance.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
