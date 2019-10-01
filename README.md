# Focals Developer API Client Library

This library is designed to help make the process of creating Abilities for Focals easier by making it simpler to encrypt and decrypt content, retrieve public keys for users, and URL generation for interacting with the Focals Developer API.

The Focals Developer API, Developer Portal, and Client Library are in alpha and are liable to change significantly.

## Usage
Install the library using:  
`npm i fda-client`

### Init
Before using the library, call the `init` function during your startup code. To make full use of the library, you need to provide your API Key and Secret, your ability's Integration ID, as well as your Shared Secret and your Private Key:  
```
const configInit = require('north-client-library').init;
configInit({
                apiSecret: '<YOUR API SECRET>',
                apiKey: '<YOUR API KEY>',
                sharedSecret: '<YOUR SHARED SECRET>',
                privateKey: '<YOUR PRIVATE KEY>',
                integrationId: '<YOUR INTEGRATION ID>',
            });
```
This is done to to store the values in an object in the library, to reduce the number of parameters passed to each function.  
The values you need can be found on the ability page on the [Developer Portal](https://developer.bynorth.com)

#### Optional Values
**baseUrl**   
This is reserved in the event that test environments are opened up to external developers in the future, and as such isn't needed yet.  
**signingVersion**  
This option will be used when future signing versions are introduced, however there is only one option available at present, so the value doesn't need to be set

### Device Keys
In order to perform encryption you need to have the public key for the intended recipient. In order to simplify this process, you can use the provided `DeviceKeysService`.  
Simply pass the `userId` of the user (received as part of the enable flow), and the service will make the web request and return an array of retrieved public keys:  
```
const deviceKeysService = require('north-client-library').DeviceKeysService;

const publicKeys = deviceKeysService.getPublicKeys('userId');
```

### Encryption/Decryption
This library includes functionality to ease the implementation of end-to-end encryption when developing against the Focals Developer API by providing functions to encrypt a provided package, that only the recipient will be able to decrypt, and a function to decrypt a package intended for your ability.

#### Encryption
To encrypt a packet you call the `encryptPacket` function, passing in as parameters:
- The packet object
- An array of JSON pointers on the packet to encrypt, following [RFC-6901](https://tools.ietf.org/html/rfc6901)
- An array of public keys to use for encryption (retrieved using the above `DeviceKeysService` in this library)
```
const encryptionService = require('north-client-library').EncryptionService;

const encryptedPacket = encryptionService.encryptPacket(input, pathsToEncrypt, publicKeys);
```

Further information on how end-to-end encryption works can be found here: [https://github.com/focalsbynorth/abilities-library/docs/encryption.md](https://github.com/focalsbynorth/abilities-library/docs/encryption.md)

#### Decryption
To decrypt a packet you call the `decryptPacket` function, passing in as a parameter the encrypted packet object. This function will use the private key that was set during `init`.  
If no private key is detected, an exception will be raised.
```
const encryptionService = require('north-client-library').EncryptionService;

const decryptedPacket = encryptionService.decryptPacket(input);
```

### Signature Verification
The `SignatureService` provides a way to easily verify signatures received. To use this functionality you need to have configured your shared secret during `init`.  
Call the `verifySignature` function, passing in as parameters:
- The received `state`
- The received `timestamp`
- The received `signature`
```
const signatureService = require('north-client-library').SignatureService;

const isValid = signatureService.verifySignature('<RECEIVED STATE>', '<RECEIVED TIMESTAMP>', '<RECEIVED SIGNATURE>');
```
The function will generate the HMAC signature using the timestamp and state, and your configured shared secret, and verify the received signature against that. The function will return a boolean value to indicate whether or not the signature is valid.

### URLs
The `UrlService` is used to make generating URLs to interact with the Focals Developer API easier.  
This currently consists of a builder to generate the `enable` URL to allow a user to enable your ability. To indicate a success, simply call the function passing in the previously received `state` as a parameter. If there was an error, you can pass through both the `state` and the encountered error:  
```
const urlService = require('north-client-library').UrlService;

const enableUrl = urlService.buildEnableUrl('<STATE>');
// Or if there was an error:
const enableUrl = urlService.buildEnableUrl('<STATE>', '<ERROR>');
```

### Publishing Packets to Users
The `PublishService` is used to handle publishing packets to users through the Focals Developer API possible with minimal effort.
There are two ways to publish packets to users:
- Standard
    - This is used when there is no personally identifiable information in your packets
- Encrypted
    - Use this to send sensitive data that has previously been encrypted using the `EncryptionService`
Both approaches require you to pass in the targets `userId`, as well as the `packet` to publish - the packet is the object that should change depending on which approach you follow:
```
const publishService = require('north-client-library').PublishService;

const response = publishService.publishToUser('userId', '<YOUR PACKET>');
const encryptedResponse = publishService.encryptedPublishToUser('userId', '<YOUR ENCRYPTED PACKET>');
```
