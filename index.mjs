import FetchNodeDetails from "@toruslabs/fetch-node-details/dist/fetchNodeDetails-node"
import TorusUtils from "@toruslabs/torus.js/dist/torusUtils-node"

const fetchNodeDetails = new FetchNodeDetails()
const torus = new TorusUtils()
const verifier = "github"
const verifierId = "aggre"
fetchNodeDetails
	.getNodeDetails()
	.then(({ torusNodeEndpoints, torusNodePub }) =>
		torus.getPublicAddress(torusNodeEndpoints, torusNodePub, {
			verifier,
			verifierId,
		})
	)
	.then((publicAddress) => console.log(publicAddress))
