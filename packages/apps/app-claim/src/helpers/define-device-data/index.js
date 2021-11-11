import DeviceDetector from "device-detector-js";
const deviceDetector = new DeviceDetector();


export default () => {
  const userAgent = navigator && navigator.userAgent
  if (userAgent) {
    const { client = {}, os = {}, device = {} } = deviceDetector.parse(userAgent)
    return {
      browser: `${client.name} ${client.version}`,
      device: `${device.brand || ''} ${os.name || ''} ${os.version || ''}`
    }
  }
  return {}
}

