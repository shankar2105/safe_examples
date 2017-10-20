import * as h from './helpers';
import CONSTANTS from '../../src/constants';

expect.extend({
  isXORName(received) {
    if (received.length === 32) {
      return {
        message: () => (
          `expected ${received} not to be an ArrayType`
        ),
        pass: true,
      };
    }
    return {
      message: () => (
        `expected ${received} not to be an ArrayType`
      ),
      pass: false,
    };
  },
  countObject(received, argument) {
    if (Object.keys(received).length === argument) {
      return {
        message: () => (
          `expected ${received} not to be equal to ${argument}`
        ),
        pass: true,
      };
    }
    return {
      message: () => (
        `expected ${received} not to be equal to ${argument}`
      ),
      pass: false,
    };
  },
});

describe('Smoke test', () => {
  let api = undefined;
  beforeAll(() => {
    api = h.newSafeApi();
  });

  it('Mock authorisation with Authenticator', async () => (
    await expect(api.authoriseMock()).resolves
  ));
});

describe('Create PublicName API', () => {
  let api = undefined;
  const publicName = h.randomStr();
  beforeAll(async () => {
    api = await h.authoriseApp();
  });

  it('throws error if publicName is empty', async () => (
    await expect(api.createPublicName())
      .rejects
      .toHaveProperty(h.errorCodeKey, CONSTANTS.APP_ERR_CODE.INVALID_PUBLIC_NAME)
  ));

  it(`create with name \'${publicName}\'`, async () => {
    await expect(api.createPublicName(publicName)).resolves.toBeTruthy();
    const hashPublicName = await h.sha3Hash(api, publicName);
    await expect(h.fetchPublicName(api, publicName)).resolves.toMatchObject(hashPublicName);
  });

  it(`fail to crate create dubpicate public name (name - \'${publicName}\')`, async () => {
    await expect(api.createPublicName(publicName))
      .rejects
      .toHaveProperty(h.errorCodeKey, -104);
  });
});

// describe('Fetch Public Name API', () => {
//   let api = undefined;
//   const publicName1 = h.randomStr();
//   const publicName2 = h.randomStr();
//   beforeAll(async () => {
//     api = await h.authoriseApp();
//     await api.createPublicName(publicName1);
//     await api.createPublicName(publicName2);
//   });

//   it(`fetch PublicName with names \'${publicName1}\' and \'${publicName2}\'`, async () => {
//     await expect(api.fetchPublicNames()).resolves.toHaveProperty(publicName1);
//     await expect(api.fetchPublicNames()).resolves.toHaveProperty(publicName2);
//     await expect(api.fetchPublicNames()).resolves.countObject(2);
//   });
// });

// describe('Create Service Mutable Data API', () => {
//   let api = undefined;
//   const metaFor = h.randomStr();
//   const servicePath = `_public/${metaFor}`
//   beforeAll(async () => {
//     api = await h.authoriseApp();
//   });

//   it('create new service MD', async () => {
//     await expect(api.createServiceContainer(servicePath, metaFor)).resolves.isXORName();
//   });

//   it('fail to create duplicate service MD', async () => {
//     await expect(api.createServiceContainer(servicePath, metaFor)).rejects.toHaveProperty(h.errorCodeKey, -107);
//   });
// });

// describe('Create Service API', () => {
//   let api = undefined;
//   const serviceName = h.randomStr();
//   const publicName = h.randomStr();
//   const servicePath = `_public/${serviceName}`;
//   let serviceXORName = undefined;
//   beforeAll(async () => {
//     api = await h.authoriseApp();
//     await api.createPublicName(publicName);
//     serviceXORName = await api.createServiceContainer(servicePath, serviceName);
//   });

//   it('create new service', async () => {
//     await expect(api.createService(publicName, serviceName, serviceXORName)).resolves.toBeTruthy();
//     await expect(h.fetchServiceName(api, publicName, serviceName)).resolves.toMatchObject(serviceXORName.buffer);
//   });

//   it('fail to create duplicate service', async () => {
//     await expect(api.createService(publicName, serviceName, serviceXORName)).rejects.toHaveProperty(h.errorCodeKey, -107);
//   });
// });
