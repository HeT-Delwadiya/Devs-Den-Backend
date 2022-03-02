const express = require("express");
const router = express.Router();

const { getContactById, createContact, getContact, getAllContacts } = require("../controllers/contact");

router.param("contactId", getContactById);

//create
router.post("/contact/new", createContact);

//read
router.get("/contact/:contactId", getContact);
router.get("/contacts/all", getAllContacts);

module.exports = router;