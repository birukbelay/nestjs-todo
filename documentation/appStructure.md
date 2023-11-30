## App Structure

this app have the following folders


- common: where common functions and constants used by the whole app is placed
  - envVars: a file where the enviroment variables are read and configured
  - exception filter
  - logger
  - types.model:
  - util.const
- providers: provider modules like guards & crypto
  - crypto: fuctions related to cryptography, like jwt signig
  - guards: authentications & authorization logics to protect resolvers
