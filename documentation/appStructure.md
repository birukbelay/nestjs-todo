## App Structure

this app have the following folders

### common

- common: where common functions and constants used by the whole app is placed
  - envVars: a file where the enviroment variables are read and configured
  - exception filter
  - logger
  - types.model:
  - util.const

### providers

- providers: provider modules like guards & crypto
  - **crypto**: fuctions related to cryptography, like jwt signig
  - **guards**: authentications & authorization logics to protect resolvers

### apps

- apps: this is where the buisness logic of the app resides, the models like users, Todos and etc..

#### users

- Users: in the users module there are minimal features
  - register: users will register by providing information, there is no verification for their emails, to keep it simple
  - login: users can login by using their email and password, and they will be given access and refresh token
  - the other endpoints are just for demonstration purposes, where we can query, update and remove users, there are lots of thigs missing here but we just implemented those for simplicity
  - the login and register is implemented so as to give acess token for authoriation purposes, refresh token functionality is not implemented
  - 

#### Todos

- Todos: basic todos features are implemented for showcasing, some features like authorization, pagination and etc,
- the guard is implemented on the createTodo resolver and it takes the users id from the token to create the todo,
- **the pagination** is implemented on the queryTodos resolver, where different arguments are used to search and paginate on the todos
- these implementations are simple and are just for demonstrations, i could add advenced querying and optimizations to it but i am trying to keep it simple
- 

### Scoket

- the socket module contains some code that utilizes socket to update the todo by listning on events from  "updateTodo" and notifies all clients listning by using the "todoUpdated" event

### Video Streaming

- the video package can stream videos on the /videos/:filename or /videos/stream/:filename , by getting the filename of the video it can stream if the video name exist in the assets directory

## Testing

- i have written tests for the todo module for its services for different scenarios such as creating, pagination,
- you can find the tests at app/todo/tests/todo.service.spec

## Ci/CD

- i have setup a Ci/Cd pipline using github, assuming i have setup a github actions code on digital ocean to listen for the actions
