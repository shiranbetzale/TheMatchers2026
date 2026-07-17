describe('TheMatchers application', () => {
  beforeEach(async () => {
    await device.launchApp({
      newInstance: true,
      delete: true,
      permissions: {
        notifications: 'YES',
      },
    });
  });

  it('launches without crashing', async () => {
    await device.takeScreenshot('app-launched');
  });

  it('survives a React Native reload', async () => {
    await device.reloadReactNative();
    await device.takeScreenshot('app-after-reload');
  });

  it('restores after being sent to the background', async () => {
    await device.sendToHome();
    await device.launchApp({newInstance: false});
    await device.takeScreenshot('app-restored-from-background');
  });
});
