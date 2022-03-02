const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const groupSchema = new mongoose.Schema(
	{
		groupName: { type: String, required: false },
		groupLogo: {
			type: String,
			required: false,
			default: "https://res.cloudinary.com/dev-s-den/image/upload/v1641897603/group_placeholder_bscdhj.png",
		},
		groupDescription: { type: String, required: false },
		groupMembers: [
			{
				type: ObjectId,
				ref: "User",
			},
		],
		groupInviteLink: { type: String, required: false },
		groupadminId: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
