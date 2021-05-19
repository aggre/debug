import { VercelRequest, VercelResponse } from "@vercel/node"
import bent from "bent"
import { config } from "dotenv"

const { GITHUB_CLIENT_SECRETS } = config().parsed && process.env

const headersWithAuth = (token: string) => ({
	Authorization: `bearer ${token}`,
	"User-Agent": "http://localhost",
})

export default async (req: VercelRequest, res: VercelResponse) => {
	const { code } = req.body
	console.log({ code })
	const auth = await bent(
		"https://github.com",
		"POST",
		"json"
	)("/login/oauth/access_token", {
		client_id: "6d3ef2327afe876bd74e",
		client_secret: GITHUB_CLIENT_SECRETS,
		code,
	}).then((r) => r as unknown as { access_token?: string })

	const { access_token } = auth

	const github = bent("https://api.github.com", "POST", "json")
	const headers = headersWithAuth(access_token)
	const result = await github(
		"/graphql",
		{
			query: `{
				viewer {
				  login
				  contributionsCollection(from: "2020-01-01T00:00:00+00:00", to: "2021-01-01T00:00:00+00:00") {
					restrictedContributionsCount
					contributionCalendar {
					  totalContributions
					}
				  }
				}
			  }
			  `,
		},
		headers
	).then(
		(r) =>
			r as unknown as {
				data: {
					viewer: {
						contributionsCollection: {
							restrictedContributionsCount: number
							contributionCalendar: {
								totalContributions: number
							}
						}
					}
				}
			}
	)
	const { totalContributions } =
		result.data.viewer.contributionsCollection.contributionCalendar

	res.send({ totalContributions })
}
