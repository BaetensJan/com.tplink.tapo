'use strict';

const { Device } = require('homey');
const {cloudLogin, listDevices, loginDeviceByIp, getDeviceInfo, turnOn, turnOff} = require('tp-link-tapo-connect');

class P100 extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('P100 has been initialized');
    
    this.email = this.homey.settings.get('email');
    this.password = this.homey.settings.get('password');
    this.ip = this.homey.settings.get('ip');

    const cloudToken = await cloudLogin(this.email, this.password);
    const devices = await listDevices(cloudToken);
    const hwId = this.getStoreValue("hwId");

    this.device = devices.find(d => d.hwId === hwId);
    this.registerCapabilityListener("onoff", async (value) => {
      try {
        const deviceToken = await loginDeviceByIp(this.email, this.password, this.ip);
        const getDeviceInfoResponse = await getDeviceInfo(deviceToken);
        if(getDeviceInfoResponse.device_on) {
          await turnOff(deviceToken);
        } else {
          await turnOn(deviceToken);
        }
      } catch(e) {console.log(e)}
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('P100 has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('P100 settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('P100 was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('P100 has been deleted');
  }

}

module.exports = P100;
