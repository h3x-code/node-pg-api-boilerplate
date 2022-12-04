<h1 align="center">
  <!--<br>
  <a href=""><img src="" alt="Logo" width="200"></a>
  <br>-->
  Node Postgres API
  <br>
</h1>

<h4 align="center">Simple node API made on top of express.js</h4>

<p align="center">
Simple boilerplate to start your node api quickly and easily
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Key Features

- Data validation
- Configuration file
- Database connection
- Simple architecture
- Error handling

## Todo

- [ ] Logging
- [ ] Error codes instead of messages
- [ ] API documentation
- [ ] Strings config file
- [ ] Init script to create tables

## Installation

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/h3x-code/node-pg-api-boilerplate.git

# Go into the repository
cd node-pg-api-boilerplate

# Install dependencies
yarn install

# Copy configuration file
cp config/env.config.example.js config/env.config.js

# Edit the enc.config.js file with your postgres database credentials and JWT secret.

# Execute the users.sql in the init/ folder to create the required database table.
psql -U your_username -d dbname_in_env-config -a -f init/users.sql

# Run the app
yarn start
```

## Usage

Coming soon

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag `enhancement`. Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Don't forget to give the project a star! Thanks again!

## License

GPL-3.0

---

> GitHub [@h3x-code](https://github.com/h3x-code)
