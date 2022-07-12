'use strict';

const { Driver } = require('homey');

const {cloudLogin, listDevices} = require('tp-link-tapo-connect');

class MyDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('MyDriver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    const email = this.homey.settings.get('email');
    const password = this.homey.settings.get('password');

    const cloudToken = await cloudLogin(email, password);
    const devices = await listDevices(cloudToken);
    return devices.map(d => {
      return {
        name: d.alias,
        data: {
          id: d.hwId,
        },
        store: {
          hwId: d.hwId,
        },
      };
    });
  }

}

module.exports = MyDriver;
