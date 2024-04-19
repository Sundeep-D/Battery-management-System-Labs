// created by Sundeep Dayalan at 2024/04/18 18:58.
// Website:  www.sundeepdayalan.in
// Email: contact@sundeepdayalan.in
const db_name = "skybms";
const MongoConnectionString = `mongodb://skybms:12345678@localhost:27017/?authSource=${db_name}`;
// 204.236.220.172

//mongo db collections
const collection_arduino_raw_data = "arduino_data";


function getTimestamp() {
    // return new Date(Date.now()).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
    // return new Date().toUTCString();
    return new Date(Date.now());

}

function getTimestampHumanReadableFormat() {
    // return new Date(Date.now()).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
    return new Date().toUTCString();
    // return new Date(Date.now());

}


 

module.exports = {
    db_name,
    MongoConnectionString,
    collection_arduino_raw_data,
    getTimestamp,
    getTimestampHumanReadableFormat



};



// function getOrganisationPdfTemplateStoragePath(accountId) {
//     return `UserAccounts/${accountId}/PDFTemplate/${accountId}`;

// }

// function getOrganisationPdfTemplateFetchUrl(accountId) {
//     return `${process.env.HOST}/user/${accountId}/org-pdf-template`;

// }

// function getOrganisationLogoStoragePath(accountId) {
//     return `UserAccounts/${accountId}/Logo/`;

// }

// function getOrganisationLogoFetchUrl(accountId, dimension) {
//     return `${process.env.HOST}/user/${accountId}/org-logo/${dimension}`;

// }

// function getUserAccountFilesStoragePath(accountId) {
//     return `UserAccounts/${accountId}/`;

// }

// function getUserAccountFolderStoragePath() {
//     return `UserAccounts/`;

// }

// function getProjectFileStoragePathOfUserAccount(accountId, projectId) {
//     return `UserAccounts/${accountId}/Projects/${projectId}`;

// }

// function getProjectBaseImageStorageLocation(accountId, projectId) {
//     return `UserAccounts/${accountId}/Projects/${projectId}/BaseImage/${projectId}`;
// }

// function getProjectBaseImageUrl(accountId, projectId) {
//     return `${process.env.HOST}/project/account-id/${accountId}/project-id/${projectId}/base-image`;
// }

// function getProjectOutputImageStorageLocation(accountId, projectId) {
//     return `UserAccounts/${accountId}/Projects/${projectId}/OutputImage/${projectId}`;
// }

// function getProjectOutputImageUrl(accountId, projectId) {
//     return `${process.env.HOST}/project/account-id/${accountId}/project-id/${projectId}/output-image`;
// }

// function getProjectOutputPdfStorageLocation(accountId, projectId) {
//     return `UserAccounts/${accountId}/Projects/${projectId}/OutputPdf/${projectId}`;
// }

// function getProjectOutputPdfUrl(accountId, projectId) {
//     return `${process.env.HOST}/project/account-id/${accountId}/project-id/${projectId}/output-pdf`;
// }

// function getMasterAttributesStorageLocation(categoryId, attributeId) {
//     return `MasterAttributes/${categoryId}/${attributeId}`;
// }



// function getMasterCategorysStorageLocation(categoryId) {
//     return `MasterAttributes/${categoryId}`;
// }

// function getAttributeUrl(categoryId, attributeId) {
//     return `${process.env.HOST}/editor/attributes/master/category-id/${categoryId}/attribute-id/${attributeId}`;
// }



// module.exports = {  
//     getOrganisationPdfTemplateStoragePath,
//     getOrganisationPdfTemplateFetchUrl,
//     getOrganisationLogoStoragePath,
//     getOrganisationLogoFetchUrl,
//     getUserAccountFilesStoragePath, 
//     getProjectBaseImageStorageLocation,
//     getProjectBaseImageUrl,
//     getProjectOutputImageStorageLocation,
//     getProjectOutputImageUrl,
//     getProjectOutputPdfStorageLocation,
//     getProjectOutputPdfUrl,
//     getProjectFileStoragePathOfUserAccount, 
//     getMasterAttributesStorageLocation,
//     getAttributeUrl, 
//     getMasterCategorysStorageLocation, 
//     getUserAccountFolderStoragePath


// };