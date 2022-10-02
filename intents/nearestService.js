const { getData, addData } = require('../database/db');

let nearestServices = (serviceType, location, userNumber) => {
    // if(serviceType.includes(["hospital"])) {
    // }
    let serviceName = "";
    let serviceTypes = {
        "Hospital": ["hospitals", "clinic", "healthcare", "health center", "medical"],
        "Car Repair": ["repair", "service", "maintenance", "wash", "car", "motorbike", "bike", "vehicle"],
        "Pet Care": ["pet", "dog", "cat", "fish", "bird", "animal", "veterinary", "veterinarian"],
    }
    Object.keys(serviceTypes).forEach(key => {
        serviceTypes[key].forEach(type => {
            if (serviceType.includes(type)) {
                serviceName = key;
            }
        });
    });
    let services = getData("servicesWithLocations").filter(service => service.serviceType == serviceName && service.zipCode == location);
    let serviceList = "\n";
    services.forEach(service => {
        serviceList += `Service Type: *${service.serviceType}*\n`;
        serviceList += `Service Name: *${service.serviceName}*\n`;
        serviceList += `Service Address: *${service.serviceAddress}*\n`;
        serviceList += `Service Phone: *${service.servicePhone}*\n\n`;
    });
    return "Your nearest services are: " + serviceList;
};

module.exports = nearestServices;