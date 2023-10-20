mxpy --verbose contract deploy --bytecode=./contract/output/contract.wasm \
--recall-nonce --pem=wallet-owner.pem \
--gas-limit=100000000 \
--arguments str:BTC-2e6739 str:USDT-fb47d0 \
--send --outfile="deploy-devnet.interaction.json" --wait-result \
--proxy=https://devnet-gateway.multiversx.com --chain=D


mxpy --verbose contract deploy --bytecode=./contract/output/contract.wasm \
--recall-nonce --pem=wallet-owner.pem \
--gas-limit=100000000 \
--arguments str:ETH-7fd852 str:USDT-fb47d0 \
--send --outfile="deploy-devnet.interaction.json" --wait-result \
--proxy=https://devnet-gateway.multiversx.com --chain=D