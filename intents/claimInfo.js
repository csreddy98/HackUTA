const { getData, addData } = require('../database/db');

const claimInfo = (userId) => {
    console.log(userId);
    let claims = getData('claims').filter(claim => claim.claimUserId == userId);
    let claimList = "\n";
    claims.forEach(claim => {
        claimList += `Claim Type: *${claim.claimType}*\n`;
        claimList += `Claim Amount: *$${claim.claimAmount}/-*\n`;
        claimList += `Claim End Date: *${claim.claimDescription}*\n`;
        claimList += `Claim Start Date: *${claim.claimRaisedOn}*\n`;
        claimList += `Claim Status: *${claim.claimStatus}*\n\n`;
    });
    return "Your claims are: " + claimList;
}
module.exports = claimInfo;