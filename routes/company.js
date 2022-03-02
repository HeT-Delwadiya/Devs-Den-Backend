const express = require("express");
const router = express.Router();

const {getCompanyById, getCompany, getAllCompanies, getCompanyBySpeciality, getCompanyByName, getCompanyFollowers, updateCompany, deleteCompany} = require("../controllers/company");
const {isSignedIn, isAuthenticated} = require("../controllers/auth");

router.param("companyId", getCompanyById);

//read
router.get("/company/:companyId", isSignedIn, getCompany);
router.get("/companies/all", isSignedIn, getAllCompanies);
router.get("/company/:companyId/followers", isSignedIn, getCompanyFollowers);

router.post("/company/search/speciality", getCompanyBySpeciality);
router.post("/company/search/name", getCompanyByName);

//update
router.put("/company/:companyId/update", isSignedIn, isAuthenticated, updateCompany);

//delete
router.delete("/company/:companyId/delete", isSignedIn, isAuthenticated, deleteCompany);

module.exports = router;