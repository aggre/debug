import { VercelRequest, VercelResponse } from "@vercel/node"
import bent from "bent"

const headersWithAuth = (token: string) => ({
	Authorization: `bearer ${token}`,
	"User-Agent": "http://localhost",
})

export default async (req: VercelRequest, res: VercelResponse) => {
	const { access_token } = req.body
	console.log({ access_token })
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
			(r as unknown) as {
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
			(r as unknown) as {
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
	const {
		totalContributions,
	} = result.data.user.contributionsCollection.contributionCalendar

	res.send({ totalContributions })
}
