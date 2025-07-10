# Keyforge Client SDK

The client-side library for interacting with the Keyforge public API.

Documentation is available [here](https://docs.keyforge.dev).

## Install

```bash
npm install @keyforge/client
# or
pnpm add @keyforge/client
# or
yarn add @keyforge/client
```

## Usage

### Validate license

To validate a license through the Keyforge API, use `validateLicense`.

```js
import { validateLicense } from '@keyforge/client';

const { isValid } = await validateLicense({
  licenseKey: '...',
  productId: '...',
  deviceIdentifier: '...',
});
```

### Activate license

To activate a license through the Keyforge API, use `activateLicense`.

```js
import { activateLicense } from '@keyforge/client';

const { isValid } = await activateLicense({
  licenseKey: '...',
  productId: '...',
  deviceIdentifier: '...',
  deviceName: '...',
});
```

### Manage license tokens

License tokens allow licenses to be validated wihout an internet connection.

#### Validate and refresh token

To validate and automatically refresh the token when needed, use `validateAndRefreshToken`. It should be used when the app starts.

```js
import { validateAndRefreshToken } from '@keyforge/client/token';

const { isValid, token } = await validateAndRefreshToken({
  token: getStoredToken(), // current token
  publicKeyJwk: '...' // in JSON string or object format
  deviceIdentifier: '...',
  productId: '...',
});

if(isValid){
  storeToken(token); // store token if it was refreshed
}
```

#### Verify token

To verify a token without refreshing it, use `verifyToken`. It should be used for periodic token checks.

```js
import { verifyToken } from '@keyforge/client/token';

const { isValid } = await verifyToken({
  token: getStoredToken(),
  publicKeyJwk: '...',
  deviceIdentifier: '...',
  productId: '...',
});
```

#### Retrieve new token

To retrieve a new token from the API, use `fetchToken`.

```js
import { fetchToken } from '@keyforge/client/token';

const { isValid, token } = await fetchToken({
  licenseKey: '...',
  deviceIdentifier: '...',
  productId: '...',
});

if (isValid) {
  storeToken(token); // store the new token
}
```

> [!NOTE]
> The `fetchToken` function does not verify if the new token is valid. You should always verify the new token.

## License

MIT License
