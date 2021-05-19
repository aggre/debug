import { VercelRequest, VercelResponse } from "@vercel/node"
import bent from "bent"
import { config } from "dotenv"

const { GITHUB_CLIENT_SECRETS } = config().parsed

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
	const viwer = await github(
		"/graphql",
		{
			query: `{
			viewer {
			  login
			}
		  }`,
		},
		headers
	).then(
		(r) =>
			r as unknown as {
				data: {
					viewer: {
						login: string
					}
				}
			}
	)
	const { login } = viwer.data.viewer
	console.log({ login })
	const result = await github(
		"/graphql",
		{
			query: `{
				user(login: "${login}") {
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
					user: {
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
		result.data.user.contributionsCollection.contributionCalendar

	res.send({ totalContributions })
}
