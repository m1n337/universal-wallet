# Universal Wallet

```bash
Usage: uwallet [options] [command]

// | | ._  o     _  ._ _  _. |   \    / _. | |  _ _|_  _
// |_| | | | \/ (/_ | _> (_| |    \/\/ (_| | | (/_ |_ _>

Universal Wallet: An universal wallet for multi blockchain player
```


## Usage

### EVM compatible blockchain:

- `uwallet evm gen [options] [number]`: generate random ethereum wallets

```bash
$ uwallet evm gen
- Successfully generated wallet:
  ----------------------------------------------------------------------------------------------
|>   [LOG] address: 0xF120Aec5f92fBe8DAfa77938CF4CF248807C4961                                  |
|>   [LOG] *mnemonic: uncover when young fire arm chunk kiss journey ride rival senior menu     |
|>   [LOG] *private key: 0x9e258ed3478c51b89e706ca8a33fc698e6543e8d3e806a17f8e86556f4fb9180     |
  ----------------------------------------------------------------------------------------------

$ uwallet evm gen 2
  ---------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xE5f6e36C636565Bb980a344fF252ae9748CaeD76                                       |
|>   [LOG] *mnemonic: hazard blast cause purse sell hurt occur about detect human enroll inherit     |
|>   [LOG] *private key: 0xe36974cb7dee5058a311f4d920497a281c8f97caf2813992d63985bee004617b          |
  ---------------------------------------------------------------------------------------------------
- Successfully generated wallet:
  ------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0x4DF270a2F0cF0105014d224bFa0155B1d1F3a952                                          |
|>   [LOG] *mnemonic: latin behind manage scheme record erosion menu impulse forget turn wasp fatal     |
|>   [LOG] *private key: 0xb4cdb45b8e627d1064b0a0051600e8a09165cb5dc68d7be48c70d6dc0d171e9e             |
  ------------------------------------------------------------------------------------------------------

$ uwallet evm gen -s test_keystore
- Successfully generated wallet:
  ---------------------------------------------------------------------------------------------------
|>   [LOG] address: 0x5de404f7aAC832cc3b7fffdFa2DF19114966e9d5                                       |
|>   [LOG] *mnemonic: amount pizza seat ramp sorry finger slim category relief enact pride flush     |
|>   [LOG] *private key: 0x0c828a087d5b4d30b505369df5915cefb40b6c277f2414ec36bebbd827f9dba6          |
  ---------------------------------------------------------------------------------------------------
? Enter your password: ********
? Confirm your password: ********
- wallet 0x5de404f7..4966e9d5 is saved to: test_keystore/0x5de404f7aAC832cc3b7fffdFa2DF19114966e9d5.json

$ uwallet evm gen 2 -s test_keystore -l my_wallet_0,my_wallet_1
- Successfully generated wallet:
  ---------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xfF9a9e5B91B43744C304c6A5418244B77A7acA85                                             |
|>   [LOG] *mnemonic: quarter mammal immense flee mosquito hub cloth elegant music save satoshi affair     |
|>   [LOG] *private key: 0xed3b3aeda5694c5e7934c174172a9b5eb740c238f4ff0198d52c67f7bbd5eea0                |
  ---------------------------------------------------------------------------------------------------------
- Successfully generated wallet:
  ----------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0x2Ead8831C224B0b9D2172f17884D830C621EAe83                                              |
|>   [LOG] *mnemonic: sunset universe expire stand mixture slot truth tank doctor blanket label replace     |
|>   [LOG] *private key: 0xb5a5432296fb85f8378303985ae048bd02a9699350d14da78ecb46459baca73b                 |
  ----------------------------------------------------------------------------------------------------------
? Enter your password: ********
? Confirm your password: ********
- wallet 0xfF9a9e5B..7A7acA85 is saved to: test_keystore/my_wallet_0-0xfF9a9e5B91B43744C304c6A5418244B77A7acA85.json
- wallet 0x2Ead8831..621EAe83 is saved to: test_keystore/my_wallet_1-0x2Ead8831C224B0b9D2172f17884D830C621EAe83.json

$ uwallet evm gen -e 'echo "private_key_env=${PK}"'
- Successfully generated wallet:
  ------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                          |
|>   [LOG] *mnemonic: essence farm lawsuit question fortune cushion jewel loyal pizza oil net alter     |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963             |
  ------------------------------------------------------------------------------------------------------
private_key_env=0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963
```

- `uwallet evm import [options]`: import your ethereum wallet from mnemonic / private key

```bash
$ uwallet evm import -m
- Successfully imported your wallet from mnemonic:
  ------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                          |
|>   [LOG] *mnemonic: essence farm lawsuit question fortune cushion jewel loyal pizza oil net alter     |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963             |
  ------------------------------------------------------------------------------------------------------

$ uwallet evm import -m -i
? Enter your No. 1 mnemonic: *******
? Enter your No. 2 mnemonic: ****
...
? Enter your No. 12 mnemonic: *****
- Successfully imported your wallet from mnemonic:
  ------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                          |
|>   [LOG] *mnemonic: essence farm lawsuit question fortune cushion jewel loyal pizza oil net alter     |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963             |
  ------------------------------------------------------------------------------------------------------

$ uwallet evm import -p
? Enter your private key: ******************************************************************
- Successfully imported your wallet from the private key:
  -------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                           |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963              |
  -------------------------------------------------------------------------------------------------------

$ uwallet evm import -p -s test_keystore -l my_wallet
- Successfully imported your wallet from the private key:
  -------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                           |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963              |
  -------------------------------------------------------------------------------------------------------
? Enter your password: ********
? Confirm your password: ********
- wallet 0xa58E1813..1a76F128 is saved to: test_keystore/my_wallet-0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128.json

$ uwallet evm import -p -e 'echo "private_key_env=${PK}"'
? Enter your private key: ******************************************************************
- Successfully imported your wallet from the private key:
  -------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                           |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963              |
  -------------------------------------------------------------------------------------------------------
private_key_env=0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963
```

- `uwallet evm recover [options] <filePath>`: recover your ethereum wallet from the encrypt keystore file

```bash
$ uwallet evm recover test_keystore/my_wallet-0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128.json
? Enter your password: ********
? Confirm your password: ********
- Successful recovered your wallet:
  -------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                           |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963              |
  -------------------------------------------------------------------------------------------------------

$ uwallet evm recover test_keystore/my_wallet-0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128.json -e 'echo "private_key_env=${PK}"'
? Enter your password: ********
? Confirm your password: ********
- Successful recovered your wallet:
  -------------------------------------------------------------------------------------------------------
|>   [LOG] address: 0xa58E1813dB168cEe7C8c33A714e8C0C41a76F128                                           |
|>   [LOG] *private key: 0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963              |
  -------------------------------------------------------------------------------------------------------
private_key_env=0x3df17b24ca411648b993213ff8a3c7b46936df18a0ce6cf3aca574728e286963
```

## TODO

- [x] support EVM wallet
    - feature: generate randome wallet
    - feature: import wallet from mnemonic / private key
    - feature: recover wallet from encrypt keystore file
    - feature: inject private key into the sub process and execute any cmd
    - [pending]: blockchain provider
    - [pending]: sign / send transaction

- [ ] support Cosmos wallet

- [ ] support Bitcoin wallet

- [ ] support Solona wallet