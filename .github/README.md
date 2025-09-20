# GitHub Actions CI/CD Configuration

This document describes how to set up and configure the GitHub Actions CI/CD pipeline for the Sendbird UIKit React Native project.

## Overview

The GitHub Actions workflow handles automated deployment of both iOS and Android sample applications using modern authentication methods and optimized caching strategies.

## Required GitHub Secrets

### Shared

- **SENDBIRD_APP_ID**
  - Your Sendbird application ID
  - Used to configure the sample app environment

### Android Deployment

- **FASTLANE_ANDROID_SERVICE_ACCOUNT**
  - Create service account with Firebase App Distribution role from Google Cloud Console
  - Download JSON key file
  - Encode as base64: `cat service-account.json | base64`
  - Save encoded text to GitHub Secrets
  - Decoding reference: `echo "encoded-base64-text" | base64 --decode`

- **FASTLANE_ANDROID_APP_ID**
  - Open your Firebase project settings → General
  - Find your Android app (formatted like `1:xxxxxxxxxxxxxxxx:android:xxxxx`)
  - Save app ID to GitHub Secrets

### iOS Deployment

#### App Store Connect API Authentication (Recommended)

- **APP_STORE_CONNECT_API_KEY_ID**
  - API Key ID from App Store Connect
  - Format: 10-character alphanumeric string (e.g., `D83848D23B`)

- **APP_STORE_CONNECT_API_ISSUER_ID**
  - API Key Issuer ID from App Store Connect
  - Format: UUID (e.g., `227b0bbf-ada8-458c-9d62-3d8022b7d07f`)

- **APP_STORE_CONNECT_API_KEY**
  - Private key content from the downloaded `.p8` file
  - Include the full key with headers:
    ```
    -----BEGIN PRIVATE KEY-----
    [Key content]
    -----END PRIVATE KEY-----
    ```

#### Certificate Management

- **FASTLANE_IOS_MATCH_GIT_URL**
  - SSH URL to the private repository storing certificates
  - Format: `git@github.com:organization/certificates-repo.git`
  - Must use SSH format for authentication

- **FASTLANE_IOS_MATCH_GIT_PRIVATE_KEY**
  - SSH private key for accessing the match repository
  - Generate with: `ssh-keygen -t rsa -b 4096 -C "github-actions@sendbird.com"`
  - Add the public key to the certificates repository as a deploy key
  - Save the private key content to GitHub Secrets

- **FASTLANE_IOS_MATCH_PASSWORD**
  - Password used to encrypt/decrypt certificates in the match repository
  - Can be found in the match repository

## How to Generate App Store Connect API Key

1. **Login to App Store Connect**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Sign in with your Apple ID

2. **Navigate to API Keys**
   - Users and Access → Integrations → App Store Connect API

3. **Create New API Key**
   - Click "Generate API Key"
   - Set name: `GitHub Actions - Sendbird UIKit`
   - Select access: `Developer` role
   - Download the `.p8` file immediately (cannot re-download)

4. **Configure GitHub Secrets**
   - **Key ID**: Copy from the API key details page
   - **Issuer ID**: Copy from the API key details page
   - **Key Content**: Copy entire content of the `.p8` file

## Workflow Features

### Caching Strategy
- **Node.js Dependencies**: Cached based on `yarn.lock` hash
- **CocoaPods**: Cached based on `Podfile.lock` hash with validation
- **Ruby Gems**: Cached automatically by `ruby/setup-ruby` action

### Security
- **SSH Authentication**: For accessing private certificate repositories
- **API Key Authentication**: Modern App Store Connect authentication
- **Secret Validation**: Pre-flight checks for required environment variables

### Platform Support
- **iOS**: Automatic TestFlight deployment
- **Android**: Firebase App Distribution deployment
- **Conditional Execution**: Platform-specific deployment based on input selection

## Troubleshooting

### Common Issues

1. **Pod Cache Validation Failures**
   - Clear GitHub Actions cache for the repository
   - Actions → Caches → Delete affected cache entries

2. **SSH Authentication Failures**
   - Verify the private key format (include headers and footers)
   - Check if the public key is added to the certificates repository

3. **App Store Connect API Errors**
   - Verify all three API key components are correctly set
   - Ensure the API key has sufficient permissions
   - Check the `.p8` file content format

## Maintenance

- **API Keys**: Renew App Store Connect API keys before expiration (typically 1 year)
- **Certificates**: Monitor certificate expiration dates in the match repository
- **SSH Keys**: Rotate SSH keys periodically for security
- **Dependencies**: Keep fastlane and related tools updated
