export class CharacterDevice {
    static openDevice(deviceId) {
        return new CharacterDevice(CharacterDevice.#symbol, deviceId);
    }
    static closeDevice(deviceInstance) {
    }
}
