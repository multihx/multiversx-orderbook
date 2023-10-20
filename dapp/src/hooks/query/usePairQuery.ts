import { contractsMap } from 'utils/pairContract';
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { ResultsParser } from '@multiversx/sdk-core/out';

const proxyNetworkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

export const useQuery = () => {
    const getAddressOrderIds = async (market: string, address: string) => {
        const smartContract = contractsMap.get(market);
        let interaction = smartContract.methods.getAddressOrderIds([address]);
        let query = interaction.check().buildQuery();
        let queryResponse = await proxyNetworkProvider.queryContract(query);
        let typedBundle = new ResultsParser().parseQueryResponse(queryResponse, interaction.getEndpoint());
        let orderIdList = typedBundle.values[0].valueOf()
        // console.log('orderIdList', orderIdList);
        let orderIds: any = [];
        await Promise.all(orderIdList.map(async (orderId: any) => {
            let order = orderId.toString();
            orderIds.push(order)
        }))
        // console.log('orderIds', orderIds);
        return orderIds
    }

    const getOrderById = async (market: string, _id: number) => {
        const smartContract = contractsMap.get(market);
        let interaction = smartContract.methods.getOrderById([_id]);

        let query = interaction.check().buildQuery();
        let queryResponse = await proxyNetworkProvider.queryContract(query);
        let typedBundle = new ResultsParser().parseQueryResponse(queryResponse, interaction.getEndpoint());

        let order = typedBundle.values[0].valueOf()
        const { id, creator, input_amount, output_amount } = order
        // console.log(id.toString())
        // console.log(creator.toString())
        // console.log(input_amount.toString())
        // console.log(output_amount.toString())

        return order
    }

    return {
        getAddressOrderIds,
        getOrderById
    };
};
