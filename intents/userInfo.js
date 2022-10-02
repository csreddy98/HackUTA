const { getData, addData } = require('../database/db');

const userInfo = (entity, userId) => {
    console.log(entity, userId);
    let userInfo = getData('userInfo').filter(user => user.phone == userId)[0];
    console.log(userInfo);
    if (entity.includes("name")) {
        return `Your name is saved as *${userInfo.name}* in our records.`;
    } else if (entity.includes("phone")) {
        return `Your phone number is *${userInfo.phone}* in our records.`;
    } else if (entity.includes("address") || entity.includes("location") || entity.includes("city") || entity.includes("state")) {
        return `Your address is *${userInfo.address}* in our records.`;
    } else if (entity.includes("policy") || entity.includes("plan") || entity.includes("insurance") || entity.includes("policies")) {
        // return `Your policy number is *${"plans"}* in our records.`;
        let userPolicies = db['userPolicies'].filter(policy => policy.policyHolderId == userInfo.id);
        console.log(userPolicies);
        let policyList = "\n";
        userPolicies.forEach(policy => {
            policyList += `*_${policy.policyName}_*\n`;
            policyList += `Policy ID: *${policy.policyId}*\n`;
            policyList += `Policy Type: *${policy.policyType}*\n`;
            policyList += `Policy Amount: *$${policy.policyAmount}/-*\n`;
            policyList += `Policy Start Date: *${policy.policyStartDate}*\n`;
            policyList += `Policy End Date: *${policy.policyEndDate}*\n`;
            policyList += `Policy Status: *${policy.policyStatus}*\n\n`;
        });
        return "Your policies are: " + policyList;
    } else {
        return `Sorry, I didn't get that. Please try again.`;
    }
}

module.exports = userInfo;