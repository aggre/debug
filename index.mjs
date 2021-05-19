import FetchNodeDetails from "@toruslabs/fetch-node-details"
import TorusUtils from "@toruslabs/torus.js"

const fetchNodeDetails = new FetchNodeDetails()
const torus = new TorusUtils()
const verifier = "google"
const verifierId = "hiroyuki.aggre@gmail.com"
fetchNodeDetails
	.getNodeDetails()
	.then(({ torusNodeEndpoints, torusNodePub }) =>
		torus.getPublicAddress(torusNodeEndpoints, torusNodePub, {
			verifier,
			verifierId,
		})
	)
	.then((publicAddress) => console.log(publicAddress))
