const express = require("express");
const router = express.Router();

const {getCodeById, getCode, saveCode, updateCode, deleteCode, compilerApi, fetchResult} = require("../controllers/compiler");

router.param("codeId", getCodeById);

//read
router.get("/compiler/code/:codeId", getCode);

//create
router.post("/compiler/code/save", saveCode);

//update
router.put("/compiler/code/:codeId/update", updateCode);

//delete
router.delete("/compiler/code/:codeId/delete", deleteCode);

//Get data and send it to G4G's API
router.post("/compiler/api", compilerApi);

//Fetch result from G4G's API by sid
router.post("/compiler/result/fetch", fetchResult);

module.exports = router;