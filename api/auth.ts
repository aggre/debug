import { VercelRequest, VercelResponse } from "@vercel/node"
import { config } from "dotenv"
import bent from "bent"

const { GITHUB_CLIENT_SECRETS } = config().parsed

export default async (req: VercelRequest, res: VercelResponse) => {
	const { code } = req.body
	console.log({ code })
	const result = await bent(
		"https://github.com",
		"POST",
		"json"
	)("/login/oauth/access_token", {
		client_id: "6d3ef2327afe876bd74e",
		client_secret: GITHUB_CLIENT_SECRETS,
		code,
	})
	console.log({ result })
	res.send(result)
}
