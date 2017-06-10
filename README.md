# GoPlay
Stream your music stored in computer from other LAN connected devices.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You will need [Go](https://golang.org) language installed on you computer.

### Installing
Go get the project.

`go get github.com/anarchyrucks/goplay`

### Running
`goplay -root="/path/to/your/music/directory"`

### Flags
| Name | Description                                   | Default |
|------|-----------------------------------------------|---------|
| root | The absolute path to you music directory.     | None    |
| port | The port on which you want to run the server. | 3000    |

### Environment Variables
You can set GOPLAYROOT environment variable as the path to your music directory.
You don't need to provide root flag after setting the variable.

`export GOPLAYROOT=/path/to/your/music/directory`
